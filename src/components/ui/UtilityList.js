import React from 'react'
import {connect} from 'react-redux'

import {makeStyles} from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({

});

function UtilityList(props) {
  const classes = useStyles();


  const [utility, setUtility] = React.useState(0)
  const [expensesTotal, setExpensesTotal] = React.useState(0)
  const [salesTotal, setSalesTotal] = React.useState(0)
  const [commissionsTotal, setCommissionsTotal] = React.useState(0)

  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell/>
            <TableCell align="right">Totales</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Gastos</TableCell>
            <TableCell align="right">{expensesTotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ventas</TableCell>
            <TableCell align="right">{salesTotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Comisiones</TableCell>
            <TableCell align="right">{commissionsTotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Utilidad</TableCell>
            <TableCell align="right">{utility}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}


const mapStateToProps = (state, ownProps) => {
  return {
    sales: state.sales.sales,
    expenses: state.expenses.expenses,
    commissions: [],
    initialDate: '2020-07-01',
    endDate: '2020-07-01'
  }
}

export default connect(mapStateToProps, null)(UtilityList)
