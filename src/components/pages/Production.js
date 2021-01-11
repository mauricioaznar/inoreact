import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid'
import {connect} from 'react-redux'
import {Switch, Link, useLocation, Route} from 'react-router-dom'
import PrivateRoute from '../ui/PrivateRoute'

import ProductionDataCapture from './production/ProductionDataCapture'
import ProductionInventory from './production/ProductionInventory'
import ProductionSummary from './production/ProductionSummary'
import ProductionCalculations from './production/ProductionCalculations'
import ProductionToProduce from './production/ProductionToProduce'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  rowContainer: {
    paddingLeft: '2em',
    paddingRight: '2em'
  }
}));

function Production(props) {

  const classes = useStyles();

  const location = useLocation()

  const routes = [
    {
      name: 'Inventario',
      link: '/production',
      authed: true
    },
    {
      name: 'Captura de datos',
      link: '/production/dataCapture',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Resumen',
      link: '/production/summary',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Por producir',
      link: '/production/toProduce',
      authed: props.isAdmin || props.isProduction
    },
    {
      name: 'Calculos',
      link: '/production/calculations',
      authed: props.isAdmin || props.isProduction
    }
  ]

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
              path={'/production'}
              exact
              component={() => {
                return (
                  <ProductionInventory />
                )
              }}
            />
            <Route
              authed={props.isAdmin || props.isProduction}
              path={'/production/dataCapture'}
              exact
              component={() => {
                return (
                  <ProductionDataCapture />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/production/summary'}
              exact
              component={() => {
                return (
                  <ProductionSummary />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/production/toProduce'}
              exact
              component={() => {
                return (
                  <ProductionToProduce />
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin || props.isProduction}
              path={'/production/calculations'}
              exact
              component={() => {
                return (
                  <ProductionCalculations />
                )
              }}
            />
          </Switch>
        </Grid>
      </Grid>
    </div>
  );
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

export default connect(mapStateToProps, null)(Production)