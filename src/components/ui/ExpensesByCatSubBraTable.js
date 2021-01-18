import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse'
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


function compare( a, b ) {
  if ( a.total < b.total ){
    return 1;
  }
  if ( a.total > b.total ){
    return -1;
  }
  return 0;
}

const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const dateFormat = 'YYYY-MM-DD'



function ExpensesByCatSubBraTable(props) {
  const classes = useStyles();

  let rows = []

  if (props.expenses && props.sales) {

    let salesMainProductTotalKilos = props.sales.sales
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .reduce((prev, current) => {
      if (current.product_type_id === 1) {
        return prev + current.kilos_sold
      } else {
        return prev
      }
    }, 0)

    rows = props.expenseCategories
      .map(expenseCategory => {
        return {
          expense_category_name: expenseCategory.name,
          expense_category_id: expenseCategory.id,
          cost: 0,
          total: 0,
          expense_subcategories: props.expenseSubcategories
            .filter(expenseSubcategory => expenseSubcategory.expense_category_id === expenseCategory.id)
            .map(expenseSubcategory => {
              return {
                expense_subcategory_id: expenseSubcategory.id,
                expense_subcategory_name: expenseSubcategory.name,
                total: 0,
                cost: 0
              }
            })
        }
      })

    props.expenses
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .map(expense => {
        let rowFound = rows.find(expenseCategory => {
          return expenseCategory.expense_category_id === expense.expense_category_id
        })
        let subRowFound = rowFound.expense_subcategories.find(expenseSubcategory => {
          return expenseSubcategory.expense_subcategory_id === expense.expense_subcategory_id
        })
        rowFound.total += expense.total
        subRowFound.total += expense.total
      })

    rows = rows
      .map(expenseCategory => {
        return {
          ...expenseCategory,
          cost: expenseCategory.total / salesMainProductTotalKilos,
          expense_subcategories: expenseCategory.expense_subcategories
            .map((expenseSubcategory) => {
              return {
                ...expenseSubcategory,
                cost: expenseSubcategory.total / salesMainProductTotalKilos
              }
            })
            .sort(compare)
        }
      })
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
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
              <TableCell style={{width: '20%'}}>Rubro</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <ExpenseByCatSubBraRow key={row.expense_category_id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


function ExpenseByCatSubBraRow(props) {
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
        <TableCell style={{width: '20%'}}>{row.expense_category_name}</TableCell>
        <TableCell align={'right'}>{formatNumber(row.cost)}</TableCell>
        <TableCell align={'right'}>{formatNumber(row.total)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0}}
          colSpan={10}
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
                <TableHead>
                  <TableRow>
                    <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                    <TableCell style={{width: '20%'}}>Rubro</TableCell>
                    <TableCell>Costo</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.expense_subcategories.map((expenseSubcategory, index) => (
                    <TableRow key={expenseSubcategory.expense_subcategory_id}>
                      <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                      <TableCell style={{width: '20%'}}>{expenseSubcategory.expense_subcategory_name}</TableCell>
                      <TableCell align={'right'}>{formatNumber(expenseSubcategory.cost)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(expenseSubcategory.total)}</TableCell>
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

ExpenseByCatSubBraRow.propTypes = {
  row: PropTypes.object.isRequired
}




const mapStateToProps = (state, ownProps) => {
  return {
    branches: state.general.branches,
    expenseSubcategories: state.expenses.expenseSubcategories.filter(expenseSubcategories => {
      return expenseSubcategories.has_estimate !== 1
    }),
    expenseCategories: state.expenses.expenseCategories.filter(expenseCategories => {
      return expenseCategories.id !== 7
    })
  }
}

export default connect(mapStateToProps, null)(ExpensesByCatSubBraTable)