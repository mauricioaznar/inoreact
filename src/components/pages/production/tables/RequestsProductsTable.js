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

  let type = props.type || 'products'

  if (props.requestProducts) {

    let {requestProducts, inventory} = props

    let inventoryForCalcs = JSON.parse(JSON.stringify(inventory))

    console.log(inventoryForCalcs)

    productsByPriority = requestProducts
      .sort((a, b) => {
        let aRequestDate = moment(a.order_request_date, dateFormat)
        let bRequestDate = moment(b.order_request_date, dateFormat)
        return a.order_request_status_id > b.order_request_status_id ? -1
          : a.order_request_status_id < b.order_request_status_id ? 1
            : a.priority > b.priority ? -1
              : a.priority < b.priority ? 1
                : aRequestDate.isBefore(bRequestDate) ? -1
                  : aRequestDate.isAfter(bRequestDate) ? 1
                    : 0
      })
      .map((requestProduct) => {
        let inventoryProduct = inventoryForCalcs.find(product => {
          return product.product_id === requestProduct.product_id
        })
        let requestKilos = requestProduct.order_request_kilos
        let saleDeliveredKilos = requestProduct.order_sale_delivered_kilos
        let requestNetKilos = (requestKilos < saleDeliveredKilos) ?
          0 : (requestKilos - saleDeliveredKilos)
        let inventoryKilos = inventoryProduct && inventoryProduct.kilos_balance ? inventoryProduct.kilos_balance : 0
        let givenInventoryKilos
        if (requestNetKilos > 0 && inventoryKilos > 0) {
          if (requestNetKilos > inventoryKilos) {
            givenInventoryKilos = inventoryKilos
            inventoryProduct.kilos_balance = 0
          } else {
            givenInventoryKilos = requestNetKilos
            inventoryProduct.kilos_balance =  inventoryKilos - requestNetKilos
          }
        } else {
          givenInventoryKilos = 0
        }
        let pendingToProduceKilos = requestNetKilos - givenInventoryKilos
        return {
          ...requestProduct,
          pending_to_produce: pendingToProduceKilos,
          given_inventory_kilos: givenInventoryKilos
        }
      })

    props.products.forEach(product => {
      if (product.product_type_id === 1 || product.product_type_id === 2) {
        let material= props.materials.find(material => {
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
            kilos: 0,
            kilos_in_prod: 0,
            kilos_pending: 0
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
          kilos: 0,
          kilos_in_prod: 0,
          kilos_pending: 0
        }
      })

    productsByPriority.forEach(product => {
      if (product.product_id === 17) {
        console.log(product)
      }

      if (product.product_type_id === 1 || product.product_type_id === 2) {
        let wcGroup =  widthAndCaliberGroups.find(item => {
          return item.width === product.product_width
            && item.calibre === product.product_calibre
            && item.material_name === product.material_name
        })
        let material = materials.find(mat => {
          return mat.id === product.material_id
        })
        if (wcGroup) {
          wcGroup.kilos += product.pending_to_produce
          if (product.order_request_status_id === 1) {
            wcGroup.kilos_pending += product.pending_to_produce
          } else if (product.order_request_status_id === 2) {
            wcGroup.kilos_in_prod += product.pending_to_produce
          }
        }
        if (material) {
          material.kilos += product.pending_to_produce
          if (product.order_request_status_id === 1) {
            material.kilos_pending += product.pending_to_produce
          } else if (product.order_request_status_id === 2) {
            material.kilos_in_prod += product.pending_to_produce
          }
        }
      }
    })

    widthAndCaliberGroups = widthAndCaliberGroups
      .sort((a, b) => {
        return a.width > b.width ? -1 : a.width < b.width ? 1
        : a.calibre > b.calibre ? -1 : a.calibre < b.calibre ? 1
          : a.material_name > b.material_name ? -1 : a.material_name < b.material_name ? 1
            : a.kilos > b.kilos ? -1 : a.kilos < b.kilos ? 1 : 0
      })
      .filter(item => item.kilos !== 0)

    materials = materials
      .sort((a, b) => {
        return a.kilos > b.kilos ? -1 : a.kilos < b.kilos ? 1 : 0
      })
      .filter(material => material.kilos !== 0)

    productsByPriority = productsByPriority
      .filter(product => product.pending_to_produce !== 0)
  }



  const MaterialTable = (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Subtipo</TableCell>
            <TableCell>Kilos en prod</TableCell>
            <TableCell>Kilos pendientes</TableCell>
            <TableCell>Kilos por producir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            materials.map(material => {
              return (
                <TableRow key={material.id}>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell align={'right'}>{formatNumber(material.kilos_in_prod)}</TableCell>
                  <TableCell align={'right'}>{formatNumber(material.kilos_pending)}</TableCell>
                  <TableCell align={'right'}>{formatNumber(material.kilos)}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )


  const WidthAndCaliberTable = (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Ancho</TableCell>
            <TableCell>Calibre</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Kilos en prod</TableCell>
            <TableCell>Kilos pendientes</TableCell>
            <TableCell>Kilos por extruir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            widthAndCaliberGroups.map(item => {
              return (
                <TableRow key={item.width}>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>{item.width}</TableCell>
                  <TableCell>{item.calibre}</TableCell>
                  <TableCell>{item.material_name}</TableCell>
                  <TableCell align={'right'}>{formatNumber(item.kilos_in_prod)}</TableCell>
                  <TableCell align={'right'}>{formatNumber(item.kilos_pending)}</TableCell>
                  <TableCell align={'right'}>{formatNumber(item.kilos)}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )


  const ProductsOrderByPriorityTable = (
    <TableContainer className={classes.table}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Folio</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Fecha de solicitud</TableCell>
            <TableCell>Kilos solicitados</TableCell>
            <TableCell>Kilos vendidos</TableCell>
            <TableCell>Kilos asignados del inventario</TableCell>
            <TableCell>Kilos pendientes por producir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            productsByPriority.map(product => {
              return (
                <TableRow key={product.order_request_product_id}>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>{product.order_code}</TableCell>
                  <TableCell>{product.client_name}</TableCell>
                  <TableCell>{product.order_request_status_name}</TableCell>
                  <TableCell>{product.priority}</TableCell>
                  <TableCell>{product.product_description}</TableCell>
                  <TableCell>{product.material_name}</TableCell>
                  <TableCell>{product.order_request_date}</TableCell>
                  <TableCell>{product.order_request_kilos}</TableCell>
                  <TableCell>{product.order_sale_delivered_kilos}</TableCell>
                  <TableCell>{product.given_inventory_kilos}</TableCell>
                  <TableCell>{product.pending_to_produce}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )

  return type === 'products' ? ProductsOrderByPriorityTable
    : type === 'extrusion' ? WidthAndCaliberTable
    : type === 'materials' ? MaterialTable
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