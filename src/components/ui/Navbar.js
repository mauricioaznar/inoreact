import React, {useState} from 'react'
import {AppBar, Button, Grid, Toolbar, Tab, Tabs} from '@material-ui/core'
import {Link, useLocation} from 'react-router-dom'
import {connect} from 'react-redux'
import {unsetRole, unsetToken} from '../../store/authActions'
import {setInventoryDrawerOpen} from '../../store/generalActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTheme from '@material-ui/core/styles/useTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

function ElevationScroll(props) {
  const {children} = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return React.cloneElement(children, {
    elevation: trigger ? 5 : 0,
  });
}

const useStyles = makeStyles((theme) => {
  return {
    appbar: {
      zIndex: theme.zIndex.modal + 1
    },
    toolbarMargin: {
      ...theme.mixins.toolbar
    },
    logo: {
      height: "8em",
      [theme.breakpoints.down('md')]: {
        height: '7em'
      },
      [theme.breakpoints.down('xs')]: {
        height: '5.5em'
      }
    },
    logoContainer: {
      padding: 0,
      "&:hover": {
        backgroundColor: 'transparent'
      }
    },
    tabContainer: {
      marginLeft: 'auto'
    },
    tab: {
      ...theme.typography.tab,
      minWidth: 10,
      marginLeft: "25px"
    },
    button: {
      ...theme.typography.estimate,
      borderRadius: '50px',
      marginLeft: '50px',
      marginRight: '50px',
      height: '45px'
    },
    menu: {
      backgroundColor: theme.palette.common.blue,
      color: 'white',
      borderRadius: '0px'
    },
    menuItem: {
      ...theme.typography.tab,
      opacity: 0.7,
      '&:hover': {
        opacity: 1
      }
    },
    drawerIconContainer: {
      '&:hover': {
        backgroundColor: 'transparent'
      }
    },
    drawer: {
      backgroundColor: theme.palette.common.blue,
      paddingRight: 0
    },
    drawerItem: {
      ...theme.typography.tab,
      color: 'white',
      opacity: 0.7
    },
    drawerItemEstimate: {
      backgroundColor: theme.palette.common.orange
    },
    drawerItemSelected: {
      '& .MuiListItemText-root': {
        opacity: 1
      }
    }
  }
})

// noinspection SpellCheckingInspection
function Navbar(props) {
  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))
  const [openDrawer, setOpenDrawer] = useState(false)
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  const location = useLocation()

  const routes = [
    {
      name: 'Punto de equilibrio',
      link: '/',
      authed: props.isAdmin
    },
    {
      name: 'Producción',
      link: '/production',
      authed: true
    },
    {
      name: 'Gastos',
      link: '/expenses',
      authed: props.isAdmin || props.isExpenses
    },
    {
      name: 'Ventas',
      link: '/sales',
      authed: props.isAdmin || props.isSales
    }
  ]

  const tabs = (
    <>
      <Tabs
        indicatorColor="primary"
        value={location.pathname}
      >
        {
          routes.map(route => {
            return (
              <Tab
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
    </>
  )

  const drawer = (
    <React.Fragment>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false)
        }}
        onOpen={() => {
          setOpenDrawer(true)
        }}
        classes={{paper: classes.drawer}}
      >
        <div className={classes.toolbarMargin} />
        <List disablePadding>
          {
            routes.map(route => {
              return (
                <ListItem
                  style={{display: route.authed ? 'inherit' : 'none'}}
                  key={route.link}
                  onClick={() => {
                    setOpenDrawer(false)
                  }}
                  divider
                  button
                  component={Link}
                  to={route.link}
                  selected={location.pathname === route.link}
                  classes={{selected: classes.drawerItemSelected}}
                >
                  <ListItemText
                    className={classes.drawerItem}
                    disableTypography
                  >
                    {route.name}
                  </ListItemText>
                </ListItem>
              )
            })
          }
        </List>
      </SwipeableDrawer>
      <IconButton
        className={classes.drawerIconContainer}
        disableRipple
        onClick={() => {
          setOpenDrawer(!openDrawer)
        }}
      >
        <MenuIcon className={classes.drawerIcon} />
      </IconButton>
    </React.Fragment>
  )

  return (
    <>
      <ElevationScroll>
        <AppBar
          position="fixed"
          color="default"
          className={classes.appbar}
        >
          <Toolbar>
            <Grid container>
              <Grid item>
                {
                  matches ?
                    drawer : tabs
                }
              </Grid>
              <Grid
                item
                style={{flexGrow: 1}}
              >
                <Grid container justify={'flex-end'}>
                  <Grid item>
                    <IconButton
                      disableRipple
                      onClick={() => {
                        props.signOutUser()
                      }}
                    >
                      <ExitToAppIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={classes.toolbarMargin} />
    </>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signOutUser: () => {
      dispatch(unsetToken())
      dispatch(unsetRole())
    },
    setOpenDrawer: () => {
      dispatch(setInventoryDrawerOpen(true))
    }
  }
}

const matchStateToProps = (state) => {
  return {
    isAdmin: state.auth.isAdmin,
    isSuperAdmin: state.auth.isSuperAdmin,
    isProduction: state.auth.isProduction,
    isExpenses: state.auth.isExpenses,
    isSales: state.auth.isSales
  }
}

export default connect(matchStateToProps, mapDispatchToProps)(Navbar)