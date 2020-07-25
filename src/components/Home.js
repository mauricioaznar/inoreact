import React, {useEffect, useState} from 'react'
import {AppBar, Toolbar, Button, Grid} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities, unsetToken} from '../store/actions'
import Requests from './pages/Requests'
import Equilibrium from './pages/Equilibrium'
import {Switch, Route} from 'react-router-dom'
import Navbar from './ui/Navbar'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    props.getApiEntities()
  }, [counter])
  if (props.areEntitiesLoading) { //props.areEntitiesLoading
    return (
      <div>
        Loading...
      </div>
    )
  } else {
    return (
      <div>
       <Navbar />
        <div className={classes.toolbarMargin}/>
        <Switch>
          <Route path={'/requests'} component={() => <Requests />}/>
          <Route path={'/equilibrium'} component={() => <Equilibrium />}/>
        </Switch>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getApiEntities: () => {dispatch(getApiEntities())}
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    areEntitiesLoading: state.auth.areEntitiesLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)