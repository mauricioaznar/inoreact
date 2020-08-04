import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'


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

// const total = rows.reduce((prevValue, currentValue) => {
//   return {total: Number(prevValue.total) + Number(currentValue.total)}
// }).total

function ExpenseCategoryRow(props) {
  const {row} = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>
        <TableCell style={{width: '5%'}}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{width: '45%'}} align="center">{row.desc}</TableCell>
        <TableCell style={{width: '25%'}} align="right">{formatNumber(row.cost)}</TableCell>
        <TableCell style={{width: '25%'}} align="right">{formatNumber(row.total)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0}}
          colSpan={4}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Table
                aria-label="purchases"
              >
                <TableBody>
                  {row.expenseSubcategories.map((historyRow, index) => (
                    <TableRow key={historyRow.expenseSubcategoryId}>
                      <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                      <TableCell style={{width: '45%'}} align={'center'}>{historyRow.desc}</TableCell>
                      <TableCell style={{width: '25%'}} align={'right'}>{formatNumber(historyRow.cost)}</TableCell>
                      <TableCell style={{width: '25%'}} align={'right'}>{formatNumber(historyRow.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

ExpenseCategoryRow.propTypes = {
  row: PropTypes.object.isRequired
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



function ExpenseCategoryTable(props) {
  const classes = useStyles();
  const [expenseCategoriesRows, setExpenseCategoriesRows] = React.useState([])

  React.useEffect(() => {
    let rows = props.expenseCategories.map(expenseCategory => {

      let expenseCategoryTotal = 0
      let initialMomentDate = moment(props.initialDate, dateFormat)
      let endMomentDate = moment(props.endDate, dateFormat)

      let kilosTotal = props.salesProducts
        .filter(saleProduct => {
          let saleMomentDate = moment(saleProduct.date, dateFormat)
          return saleMomentDate.isBetween(initialMomentDate, endMomentDate, 'days', '[]')
            && saleProduct.product_type_id === 1

        })
        .reduce((accumulator, saleProduct) => {
        return accumulator + saleProduct.kilos
      }, 0)


      let expenseSubcategories = props.expenseSubcategories.filter(expenseSubcategory => {
        return expenseSubcategory.expense_category_id === expenseCategory.id
      }).map(expenseSubcategory => {
        return {desc: expenseSubcategory.name, expenseSubcategoryId: expenseSubcategory.id, cost: 0, total: 0}
      })

      props.expenses.forEach(expense => {
        let datePaidMoment = moment(expense.date_paid, dateFormat)
        if (expense.expense_category_id === expenseCategory.id
          && datePaidMoment.isBetween(initialMomentDate, endMomentDate, 'days', '[]'))
        {
          expenseCategoryTotal += expense.subtotal
          let expenSubcategoryFound = expenseSubcategories.find(expenseSubcategory => {
            return expenseSubcategory.expenseSubcategoryId === expense.expense_subcategory_id
          })
          if (expenSubcategoryFound) {
            expenSubcategoryFound.total += expense.subtotal
          }
        }
      })

      expenseSubcategories = expenseSubcategories.map(expenseSubcategory => {
        return {...expenseSubcategory, id: expenseSubcategory.id, total: expenseSubcategory.total, cost: (expenseSubcategory.total / kilosTotal)}
      })
      expenseSubcategories = expenseSubcategories.sort(compare)
      return {
        id: expenseCategory.id,
        desc: expenseCategory.name,
        total: expenseCategoryTotal,
        cost: (expenseCategoryTotal / kilosTotal),
        expenseSubcategories: expenseSubcategories
      }
    })
    rows = rows.sort(compare)
    setExpenseCategoriesRows(rows)
  }, [props.expenses, props.expenseSubcategories, props.expenseCategories, props.salesProducts])


  return (
    <>
      <TableContainer
        component={Paper}
        style={{maxHeight: 450}}
      >
        <Table
          className={classes.table}
          stickyHeader
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}}/>
              <TableCell style={{width: '45%'}} align="center">Rubro</TableCell>
              <TableCell style={{width: '25%'}} align="center">Costo</TableCell>
              <TableCell style={{width: '25%'}} align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenseCategoriesRows.map((row, index) => (
              <ExpenseCategoryRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    expenses: state.expenses.expenses,
    expenseCategories: state.expenses.expenseCategories,
    expenseSubcategories: state.expenses.expenseSubcategories,
    salesProducts: state.sales.salesProducts,
    initialDate: '2020-07-01',
    endDate: '2020-07-31'
  }
}

export default connect(mapStateToProps, null)(ExpenseCategoryTable)