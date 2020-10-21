import React from 'react'
import {connect} from 'react-redux'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Grid from '@material-ui/core/Grid'
import formatNumber from '../../helpers/formatNumber'
import Autocomplete from '../ui/inputs/Autocomplete'

function ExpensesByBranchTable (props) {

  let [branch, setBranch] = React.useState(null);

  let branches = JSON.parse(JSON.stringify(props.branches))

  branches.push({
    id: 4,
    name: 'Total'
  })

  let rows = []

  if (props.expenses && props.sales) {

    console.log(props.expenseSubcategories)

    let sales = props.sales.sales

    let defaultRowObject = props.expenseSubcategories
      .reduce((acc, expenseSubcategory) => {
        return {
          ...acc,
          [expenseSubcategory.id]: 0
        }
      }, {sales_total: 0, year: 2020 })

    for (let i = 1; i <= 12; i++) {
      props.branches.forEach(branch => {
        let rowObject = JSON.parse(JSON.stringify(defaultRowObject))
        rowObject.month = i
        rowObject.branch_id = branch.id
        rowObject.branch_name = branch.name
        rows.push(rowObject)
      })
      let rowObject = JSON.parse(JSON.stringify(defaultRowObject))
      rowObject.month = i
      rowObject.branch_id = 4
      rowObject.branch_name = 'Total'
      rows.push(rowObject)
    }

    props.expenses.map(expense => {
      let rowFoundBranch = rows.find(row => {
        return expense.branch_id === row.branch_id
          && expense.month === row.month
          && expense.year === row.year
      })
      if (rowFoundBranch && rowFoundBranch[expense.expense_subcategory_id] !== undefined) {
        rowFoundBranch[expense.expense_subcategory_id] += expense.total
      }
      let rowFoundTotal = rows.find(row => {
        return row.branch_id === 4
          && expense.month === row.month
          && expense.year === row.year
      })
      if (rowFoundTotal && rowFoundTotal[expense.expense_subcategory_id] !== undefined) {
        rowFoundTotal[expense.expense_subcategory_id] += expense.total
      }
    })

    console.log(sales)

    sales.map(sale => {
        let foundRows = rows
          .filter(row => {
            return row.month === sale.month && row.year === sale.year
          })
        foundRows.forEach(row => {
          row.sales_total = sale.kilos_sold
        })
      })

    rows.forEach(row => {
      props.expenseSubcategories.forEach(expenseSubcategory => {
        row[expenseSubcategory.id] = row.sales_total !== 0 ?
          (row[expenseSubcategory.id] / row.sales_total) : 0
      })
    })

  }


  return (
    <Grid container direction={'column'}>
      <Grid item xs sm={4} md={3} style={{marginBottom: '2em'}}>
        <Autocomplete
          options={branches}
          displayName={'name'}
          value={branch}
          onChange={(e, data) => {
            setBranch(data)
          }}
        />
      </Grid>
      <Grid item xs>
        <TableContainer>
          <Table
            aria-label="spanning table"
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell>Mes</TableCell>
                <TableCell>Sucursal</TableCell>
                {
                  props.expenseSubcategories.map(expenseSubcategory => {
                    return (
                      <TableCell key={expenseSubcategory.id}>
                        {
                          expenseSubcategory.name
                        }
                      </TableCell>
                    )
                  })
                }
                <TableCell>
                  Total ventas del mes
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rows
                  .filter(row => {
                    if (branch && branch.id) {
                      return row.branch_id === branch.id
                    } else {
                      return false
                    }
                  })
                  .map(row => {
                    return (
                      <TableRow key={row.month + row.branch_id}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.branch_name}</TableCell>
                        {
                          props.expenseSubcategories.map(expenseSubcategory => {
                            return (
                              <TableCell key={expenseSubcategory.id}>
                                {
                                  formatNumber(row[expenseSubcategory.id])
                                }
                              </TableCell>
                            )
                          })
                        }
                        <TableCell>
                          {
                            formatNumber(row.sales_total)
                          }
                        </TableCell>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    expenseSubcategories: state.expenses.expenseSubcategories
      .filter(expenseSubcategory => {
        return expenseSubcategory.expense_subcategory_frequency_id === 1
      }),
    branches: state.general.branches
  }
}

export default connect(mapStateToProps, null)(ExpensesByBranchTable)