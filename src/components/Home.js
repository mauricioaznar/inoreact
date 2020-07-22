import React, {useEffect, useState} from 'react'
import {AppBar, Toolbar, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities, unsetToken} from '../store/actions'
import Analytics from './pages/Analytics'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    props.getApiEntities()
  }, [counter])
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Grid
            container
            justify={"flex-end"}
          >
            <Grid
              item
            >
              <Button
                color="inherit"
                onClick={(e) => {e.preventDefault(); props.signOutUser()}}
              >
                Salir
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin}/>
      {props.areEntitiesLoading ? <div>Loading...!</div> : <Analytics /> }
    </div>
  )
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signOutUser: () => { dispatch(unsetToken()) },
    getApiEntities: () => {dispatch(getApiEntities())}
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    areEntitiesLoading: state.auth.areEntitiesLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)