import React from 'react'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import axios from 'axios'

import {makeStyles, useTheme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ExpensesCategoryTable from '../ui/ExpensesCategoryTable'
import Typography from '@material-ui/core/Typography'
import ProductTypeSalesTable from '../ui/ProductTypeSalesTable'
import UtilityList from '../ui/UtilityList'
import EstimatedExpensesTable from '../ui/EstimatedExpensesTable'
import SalesTable from '../ui/SalesTable'



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


const useFetch = (url) => {
  const [data, setData] = React.useState(null);

  // empty array as second argument equivalent to componentDidMount
  React.useEffect(() => {
    let unmounted = false

    async function fetchData() {
      const response = await axios.get(url, {headers: {...authHeader()}});
      if (!unmounted) {
        setData(response.data.data)
      }
    }

    if (!unmounted) {
      fetchData();
    }
    return () => {
      unmounted = true
    };
  }, [url]);

  return data;
};


export default function Equilibrium(props) {
  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = theme.breakpoints.down('xs')

  const expensesEstimation = useFetch(apiUrl + 'analytics/expensesEstimation')
  const sales = useFetch(apiUrl + 'analytics/salesV?dateGroup=month&entityGroup=material')


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
        <Typography variant={matchesXS ? 'h2' : 'h1'}>
          Punto de equilibrio v3
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >

        <Grid item xs={12}>
          <Typography variant={'h5'} style={{marginBottom: '0.5em'}}>
            Gastos estimados
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <EstimatedExpensesTable expensesEstimation={expensesEstimation}/>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >

        <Grid item xs={12}>
          <Typography variant={'h5'} style={{marginBottom: '0.5em'}}>
            Ventas
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <SalesTable sales={sales}/>
        </Grid>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Typography variant={matchesXS ? 'h2' : 'h1'}>
          Punto de equilibrio
        </Typography>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >

        <Grid item xs={12}>
          <Typography variant={'h5'} style={{marginBottom: '0.5em'}}>
            Ventas por tipo de producto
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <ProductTypeSalesTable />
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction={'row'}
        className={classes.rowContainer}
        style={{marginBottom: '2em'}}
        justify={'space-between'}
      >
        <Grid
          item
          container
          md={7}
          xs={12}
          direction={'column'}
        >
          <Grid item style={{marginBottom: '0.5em'}}>
            <Typography variant={'h5'}>
              Gastos por rubro
            </Typography>
          </Grid>
          <Grid item>
            <ExpensesCategoryTable />
          </Grid>
        </Grid>
        <Grid
          item
          container
          md={4}
          xs={12}
          direction={'column'}
        >
          <Grid item style={{marginBottom: '0.5em'}}>
            <Typography variant={'h5'}>
              Utilidad
            </Typography>
          </Grid>
          <Grid item >
            <UtilityList />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}