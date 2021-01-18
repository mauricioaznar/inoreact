import React from 'react'
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Link, Route, Switch, useLocation} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

function Subheader ({routes}) {

  const classes = useStyles()

  const location = useLocation()

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
                    to={route.path}
                    value={route.path}
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
              {
                routes.map(route => {
                  return (
                    <Route
                      exact
                      key={route.name}
                      authed={route.authed}
                      path={route.path}
                      component={route.component}
                    />
                  )
                })
              }
            </Switch>
          </Grid>
        </Grid>
      </div>
    )
}

Subheader.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    authed: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
  })).isRequired,
}

export default Subheader
