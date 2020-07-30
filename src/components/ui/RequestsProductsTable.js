import React from 'react'
import {connect} from 'react-redux'

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

function RequestsProductsTable(props) {
  const classes = useStyles();

  const headers = ['Folio', 'Cliente', 'Producto', 'Cantidad solicitada', 'Inventario fisico']
  const rows = []
  props.requestsProducts.forEach(requestProduct => {
    if (requestProduct.order_request_status_id === 2) {
      const inventoryProduct = props.inventory.find(inventoryElement => {
        return inventoryElement.product_id === requestProduct.product_id
      })
      rows.push([requestProduct.order_code,
        requestProduct.client_name,
        requestProduct.product_description,
        formatNumber(requestProduct.product_kilos),
        formatNumber(inventoryProduct ? inventoryProduct.kilos_balance : '-')])
    }
  })

  return (
      <TableContainer className={classes.table} style={{maxHeight: 500}}>
        <Table aria-label="simple table" stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map(header => {
                return (<TableCell>{header}</TableCell>)
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={'row' + rowIndex}>
                {row.map((item, rowItemIndex) => {
                  return (<TableCell key={'rowItem' + rowIndex + '' + rowItemIndex}>{item}</TableCell>)
                })}
              </TableRow>
            ))}
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