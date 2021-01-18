import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import {connect} from 'react-redux'
import {loginUser, setRole, setUserBranch, unsetToken} from './store/authActions'
import useFetch from './helpers/useFetch'
import apiUrl from './helpers/apiUrl'


function App(props) {

  const user = useFetch(apiUrl + 'auth/user', [props.isTokenLoading])

  let userValid = user && user.id && user.active === 1

  const programmaticLoginUser = () => {
    const {email, password} = window.localStorage.getItem('loginForm') ? JSON.parse(window.localStorage.getItem('loginForm')) : {}
    const initialEmail = email || ''
    const initialPassword = password || ''
    if (initialEmail !== '' && initialPassword !== '') {
      props.loginUser(initialEmail, initialPassword)
    } else {
      props.unsetToken()
    }
  }

  React.useEffect(() => {
    if (user !== null && !userValid) {
      programmaticLoginUser()
    }
    if (userValid) {
      props.setRole(user)
      props.setUserBranch(user)
    }
  }, [user])


  return (
    <div className="Auth">
      {
        !props.authenticated  ? <LoginForm />
        : !userValid ? <div>Validating token...</div>
        : !props.isRoleSet ? <div>Validating role...</div>
        : !props.isUserBranchSet ? <div>Validating user branch...</div>
        : <Home />

      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    authenticated: state.auth.authenticated,
    isTokenLoading: state.auth.isTokenLoading,
    isRoleSet: state.auth.isRoleSet,
    isUserBranchSet: state.auth.isUserBranchSet
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    loginUser: (email, password) => {dispatch(loginUser(email, password))},
    unsetToken: () => {dispatch(unsetToken())},
    setRole: (user) => {dispatch(setRole(user))},
    setUserBranch: (user) => {dispatch(setUserBranch(user))}
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
