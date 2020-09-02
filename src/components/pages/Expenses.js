import React from 'react'
import Grid from '@material-ui/core/Grid'
import ExpenseDataTable from '../ui/ExpenseDataTable'

export default function Expenses (props) {
  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid item xs>
        <ExpenseDataTable />
      </Grid>
    </Grid>
  )
}