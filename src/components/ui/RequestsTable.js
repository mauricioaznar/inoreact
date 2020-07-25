import React from 'react'
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
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default function RequestsTable(props) {
  const classes = useStyles();

  const headers = ['Codigo', 'Cliente', 'Producto', 'Cantidad solicitada', 'Inventario fisico']
  const rows = []
  props.requestsProducts.forEach(requestProduct => {
    if (requestProduct.order_request_status_id === 2) {
      const inventoryProduct = props.inventory.find(inventoryElement => {
        return inventoryElement.id === requestProduct.product_id
      })
      const inventoryBalance = inventoryProduct.kilos_cut + inventoryProduct.kilos_adjusted - inventoryProduct.kilos_sold_given
      rows.push([requestProduct.order_code, requestProduct.client_name, requestProduct.product_description, formatNumber(requestProduct.product_kilos), formatNumber(inventoryBalance)])
    }
  })

  return (
      <TableContainer className={classes.table}>
        <Table aria-label="simple table">
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

RequestsTable.propTypes = {
  requestsProducts: PropTypes.array.isRequired,
  inventory: PropTypes.array.isRequired
}