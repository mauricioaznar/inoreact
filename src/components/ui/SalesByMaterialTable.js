import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const dateFormat = 'YYYY-MM-DD'



function compare( a, b ) {
  if ( a.total < b.total ){
    return 1;
  }
  if ( a.total > b.total ){
    return -1;
  }
  return 0;
}



function SalesByMaterialTable(props) {
  const classes = useStyles();

  let sales =  []


  if (props.sales) {
    sales = props.sales.sales
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .sort(compare)
  }

  return (
    <>
      <TableContainer
        component={Paper}
      >
        <Table
          className={classes.table}
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
              <TableCell style={{width: '20%'}} align="center">Producto</TableCell>
              <TableCell style={{width: '10%'}} align="center">Tipo de producto</TableCell>
              <TableCell align="center">Kilos vendidos</TableCell>
              <TableCell align="center">Total ($)</TableCell>
              <TableCell align="center">IVA</TableCell>
              <TableCell align="center">Total con iva</TableCell>
              <TableCell align="center">Precio sin iva</TableCell>
              <TableCell align="center">Precio con IVA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              sales.map(sale => {
                return (
                  <TableRow key={sale.material_id}>
                    <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                    <TableCell align="center">{sale.material_name}</TableCell>
                    <TableCell align="center">{sale.product_type_name}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilos_sold)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.total)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.tax)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.total_with_tax)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilo_price)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilo_price_with_tax)}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default SalesByMaterialTable