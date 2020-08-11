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
  }
});


function EquilibriumSummary(props) {
  const classes = useStyles();


  let salesTotal = 0
  let kilosMainProduct = 0
  let salesTax = 0
  let expensesNoEstimatesTotal = 0
  let expensesEstimatesTotal = 0
  let expensesTotal = 0
  let otherIncomesTotal = 0
  let taxExpenses = 0
  let utility = 0
  let kiloPrice = 0

  if (props.sales && props.expensesNoEstimates && props.expensesEstimates && props.invoices && props.otherIncomes) {

    props.expensesNoEstimates
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .forEach((expenseNoEstimate) => {
      expensesNoEstimatesTotal += expenseNoEstimate.total
    })

    props.sales.sales
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .filter(sale => {
        return sale.product_type_id === 1
      })
      .forEach((sale) => {
      salesTax += sale.tax
      kilosMainProduct += sale.kilos_sold
      salesTotal += sale.total
    })

    props.otherIncomes.other_incomes
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .forEach((otherIncome) => {
        otherIncomesTotal += otherIncome.total
      })


    props.expensesEstimates.expenses_estimation_by_expense_subcategory
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .forEach((expenseEstimated) => {
      expensesEstimatesTotal += expenseEstimated.estimated_expense
    })


    props.invoices
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .forEach((invoice) => {
      taxExpenses += invoice.tax
    })

    kiloPrice = salesTotal / kilosMainProduct

    expensesTotal = expensesEstimatesTotal + expensesNoEstimatesTotal

    utility = (salesTotal + otherIncomesTotal - salesTax) + (- expensesNoEstimatesTotal - expensesEstimatesTotal + taxExpenses)

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
              <TableCell>Gastos</TableCell>
              <TableCell align="right">{formatNumber(expensesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA en gastos</TableCell>
              <TableCell align="right">{formatNumber(taxExpenses)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ventas ($)</TableCell>
              <TableCell align="right">{formatNumber(salesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Precio de bolsa (sin iva)</TableCell>
              <TableCell align="right">{formatNumber(kiloPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Kilos de bolsa en ventas</TableCell>
              <TableCell align="right">{formatNumber(kilosMainProduct)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA en ventas</TableCell>
              <TableCell align="right">{formatNumber(salesTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Otros ingresos</TableCell>
              <TableCell align="right">{formatNumber(otherIncomesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Utilidad</TableCell>
              <TableCell align="right">{formatNumber(utility)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}


export default connect(null, null)(EquilibriumSummary)
