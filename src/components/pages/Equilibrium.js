import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ExpensesCategoryTable from '../ui/ExpensesCategoryTable'
import Typography from '@material-ui/core/Typography'
import ProductTypeSalesTable from '../ui/ProductTypeSalesTable'


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
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Typography variant={'h1'}>
          Punto de equilibrio
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginBottom: '2em'}}
      >
        <Typography variant={'h4'}>
          Gastos por rubro
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.rowContainer}
      >
        <ExpensesCategoryTable />
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Typography variant={'h4'}>
          Ventas por subtipo de producto
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.rowContainer}
      >
        <ProductTypeSalesTable />
      </Grid>
    </Grid>
  )
}