import React from 'react'
import {AppBar, Button, Grid, Toolbar, Tab, Tabs} from '@material-ui/core'
import {Link, useLocation} from 'react-router-dom'
import {connect} from 'react-redux'
import {unsetToken} from '../../store/authActions'
import ListAlt from '@material-ui/icons/ListAlt'
import {setInventoryDrawerOpen} from '../../store/generalActions'

// noinspection SpellCheckingInspection
function Navbar(props) {
  const [value, setValue] = React.useState(0)

  const location = useLocation()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        <Grid
          container
          justify={"space-between"}
          alignItems={'center'}
        >

          <Grid
            item
          >
            <Tabs
              indicatorColor="primary"
              value={location.pathname}
            >
              <Tab
                label={'Punto de equilibrio'}
                component={Link}
                to={'/'}
                value={'/'}
              />
              <Tab
                label={'Produccion'}
                component={Link}
                to={'/production'}
                value={'/production'}
              />
              <Tab
                label={'Gastos'}
                component={Link}
                to={'/expenses'}
                value={'/expenses'}
              />
              <Tab
                label={'Ventas'}
                component={Link}
                to={'/sales'}
                value={'/sales'}
              />
            </Tabs>
          </Grid>
          <Grid
            item
          >

            <Tabs
              indicatorColor="primary"
              onChange={handleChange}
              value={value}
              TabIndicatorProps={{style: {backgroundColor: "transparent"}}}
            >
              <Tab
                icon={<ListAlt />}
                value={value}
                onClick={(e) => {
                  e.preventDefault();
                  props.setOpenDrawer()
                }}
              />
              <Tab
                label={'Salir'}
                value={value}
                onClick={(e) => {
                  e.preventDefault();
                  props.signOutUser()
                }}
              />
            </Tabs>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signOutUser: () => {
      dispatch(unsetToken())
    },
    setOpenDrawer: () => {
      dispatch(setInventoryDrawerOpen(true))
    }
  }
}

export default connect(null, mapDispatchToProps)(Navbar)