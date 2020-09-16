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


  let rows = []

  if (props.requestProducts) {

    let {requestProducts, inventory: inventoryForCalcs} = props

    rows = requestProducts
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

  }

  return (
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
              rows.map(row => {
                return (
                  <TableRow key={row.product_id + '' + row.order_request_id}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>{row.order_code}</TableCell>
                    <TableCell>{row.client_name}</TableCell>
                    <TableCell>{row.priority}</TableCell>
                    <TableCell>{row.product_description}</TableCell>
                    <TableCell>{row.order_request_date}</TableCell>
                    <TableCell>{row.order_request_kilos}</TableCell>
                    <TableCell>{row.order_sale_delivered_kilos}</TableCell>
                    <TableCell>{row.given_inventory_kilos}</TableCell>
                    <TableCell>{row.pending_to_produce}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
  );
}

RequestsProductsTable.propTypes = {
  requestsProducts: PropTypes.array.isRequired,
  inventory: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    requests: state.sales.requests,
    requestsProducts: state.sales.requestsProducts,
    inventory: state.general.inventory
  }
}
export default connect(mapStateToProps, null)(RequestsProductsTable)