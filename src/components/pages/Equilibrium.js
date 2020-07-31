import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ExpensesCategoryTable from '../ui/ExpensesCategoryTable'
import Typography from '@material-ui/core/Typography'
import ProductTypeSalesTable from '../ui/ProductTypeSalesTable'
import UtilityList from '../ui/UtilityList'


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
  const theme = useTheme()

  const matchesXS = theme.breakpoints.down('xs')


  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Typography variant={matchesXS ? 'h3' : 'h1'}>
          Punto de equilibrio
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Typography variant={'h4'}>
          Gastos por rubro
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction={'row'}
        justify={'flex-end'}
        className={classes.rowContainer}
      >
        <Grid
          item
          md={8}
          xs={12}
        >
          <ExpensesCategoryTable />
        </Grid>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
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
      <Grid
        item
        container
        direction={'row'}
        justify={'flex-end'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Grid item>
          <Typography variant={'h4'}>
            Utilidad
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={'row'}
        justify={'flex-end'}
        xs={12}
        style={{marginBottom: '2em'}}
        className={classes.rowContainer}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
        >
          <UtilityList />
        </Grid>
      </Grid>
    </Grid>
  )
}