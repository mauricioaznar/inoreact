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


  let salesTotalWithTax = 0
  let salesTotal = 0
  let kilosMainProduct = 0
  let salesTax = 0
  let expensesNoEstimatesTotal = 0
  let expensesEstimatesTotal = 0
  let expensesTotal = 0
  let otherIncomesTotal = 0
  let taxExpenses = 0
  let utility = 0
  let kiloPriceWithTax = 0
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
      .forEach((sale) => {
        kilosMainProduct += sale.product_type_id === 1 ? sale.kilos_sold : 0
        salesTotalWithTax += sale.total_with_tax
        salesTotal += sale.total
        salesTax += sale.tax
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

    kiloPriceWithTax = salesTotalWithTax / kilosMainProduct

    kiloPrice = salesTotal / kilosMainProduct

    expensesTotal = expensesEstimatesTotal + expensesNoEstimatesTotal

    utility = (salesTotalWithTax + otherIncomesTotal - salesTax) + (-expensesNoEstimatesTotal - expensesEstimatesTotal + taxExpenses)

  }


  return (
    <>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          stickyHeader
          size={'small'}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '35%'}}>
                <b>
                  Utilidad
                </b>
              </TableCell>
              <TableCell style={{width: '35%'}}>
                &nbsp;
              </TableCell>
              <TableCell align={'right'} style={{width: '30%'}}>
                <b>
                  {formatNumber(utility)}
                </b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>
                  Ventas ($) sin iva
                </b>
              </TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell align="right">
                <b>
                  {formatNumber(salesTotal)}
                </b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Ventas ($) con iva</TableCell>
              <TableCell align="right">{formatNumber(salesTotalWithTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Precio de bolsa con iva</TableCell>
              <TableCell align="right">{formatNumber(kiloPriceWithTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Precio de bolsa sin iva</TableCell>
              <TableCell align="right">{formatNumber(kiloPrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Kilos de bolsa en ventas</TableCell>
              <TableCell align="right">{formatNumber(kilosMainProduct)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>IVA en ventas</TableCell>
              <TableCell align="right">{formatNumber(salesTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>
                  Gastos
                </b>
              </TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell align="right">
                <b>
                  {formatNumber(expensesTotal)}
                </b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Gastos reales</TableCell>
              <TableCell align="right">{formatNumber(expensesNoEstimatesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>Gastos estimados</TableCell>
              <TableCell align="right">{formatNumber(expensesEstimatesTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>&nbsp;</TableCell>
              <TableCell>IVA en gastos</TableCell>
              <TableCell align="right">{formatNumber(taxExpenses)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>
                  Otros ingresos
                </b>
              </TableCell>
              <TableCell>&nbsp;</TableCell>
              <TableCell align="right">
                <b>
                  {formatNumber(otherIncomesTotal)}
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}


export default connect(null, null)(EquilibriumSummary)
