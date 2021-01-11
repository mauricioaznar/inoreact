import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

import {makeStyles, useTheme} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Collapse from '@material-ui/core/Collapse'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles({
  table: {
    display: 'block',
    overflow: 'auto',
  }
});

const formatNumber = (x) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const dateFormat = 'YYYY-MM-DD'


function RequestsProductsTable(props) {
  const classes = useStyles();

  let productsByPriority = []

  let widthAndCaliberGroups = []

  let materials = []

  let products = []

  let type = props.type

  console.log(props.requestProducts)

  if (props.requestProducts) {

    let {requestProducts, inventory} = props

    productsByPriority = requestProducts
      .sort((a, b) => {
        let aRequestDate = moment(a.order_request_estimated_delivery_date, dateFormat)
        let bRequestDate = moment(b.order_request_estimated_delivery_date, dateFormat)
        return a.order_request_status_id > b.order_request_status_id ? -1
          : a.order_request_status_id < b.order_request_status_id ? 1
            : a.priority > b.priority ? -1
              : a.priority < b.priority ? 1
                : aRequestDate.isBefore(bRequestDate) ? -1
                  : aRequestDate.isAfter(bRequestDate) ? 1
                    : 0
      })

    props.products.forEach(product => {
      if (product.product_type_id === 1 || product.product_type_id === 2) {
        let material = props.materials.find(material => {
          return material.id === product.material_id
        })
        let isAlreadyInGroup = widthAndCaliberGroups.find(item => {
          return item.width === product.width
          && item.calibre === product.calibre
          && item.material_name === material ? material.name : ''
        })
        if (!isAlreadyInGroup) {
          widthAndCaliberGroups.push({
            width: product.width,
            calibre: product.calibre,
            material_name: material.name,
            kilos_balance: 0,
            kilos_requested: 0,
            kilos_in_prod: 0,
            kilos_pending: 0,
            request_products: []
          })
        }
      }
    })

    materials = props.materials
      .filter(material => {
        return material.product_type_id === 1 || material.product_type_id === 2
      })
      .map(material => {
        return {
          ...material,
          kilos_balance: 0,
          kilos_requested: 0,
          kilos_in_prod: 0,
          kilos_pending: 0,
          request_products: []
        }
      })

    products = props.products
      .filter(product => {
        return product.product_type_id === 1 || product.product_type_id === 2
      })
      .map(product => {
        return {
          ...product,
          kilos_balance: 0,
          kilos_requested: 0,
          kilos_in_prod: 0,
          kilos_pending: 0,
          request_products: []
        }
      })


    productsByPriority.forEach(productByPriority => {
      if (productByPriority.product_type_id === 1 || productByPriority.product_type_id === 2) {
        let wcGroup = widthAndCaliberGroups.find(item => {
          return item.width === productByPriority.product_width
            && item.calibre === productByPriority.product_calibre
            && item.material_name === productByPriority.material_name
        })
        let material = materials.find(mat => {
          return mat.id === productByPriority.material_id
        })
        let product = products.find(product => {
          return product.id === productByPriority.product_id
        })
        if (wcGroup) {
          wcGroup.kilos_requested += productByPriority.order_request_kilos
          if (productByPriority.order_request_status_id === 1) {
            wcGroup.kilos_pending += productByPriority.order_request_kilos
          } else if (productByPriority.order_request_status_id === 2) {
            wcGroup.kilos_in_prod += productByPriority.order_request_kilos
          }
          wcGroup.request_products.push(productByPriority)
        }
        if (material) {
          material.kilos_requested += productByPriority.order_request_kilos
          if (productByPriority.order_request_status_id === 1) {
            material.kilos_pending += productByPriority.order_request_kilos
          } else if (productByPriority.order_request_status_id === 2) {
            material.kilos_in_prod += productByPriority.order_request_kilos
          }
          material.request_products.push(productByPriority)
        }
        if (product) {
          product.kilos_requested += productByPriority.order_request_kilos
          if (productByPriority.order_request_status_id === 1) {
            product.kilos_pending += productByPriority.order_request_kilos
          } else if (productByPriority.order_request_status_id === 2) {
            product.kilos_in_prod += productByPriority.order_request_kilos
          }
          product.request_products.push(productByPriority)
        }
      }
    })

    props.inventory.forEach((inventoryProduct) => {
      if (inventoryProduct.product_type_id === 1 || inventoryProduct.product_type_id === 2) {
        let wcGroup = widthAndCaliberGroups.find(item => {
          return item.width === inventoryProduct.product_width
            && item.calibre === inventoryProduct.product_calibre
            && item.material_name === inventoryProduct.material_name
        })
        let material = materials.find(mat => {
          return mat.id === inventoryProduct.material_id
        })
        let product = products.find(product => {
          return product.id === inventoryProduct.product_id
        })
        if (wcGroup) {
          wcGroup.kilos_balance += inventoryProduct.kilos_balance
        }
        if (material) {
          material.kilos_balance += inventoryProduct.kilos_balance
        }
        if (product) {
          product.kilos_balance += inventoryProduct.kilos_balance
        }
      }
    })

    widthAndCaliberGroups = widthAndCaliberGroups
      .sort((a, b) => {
        return a.width > b.width ? -1 : a.width < b.width ? 1
          : a.calibre > b.calibre ? -1 : a.calibre < b.calibre ? 1
            : a.material_name > b.material_name ? -1 : a.material_name < b.material_name ? 1
              : a.kilos_requested > b.kilos_requested ? -1 : a.kilos_requested < b.kilos_requested ? 1 : 0
      })
      .filter(item => item.kilos_requested !== 0)

    materials = materials
      .sort((a, b) => {
        return a.kilos_requested > b.kilos_requested ? -1 : a.kilos_requested < b.kilos_requested ? 1 : 0
      })
      .filter(material => material.kilos_requested !== 0)

    products = products
      .sort((a, b) => {
        return a.material_id > b.material_id ? -1 : a.material_id < b.material_id ? 1
          : a.kilos_requested > b.kilos_requested ? -1 : a.kilos_requested < b.kilos_requested ? 1 : 0
      })
      .filter(product => product.kilos_requested !== 0)
  }


  const RequestProductRow = (props) => {

    const {requestProducts, open, setOpen} = props

    return (
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0}}
          colSpan={10}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Table
                aria-label="purchases"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                    <TableCell># Pedido</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fecha estimada de entrega</TableCell>
                    <TableCell>Kilos solicitados</TableCell>
                    <TableCell>Kilos vendidos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestProducts.map((requestProduct, index) => (
                    <TableRow key={requestProduct.expense_subcategory_id}>
                      <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                      <TableCell>{requestProduct.order_code}</TableCell>
                      <TableCell>{requestProduct.client_name}</TableCell>
                      <TableCell>{requestProduct.order_request_status_name}</TableCell>
                      <TableCell>{requestProduct.order_request_estimated_delivery_date}</TableCell>
                      <TableCell align={'right'}>{formatNumber(requestProduct.order_request_kilos)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(requestProduct.order_sale_delivered_kilos)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    )
  }


  const MaterialTable = (props) => {

    const MaterialTableRow = (props) => {

      const material = props.material

      const [open, setOpen] = React.useState(false);

      return (
        <React.Fragment>
          <TableRow key={material.id}>
            <TableCell style={{width: '5%'}}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{material.name}</TableCell>
            <TableCell align={'right'}>{formatNumber(material.kilos_balance)}</TableCell>
            <TableCell align={'right'}>{formatNumber(material.kilos_in_prod)}</TableCell>
            <TableCell align={'right'}>{formatNumber(material.kilos_pending)}</TableCell>
            <TableCell align={'right'}>{formatNumber(material.kilos_requested)}</TableCell>
          </TableRow>
          <RequestProductRow
            open={open}
            requestProducts={material.request_products}
          />
        </React.Fragment>
      )
    }

    return (
      <Grid
        container
        direction={'column'}
      >
       <Grid
         item
         xs
         style={{marginBottom: '2em'}}
       >
         <Typography variant={'h4'}>
           Inventario por subtipos
         </Typography>
       </Grid>
       <Grid
         item
         xs
       >
        <TableContainer className={classes.table}>
          <Table
            aria-label="simple table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                <TableCell>Subtipo</TableCell>
                <TableCell>Kilos en inventario</TableCell>
                <TableCell>Kilos en producción</TableCell>
                <TableCell>Kilos pendientes</TableCell>
                <TableCell>Kilos solicitados</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                materials.map(material => {
                  return (
                    <MaterialTableRow
                      key={material.id}
                      material={material}
                    />
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
       </Grid>
     </Grid>
    )
  }

  const ProductsTable = (props) => {

    const ProductTableRow = (props) => {

      const product = props.product

      const [open, setOpen] = React.useState(false);

      return (
        <React.Fragment>
          <TableRow key={product.id}>
            <TableCell style={{width: '5%'}}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell align={'right'}>{formatNumber(product.kilos_balance)}</TableCell>
            <TableCell align={'right'}>{formatNumber(product.kilos_in_prod)}</TableCell>
            <TableCell align={'right'}>{formatNumber(product.kilos_pending)}</TableCell>
            <TableCell align={'right'}>{formatNumber(product.kilos_requested)}</TableCell>
          </TableRow>
          <RequestProductRow
            open={open}
            requestProducts={product.request_products}
          />
        </React.Fragment>
      )
    }

    return (
      <Grid
        container
        direction={'column'}
      >
       <Grid
         item
         xs
         style={{marginBottom: '2em'}}
       >
         <Typography variant={'h4'}>
           Inventario por productos
         </Typography>
       </Grid>
        <Grid item xs>
          <TableContainer className={classes.table}>
            <Table
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Kilos en inventario</TableCell>
                  <TableCell>Kilos en producción</TableCell>
                  <TableCell>Kilos pendientes</TableCell>
                  <TableCell>Kilos solicitados</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  products.map(product => {
                    return <ProductTableRow
                      key={product.id}
                      product={product}
                    />
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    )
  }

  const WidthAndCaliberTable = (props) => {

    const WidthAndCaliberTableRow = (props) => {

      const wcGroup = props.wcGroup

      const [open, setOpen] = React.useState(false);

      return (
        <React.Fragment>
          <TableRow key={`${wcGroup.width}${wcGroup.calibre}${wcGroup.material_name}`}>
            <TableCell style={{width: '5%'}}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell>{wcGroup.width}</TableCell>
            <TableCell>{wcGroup.calibre}</TableCell>
            <TableCell>{wcGroup.material_name}</TableCell>
            <TableCell align={'right'}>{formatNumber(wcGroup.kilos_balance)}</TableCell>
            <TableCell align={'right'}>{formatNumber(wcGroup.kilos_in_prod)}</TableCell>
            <TableCell align={'right'}>{formatNumber(wcGroup.kilos_pending)}</TableCell>
            <TableCell align={'right'}>{formatNumber(wcGroup.kilos_requested)}</TableCell>
          </TableRow>
          <RequestProductRow
            open={open}
            requestProducts={wcGroup.request_products}
          />
        </React.Fragment>
      )
    }

    return (
      <Grid
        container
        direction={'column'}
      >
        <Grid
          item
          xs
          style={{marginBottom: '2em'}}
        >
         <Typography variant={'h4'}>
           Inventario por ancho, calibre y subtipo
         </Typography>
        </Grid>
        <Grid item xs>
          <TableContainer className={classes.table}>
            <Table
              aria-label="simple table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                  <TableCell>Ancho</TableCell>
                  <TableCell>Calibre</TableCell>
                  <TableCell>Subtipo</TableCell>
                  <TableCell>Kilos en inventario</TableCell>
                  <TableCell>Kilos en producción</TableCell>
                  <TableCell>Kilos pendientes</TableCell>
                  <TableCell>Kilos solicitados</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  widthAndCaliberGroups.map(item => {
                    return (
                      <WidthAndCaliberTableRow wcGroup={item} />
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    )
  }

  return type === 'extrusion' ? <WidthAndCaliberTable />
    : type === 'materials' ? <MaterialTable />
      : type === 'products' ? <ProductsTable />
        : null;
}

RequestsProductsTable.propTypes = {
  requestsProducts: PropTypes.array.isRequired,
  inventory: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    materials: state.production.materials,
    products: state.production.products
  }
}
export default connect(mapStateToProps, null)(RequestsProductsTable)