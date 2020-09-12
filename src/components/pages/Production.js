import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useFetch from '../../helpers/useFetch'
import apiUrl from '../../helpers/apiUrl'
import ProductionsByMatMacTable from '../ui/ProductionsByMatMacTable'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import RequestsProductsTable from '../ui/RequestsProductsTable'

const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '4em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})


export default function Production (props) {

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const productions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine')
  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid item>
          <Typography variant={matchesXS ? 'h2' : 'h1'}>
            Produccion
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em'}}
      >
        <Grid item xs>
          <ProductionsByMatMacTable productions={productions}/>
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em'}}
      >
        <Grid item xs>
          <RequestsProductsTable requestProducts={requestProducts} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Grid item xs>
          <OrderRequestsDataTable />
        </Grid>
      </Grid>
    </Grid>
  )
}
