import React, {useEffect, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {connect} from 'react-redux'
import {getApiEntities, setAreEntitiesLoading} from '../store/generalActions'
import {Switch, Route} from 'react-router-dom'
import Navbar from './ui/Navbar'
import Equilibrium from './pages/Equilibrium'
import Production from './pages/Production'
import Expenses from './pages/Expenses'
import Sales from './pages/Sales'
import PrivateRoute from './ui/PrivateRoute'


const useStyles = makeStyles((theme) => ({
  toolbarMargin: theme.mixins.toolbar
}));

const Home = (props) => {
  const classes = useStyles()

  //Correct permanent session logic with dates, token invalidation and token creation
  // Could check on intervals to execute this function

  React.useEffect(() => {
    props.getApiEntities()
  }, [])


  if (props.areEntitiesLoading) { //props.areEntitiesLoading
    return (
      <div>
        Loading...
      </div>
    )
  } else {
    return (
      <div>
        <Navbar/>
        <Switch>
          <PrivateRoute authed={props.isAdmin} path={'/'} exact component={() => <Equilibrium />}/>
          <Route path={'/production'} component={() => <Production />}/>
          <PrivateRoute authed={props.isExpenses || props.isAdmin} path={'/expenses'} component={() => <Expenses />}/>
          <PrivateRoute authed={props.isSales || props.isAdmin} path={'/sales'} component={() => <Sales />}/>
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
    areEntitiesLoading: state.general.areEntitiesLoading,
    isAdmin: state.auth.isAdmin,
    isSuperAdmin: state.auth.isSuperAdmin,
    isProduction: state.auth.isProduction,
    isExpenses: state.auth.isExpenses,
    isSales: state.auth.isSales
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)