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


const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.desc}</TableCell>
        <TableCell align="right">{row.cost}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0}}
          colSpan={5}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box margin={1}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              >
                Gastos
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.expenseSubcategories.map((historyRow, index) => (
                    <TableRow key={historyRow.expenseSubcategoryId}>
                      <TableCell>{historyRow.desc}</TableCell>
                      <TableCell align="right">{historyRow.total}</TableCell>
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






function ExpenseCategoryTable(props) {
  const classes = useStyles();
  const [expenseCategoriesRows, setExpenseCategoriesRows] = React.useState([])

  React.useEffect(() => {
    let rows = props.expenseCategories.map(expenseCategory => {

      let expenseCategoryTotal = 0
      let initialMomentDate = moment(props.initialDate, dateFormat)
      let endMomentDate = moment(props.endDate, dateFormat)

      let expenseSubcategories = props.expenseSubcategories.filter(expenseSubcategory => {
        return expenseSubcategory.expense_category_id === expenseCategory.id
      }).map(expenseSubcategory => {
        return {desc: expenseSubcategory.name, expenseSubcategoryId: expenseSubcategory.id, total: 0}
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
        return {...expenseSubcategory, id: expenseSubcategory.id, total: formatNumber(Math.trunc(expenseSubcategory.total))}
      })

      return {
        id: expenseCategory.id,
        desc: expenseCategory.name,
        total: formatNumber(Math.trunc(expenseCategoryTotal)),
        cost: (Math.random() * 10).toFixed(2),
        expenseSubcategories: expenseSubcategories
      }
    })
    setExpenseCategoriesRows(rows)
  }, [props.expenses, props.expenseSubcategories, props.expenseCategories])


  return (
    <>
      <TableContainer
        component={Paper}
      >
        <Table
          className={classes.table}
          stickyHeader
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Rubro</TableCell>
              <TableCell align="right">Costo</TableCell>
              <TableCell align="right">Total</TableCell>
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
    initialDate: '2020-07-01',
    endDate: '2020-07-31'
  }
}

export default connect(mapStateToProps, null)(ExpenseCategoryTable)