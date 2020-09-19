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
import {loginUser} from '../store/authActions'
import useFetch from '../helpers/useFetch'
import apiUrl from '../helpers/apiUrl'


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
          <Route path={'/'} exact component={() => <Equilibrium />}/>
          <Route path={'/production'} component={() => <Production />}/>
          <Route path={'/expenses'} component={() => <Expenses />}/>
          <Route path={'/sales'} component={() => <Sales />}/>
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
    areEntitiesLoading: state.general.areEntitiesLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)