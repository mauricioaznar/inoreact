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

  const user = useFetch(apiUrl + 'auth/user')


  let userValid = user && user.id && user.active === 1


  props.setAreEntitiesLoading()


  const programmaticLoginUser = () => {
    const {email, password} = window.localStorage.getItem('loginForm') ? JSON.parse(window.localStorage.getItem('loginForm')) : {}
    const initialEmail = email || ''
    const initialPassword = password || ''
    if (initialEmail !== '' && initialPassword !== '') {
      props.loginUser(initialEmail, initialPassword)
    }
  }

  React.useEffect(() => {
    if (userValid) {
      props.getApiEntities()
    } else if (user !== null && !userValid) {
      programmaticLoginUser()
    }
  }, [user])

  if (props.areEntitiesLoading && !userValid) { //props.areEntitiesLoading
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
    getApiEntities: () => {dispatch(getApiEntities())},
    setAreEntitiesLoading: () => {dispatch(setAreEntitiesLoading())},
    loginUser: (email, password) => {dispatch(loginUser(email, password))}
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    areEntitiesLoading: state.general.areEntitiesLoading
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)