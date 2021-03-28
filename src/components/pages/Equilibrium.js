import React from 'react'
import apiUrl from '../../helpers/apiUrl'

import moment from 'moment';
import 'moment/locale/es';

import {makeStyles, useTheme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import SalesByMaterialTable from '../ui/SalesByMaterialTable'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useFetch from '../../helpers/useFetch'
import MauMonthYear from '../ui/inputs/MauMonthYear'
import SalePieKilos from "./equilibrium/SalesPieKilos";
import {connect} from "react-redux";


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


function Equilibrium(props) {

  const [year, setYear] = React.useState(moment().year())
  const [month, setMonth] = React.useState(moment().month())

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))

  const salesByMaterial = useFetch(apiUrl + 'analytics/sales?dateGroup=month&entityGroup=material')
  const salesByClient = useFetch(apiUrl + 'analytics/sales?dateGroup=month&entityGroup=client')


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
            Punto de equilibrio
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <MauMonthYear
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
      </Grid>

      <Grid
        item
        container
        direction={'row'}
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid
          item
          container
          direction={'row'}
          md={6}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant={'h5'}
              style={{marginBottom: '0.5em'}}
            >
              Ventas por clientes por kilos
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <SalePieKilos
              sales={salesByClient}
              clients={props.clients}
              propertySummed={'kilos_sold'}
              month={month}
              year={year}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction={'row'}
          md={6}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant={'h5'}
              style={{marginBottom: '0.5em'}}
            >
              Ventas por clientes
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <SalePieKilos
              sales={salesByClient}
              clients={props.clients}
              propertySummed={'total_with_tax'}
              month={month}
              year={year}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >

        <Grid
          item
          xs={12}
        >
          <Typography
            variant={'h5'}
            style={{marginBottom: '0.5em'}}
          >
            Ventas
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <SalesByMaterialTable
            sales={salesByMaterial}
            month={month}
            year={year}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    clients: state.sales.clients
  }
}


export default connect(mapStateToProps, null)(Equilibrium)