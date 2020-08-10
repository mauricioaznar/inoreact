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
import Grid from '@material-ui/core/Grid'
import SelectInput from '@material-ui/core/Select/SelectInput'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'


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

const formatCompletion= (x, y) => {
  if (y === 0) {
    return '0'
  }
  return x + '/' + y
}

const dateFormat = 'YYYY-MM-DD'



function ExpensesByCatSubBraTable(props) {
  const classes = useStyles();

  let invoices =  props.invoices

  let rows = []

  if (invoices) {

    // console.log(invoices)

    rows = invoices
      .sort(compare)

  }

  return (
    <>
      <TableContainer
        component={Paper}
        style={{maxHeight: 550}}
      >
        <Table
          className={classes.table}
          aria-label="spanning table"
          size="small"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '20%'}}>Proveedor</TableCell>
              <TableCell style={{width: '15%'}}>Codigos internos</TableCell>
              <TableCell># Facturas</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>ISR</TableCell>
              <TableCell>IVA</TableCell>
              <TableCell>ISR ret.</TableCell>
              <TableCell>IVA ret.</TableCell>
              <TableCell>Complementos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rows.map(invoice => {
                return (
                  <TableRow key={invoice.supplier_id}>
                    <TableCell align={'left'}>{invoice.supplier_name}</TableCell>
                    <TableCell align={'right'}>{invoice.internal_codes}</TableCell>
                    <TableCell align={'right'}>{invoice.invoices}</TableCell>
                    <TableCell align={'right'}>{formatNumber(invoice.total)}</TableCell>
                    <TableCell align={'right'}>{formatNumber(invoice.isr)}</TableCell>
                    <TableCell align={'right'}>{formatNumber(invoice.tax)}</TableCell>
                    <TableCell align={'right'}>{formatNumber(invoice.isr_retained)}</TableCell>
                    <TableCell align={'right'}>{formatNumber(invoice.tax_retained)}</TableCell>
                    <TableCell align={'right'}>{formatCompletion(invoice.complements_delivered, invoice.complements)}</TableCell>
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



function compare( a, b ) {
  if ( a.total < b.total ){
    return 1;
  }
  if ( a.total > b.total ){
    return -1;
  }
  return 0;
}


export default connect(null, null)(ExpensesByCatSubBraTable)