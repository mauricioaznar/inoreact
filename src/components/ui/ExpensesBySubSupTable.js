import React from 'react';
import {connect} from 'react-redux'


import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
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

// const dateFormat = 'YYYY-MM-DD'



function ExpensesByCatSubBraTable(props) {
  const classes = useStyles();

  const [expenseCategoryId, setExpenseCategoryId] = React.useState(null);

  let expenses =  props.expenses

  let rows = []

  if (expenses) {

    rows = expenses
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })
      .filter(expense => {
        return expenseCategoryId === null || expense.expense_category_id === expenseCategoryId
      })
      .sort(compare)

  }

  const handleExpenseCategoryChange = (event) => {
    setExpenseCategoryId(event.target.value);
  };


  return (
    <>
      <Grid container direction={'column'}>
        <Grid item xs={12} sm={4} md={2} style={{marginBottom: '1em'}}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-simple-select-label">Rubro</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={expenseCategoryId}
              onChange={handleExpenseCategoryChange}
            >
              {
                props.expenseCategories.map(expenseCategory => {
                  return (
                    <MenuItem key={expenseCategory.id} value={expenseCategory.id}>{expenseCategory.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
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
                  <TableCell style={{width: '40%'}}>Proveedor</TableCell>
                  <TableCell>Rubro</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(expense => {
                    return (
                      <TableRow key={expense.supplier_id + '-' + expense.expense_subcategory_id}>
                        <TableCell>{expense.supplier_name}</TableCell>
                        <TableCell>{expense.expense_subcategory_name}</TableCell>
                        <TableCell align={'right'}>{formatNumber(expense.total)}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
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


const mapStateToProps = (state, ownProps) => {
  return {
    expenseCategories: state.expenses.expenseCategories
  }
}

export default connect(mapStateToProps, null)(ExpensesByCatSubBraTable)