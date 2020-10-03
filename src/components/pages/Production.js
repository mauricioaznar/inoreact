import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ProductionsByMatMacTable from '../ui/ProductionsByMatMacTable'
import useFetch from '../../helpers/useFetch'
import RequestsProductsTable from '../ui/RequestsProductsTable'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import apiUrl from '../../helpers/apiUrl'
import Grid from '@material-ui/core/Grid'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import InventoryTable from '../ui/InventoryTable'
import EmployeePerformanceTable from '../ui/EmployeePerformanceTable'
import ProductionDataTable from '../ui/datatables/ProductionDataTable'
import {connect} from 'react-redux'
import {Route, Switch, Link, useLocation} from 'react-router-dom'
import PrivateRoute from '../ui/PrivateRoute'

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`
  };
}

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
  const [value, setValue] = React.useState(0);

  const theme = useTheme()

  const location = useLocation()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const machineProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine')
  const employeeProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|employee')
  const employeePerformances = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=employee')
  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')

  const routes = [
    {
      name: 'Inicio',
      link: '/production',
      authed: props.isAdmin
    },
    {
      name: 'Inventario',
      link: '/production/inventory',
      authed: props.isAdmin
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
            <PrivateRoute
              authed={props.isAdmin}
              path={'/production'}
              exact
              component={() => {
                return (
                  <Grid
                    container
                    direction={'column'}
                  >
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >

                      <ProductionDataTable/>
                    </Grid>
                  </Grid>
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin}
              path={'/production/inventory'}
              exact
              component={() => {
                return (
                  <Grid
                    container
                    direction={'column'}
                  >
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >
                      <InventoryTable type={'material'}/>
                    </Grid>
                    <Grid item>
                      <InventoryTable type={'product'}/>
                    </Grid>
                  </Grid>
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin}
              path={'/production/toProduce'}
              exact
              component={() => {
                return (
                  <Grid
                    container
                    direction={'column'}
                  >
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >
                      <RequestsProductsTable
                        type={'materials'}
                        requestProducts={requestProducts}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >
                      <RequestsProductsTable
                        type={'extrusion'}
                        requestProducts={requestProducts}
                      />
                    </Grid>
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >
                      <OrderRequestsDataTable />
                    </Grid>
                    <Grid
                      item
                    >
                      <RequestsProductsTable
                        type={'products'}
                        requestProducts={requestProducts}
                      />
                    </Grid>
                  </Grid>
                )
              }}
            />
            <PrivateRoute
              authed={props.isAdmin}
              path={'/production/calculations'}
              exact
              component={() => {
                return (
                  <Grid
                    container
                    direction={'column'}
                  >
                    <Grid
                      item
                      style={{marginBottom: '3em'}}
                    >
                      <ProductionsByMatMacTable
                        machineProductions={machineProductions}
                        employeeProductions={employeeProductions}
                      />
                    </Grid>
                    <Grid
                      item
                    >
                      <EmployeePerformanceTable employeePerformances={employeePerformances}/>
                    </Grid>
                  </Grid>
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
    areEntitiesLoading: state.general.areEntitiesLoading,
    isAdmin: state.auth.isAdmin,
    isSuperAdmin: state.auth.isSuperAdmin,
    isProduction: state.auth.isProduction,
    isExpenses: state.auth.isExpenses,
    isSales: state.auth.isSales
  }
}

export default connect(mapStateToProps, null)(Production)