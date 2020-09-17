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
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'


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

    let {requestProducts, inventory: inventoryForCalcs} = props

    productsByPriority = requestProducts
      .sort((a, b) => {
        let aRequestDate = moment(a.order_request_date, dateFormat)
        let bRequestDate = moment(b.order_request_date, dateFormat)
        return a.priority > b.priority ? -1
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
        return {...requestProduct,
          pending_to_produce: pendingToProduceKilos,
          given_inventory_kilos: givenInventoryKilos
        }
      })

    props.products.forEach(product => {
      if (product.product_type_id === 1 || product.product_type_id === 2) {
        let isAlreadyInGroup = widthAndCaliberGroups.find(item => {
          return item.width === product.width
        })
        if (!isAlreadyInGroup) {
          widthAndCaliberGroups.push({width: product.width, kilos: 0})
        }
      }
    })

    materials = props.materials
      .map(material => {
        return {
          ...material,
          kilos: 0
        }
      })

    productsByPriority.forEach(product => {
      let item =  widthAndCaliberGroups.find(item => {
        return item.width === product.product_width
      })
      let material = materials.find(mat => {
        return mat.id === product.material_id
      })
      item.kilos += product.pending_to_produce
      material.kilos += product.pending_to_produce
    })

    widthAndCaliberGroups = widthAndCaliberGroups.sort((a, b) => {
      return a.kilos > b.kilos ? -1 : a.kilos < b.kilos ? 1
        : a.width > b.width ? -1 : a.width < b.width ? 1 : 0
    })

    console.log(materials)

  }



  const MaterialTable = (
    <TableContainer className={classes.table} style={{maxHeight: 800}}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Subtipo</TableCell>
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
                  <TableCell>{formatNumber(material.kilos)}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )


  const WidthAndCaliberTable = (
    <TableContainer className={classes.table} style={{maxHeight: 800}}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Ancho</TableCell>
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
                  <TableCell>{formatNumber(item.kilos)}</TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )


  const ProductsOrderByPriorityTable = (
    <TableContainer className={classes.table} style={{maxHeight: 800}}>
      <Table aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
            <TableCell>Folio</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Producto</TableCell>
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
                <TableRow key={product.product_id + '' + product.order_request_id}>
                  <TableCell>&nbsp;</TableCell>
                  <TableCell>{product.order_code}</TableCell>
                  <TableCell>{product.client_name}</TableCell>
                  <TableCell>{product.priority}</TableCell>
                  <TableCell>{product.product_description}</TableCell>
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
    requestsProducts: state.sales.requestsProducts,
    inventory: state.general.inventory,
    materials: state.production.materials,
    products: state.production.products
  }
}
export default connect(mapStateToProps, null)(RequestsProductsTable)