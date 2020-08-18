import React from 'react'
import {AppBar, Button, Grid, Toolbar, Tab, Tabs} from '@material-ui/core'
import {Link, useLocation} from 'react-router-dom'
import {connect} from 'react-redux'
import {unsetToken} from '../../store/authActions'

// noinspection SpellCheckingInspection
function Navbar(props) {
  const [value, setValue] = React.useState(0)

  const location = useLocation()

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
              value={location.pathname}
            >
              <Tab
                label={'P E'}
                component={Link}
                to={'/'}
                value={'/'}
              />
              <Tab
                label={'Prod'}
                component={Link}
                to={'/production'}
                value={'/production'}
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