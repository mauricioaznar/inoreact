import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import ProductionEventsDataTable from '../ui/datatables/ProductionEventsDataTable'
import MachineDataTable from '../ui/datatables/MachineDataTable'
import EquipmentDataTable from '../ui/datatables/EquipmentDataTable'
import EquipmentTransactionDataTable
  from '../ui/datatables/EquipmentTransactionDataTable'
import useFetch from '../../helpers/useFetch'
import apiUrl from '../../helpers/apiUrl'
import EquipmentInventory from './maintenance/EquipmentInventory'
import {connect} from 'react-redux'
import {Link, Route, Switch, useLocation} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PrivateRoute from '../ui/PrivateRoute'

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

function Maintenance (props) {

  const classes = useStyles()

  const theme = useTheme()

  const location = useLocation()

  const routes = [
    {
      name: 'Inventario',
      link: '/maintenance',
      authed: true
    },
    {
      name: 'Reportes de mantenimiento',
      link: '/maintenance/productionEvent',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Transacciones',
      link: '/maintenance/equipmentTransaction',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Maquinas',
      link: '/maintenance/machine',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Refacciones',
      link: '/maintenance/equipment',
      authed: props.isAdmin || props.isProduction
    }
  ]

  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <div>
      <AppBar
        position="static"
        color="default"
        style={{marginBottom: '2.0em'}}
      >
        <Tabs
          value={location.pathname}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >

          {
            routes.map(route => {
              return (
                <Tab
                  key={route.name}
                  style={{display: route.authed ? 'inherit' : 'none'}}
                  label={route.name}
                  component={Link}
                  to={route.link}
                  value={route.link}
                />
              )
            })
          }
        </Tabs>
      </AppBar>
            <Grid
              container
              direction={'column'}
              className={classes.rowContainer}
              style={{marginTop: '2em', marginBottom: '2em'}}
            >
        <Grid
          item
          xs={12}
        >
          <Switch>
            <Route
              path={'/maintenance'}
              exact
              component={() => {
                return (
                  <EquipmentInventory />
                )
              }}
            />
            <Route
              authed={props.isAdmin || props.isProduction}
              path={'/maintenance/productionEvent'}
              exact
              component={() => {
                return (
                  <ProductionEventsDataTable />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/maintenance/machine'}
              exact
              component={() => {
                return (
                  <MachineDataTable />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/maintenance/equipment'}
              exact
              component={() => {
                return (
                  <EquipmentDataTable />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/maintenance/equipmentTransaction'}
              exact
              component={() => {
                return (
                  <EquipmentTransactionDataTable />
                )
              }}
            />
          </Switch>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAdmin: state.auth.isAdmin,
    isSuperAdmin: state.auth.isSuperAdmin,
    isProduction: state.auth.isProduction,
    isExpenses: state.auth.isExpenses,
    isSales: state.auth.isSales
  }
}

export default connect(mapStateToProps, null)(Maintenance)