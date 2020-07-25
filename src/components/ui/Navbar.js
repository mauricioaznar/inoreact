import React from 'react'
import {AppBar, Button, Grid, Toolbar, Tab, Tabs} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {getApiEntities, unsetToken} from '../../store/actions'

// noinspection SpellCheckingInspection
function Navbar(props) {
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
            >
              <Tab

                label={'Pedidos'}
                component={Link}
                to={'/requests'}
              />
              <Tab
                label={'Punto de equilibrio'}
                component={Link}
                to={'/equilibrium'}
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