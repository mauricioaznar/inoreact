import React from 'react'
import Grid from '@material-ui/core/Grid'



import ExpensesSubcategoryTable from '../ui/ExpensesSubcategoryTable'


export default function Equilibrium(props) {
  return (
    <Grid container direction={'column'}>
      <ExpensesSubcategoryTable />
    </Grid>
  )
}