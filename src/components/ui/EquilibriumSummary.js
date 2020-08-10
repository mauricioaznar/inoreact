import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'

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


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const dateFormat = 'YYYY-MM-DD'

const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


function EquilibriumSummary(props) {
  const classes = useStyles();


  let salesTotal = 0
  let kilosMainProduct = 0
  let salesTax = 0
  let expensesNoEstimatesTotal = 0
  let expensesEstimatesTotal = 0
  let taxExpenses = 0

  if (props.sales && props.expensesNoEstimates && props.expensesEstimates && props.invoices) {

    props.expensesNoEstimates.forEach((expenseNoEstimate) => {
      expensesNoEstimatesTotal += expenseNoEstimate.total
    })

    props.sales.sales.forEach((sale) => {
      salesTax += sale.tax
      kilosMainProduct += sale.kilos_sold
      salesTotal +=  sale.total
    })

    console.log(props.expensesEstimates)

    props.expensesEstimates.expenses_estimation_by_expense_subcategory.forEach((expenseEstimated) => {
      expensesEstimatesTotal += expenseEstimated.estimated_expense
    })


    props.invoices.forEach((invoice) => {
      taxExpenses += invoice.tax
    })


  }


  return (
    <>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          stickyHeader
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
              <TableCell>Gastos no estimados</TableCell>
              <TableCell align="right">{formatNumber(expensesNoEstimatesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gastos estimados</TableCell>
              <TableCell align="right">{formatNumber(expensesEstimatesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA en gastos</TableCell>
              <TableCell align="right">{formatNumber(taxExpenses)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Kilos en ventas</TableCell>
              <TableCell align="right">{formatNumber(kilosMainProduct)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ventas</TableCell>
              <TableCell align="right">{formatNumber(salesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA en ventas</TableCell>
              <TableCell align="right">{formatNumber(salesTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Otros ingresos</TableCell>
              <TableCell align="right">{formatNumber(props.otherIncomesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Utilidad</TableCell>
              <TableCell align="right">{formatNumber(0)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}


const mapStateToProps = (state, ownProps) => {
  return {
    otherIncomesTotal: state.sales.otherIncomes
      .filter(otherIncome => {
        let momentDate = moment(otherIncome.date, 'YYYY-MM-DD')
        let initialMomentDate = moment('2020-07-01', 'YYYY-MM-DD')
        let endMomentDate = moment('2020-07-31', 'YYYY-MM-DD')
        return momentDate.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
      })
      .reduce((accumulator, otherIncome) => {
        return accumulator + otherIncome.total
      }, 0)
  }
}

export default connect(mapStateToProps, null)(EquilibriumSummary)
