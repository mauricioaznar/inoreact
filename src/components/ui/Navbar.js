import React from 'react'
import {AppBar, Button, Grid, Toolbar, Tab, Tabs} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {unsetToken} from '../../store/authActions'

// noinspection SpellCheckingInspection
function Navbar(props) {
  const [value, setValue] = React.useState(0)
  return (
    <AppBar position="fixed">
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
              value={value}
            >
              <Tab
                label={'Punto de equilibrio'}
                component={Link}
                to={'/'}
                onClick={() => setValue(0)}
              />
              <Tab
                label={'Ventas'}
                component={Link}
                to={'/sales'}
                onClick={() => setValue(1)}
              />
              <Tab
                label={'Gastos'}
                component={Link}
                to={'/expenses'}
                onClick={() => setValue(2)}
              />
              <Tab
                label={'Mantenimiento'}
                component={Link}
                to={'/maintenance'}
                onClick={() => setValue(3)}
              />
            </Tabs>
          </Grid>
          <Grid
            item
          >
            <Button
              color="inherit"
              onClick={(e) => {
                e.preventDefault();
                props.signOutUser()
              }}
            >
              Salir
            </Button>
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
    }
  }
}

export default connect(null, mapDispatchToProps)(Navbar)