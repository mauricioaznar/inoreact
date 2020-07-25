import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ExpensesSubcategoryTable from '../ui/ExpensesSubcategoryTable'


const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '2em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})


export default function Equilibrium(props) {
  const classes = useStyles()


  return (
    <Grid container direction={'column'}>
      <Grid item xs={12} className={classes.rowContainer}>
        <ExpensesSubcategoryTable />
      </Grid>
    </Grid>
  )
}