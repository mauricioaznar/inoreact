import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import {connect} from 'react-redux'
import {loginUser, unsetToken} from './store/authActions'
import useFetch from './helpers/useFetch'
import apiUrl from './helpers/apiUrl'



function App(props) {


  const user = useFetch(apiUrl + 'auth/user', [props.isTokenLoading, props.token])

  let userValid = user && user.id && user.active === 1

  const programmaticLoginUser = () => {
    const {email, password} = window.localStorage.getItem('loginForm') ? JSON.parse(window.localStorage.getItem('loginForm')) : {}
    const initialEmail = email || ''
    const initialPassword = password || ''
    if (initialEmail !== '' && initialPassword !== '') {
      props.loginUser(initialEmail, initialPassword)
    }
  }

  React.useEffect(() => {
    if (user !== null && !userValid) {
      programmaticLoginUser()
      props.unsetToken()
    }
  }, [user])

  return (
    <div className="Auth">
      {
        !props.authenticated ? <LoginForm />
        : !userValid ? <div>Validating token...</div>
        : <Home />

      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    authenticated: state.auth.authenticated,
    isTokenLoading: state.auth.isTokenLoading,
    token: state.auth.token
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    loginUser: (email, password) => {dispatch(loginUser(email, password))},
    unsetToken: () => {dispatch(unsetToken())}
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
