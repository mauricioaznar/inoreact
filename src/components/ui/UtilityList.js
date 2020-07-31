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

});


function UtilityList(props) {
  const classes = useStyles();

  const [expensesTotal, setExpensesTotal] = React.useState(0)
  const [salesTotal, setSalesTotal] = React.useState(0)
  const [otherIncomesTotal, setOtherIncomesTotal] = React.useState(0)
  const [taxTotal, setTaxTotal] = React.useState(0)


  React.useEffect(() => {
    let initialMomentDate = moment(props.initialDate, 'YYYY-MM-DD')
    let endMomentDate = moment(props.endDate, 'YYYY-MM-DD')

    setExpensesTotal(props.expenses.filter(expense => {
      let expenseMomentDatePaid = moment(expense.date_paid, 'YYYY-MM-DD')
      return expense.expense_category_id !== 7
        && expenseMomentDatePaid.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
    })
      .reduce((accumulator, expense) => {
        return accumulator + expense.subtotal
      }, 0))

    setOtherIncomesTotal(props.otherIncomes
      .filter(otherIncome => {
        let momentDate = moment(otherIncome.date, 'YYYY-MM-DD')
        return momentDate.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
      })
      .reduce((accumulator, otherIncome) => {
      return accumulator + otherIncome.total
      }, 0)
    )

    setSalesTotal(props.salesProducts
      .filter(saleProduct => {
        let momentDate = moment(saleProduct.date, 'YYYY-MM-DD')
        return momentDate.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
      })
      .reduce((accumulator, saleProduct) => {
        return accumulator
          + (saleProduct.order_sale_receipt_type_id === 1 ?
            (saleProduct.kilos * saleProduct.kilo_price) : (saleProduct.kilos * saleProduct.kilo_price * 1.16))
      }, 0)
    )

    setTaxTotal(props.salesProducts
      .filter(saleProduct => {
        let momentDate = moment(saleProduct.date, 'YYYY-MM-DD')
        return momentDate.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
      })
      .reduce((accumulator, saleProduct) => {
        return accumulator
          + (saleProduct.order_sale_receipt_type_id === 2 ? (saleProduct.kilos * saleProduct.kilo_price * 0.16) : 0)
      }, 0)
    )


  }, [props.expenses, props.otherIncomes, props.salesProducts])


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
            <TableCell align="right">{formatNumber(expensesTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ventas</TableCell>
            <TableCell align="right">{formatNumber(salesTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>IVA</TableCell>
            <TableCell align="right">{formatNumber(taxTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Otros ingresos</TableCell>
            <TableCell align="right">{formatNumber(otherIncomesTotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Utilidad</TableCell>
            <TableCell align="right">{formatNumber(salesTotal + otherIncomesTotal - expensesTotal - taxTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}


const mapStateToProps = (state, ownProps) => {
  return {
    salesProducts: state.sales.salesProducts,
    expenses: state.expenses.expenses,
    otherIncomes: state.sales.otherIncomes,
    initialDate: '2020-07-01',
    endDate: '2020-07-31'
  }
}

export default connect(mapStateToProps, null)(UtilityList)
