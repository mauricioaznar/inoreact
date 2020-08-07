import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'
import axios from 'axios'


import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'


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



function SalesTable(props) {
  const classes = useStyles();

  let sales =  []


  if (props.sales) {
    sales = props.sales.sales

    console.log(sales)
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
              <TableCell align="center">Kilos vendidos</TableCell>
              <TableCell align="center">Precio</TableCell>
              <TableCell align="center">Precio con IVA</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">IVA</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              sales.map(sale => {
                return (
                  <TableRow>
                    <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                    <TableCell style={{width: '20%'}} align="center">{sale.material_name}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilos_sold)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilo_price)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.kilo_price_with_tax)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.total)}</TableCell>
                    <TableCell align="right">{formatNumber(sale.tax)}</TableCell>
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

export default SalesTable