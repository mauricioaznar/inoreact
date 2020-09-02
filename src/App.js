import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import {connect} from 'react-redux'
import {loginUser} from './store/authActions'



function App(props) {
  //Correct permanent session logic with dates, token invalidation and token creation
  // Could check on intervals to execute this function
  React.useEffect(() => {
    const {email, password} = window.localStorage.getItem('loginForm') ? JSON.parse(window.localStorage.getItem('loginForm')) : {}
    const initialEmail = email || ''
    const initialPassword = password || ''
    if (initialEmail !== '' && initialPassword !== '') {
      props.loginUser(initialEmail, initialPassword)
    }
  }, [])

  return (
    <div className="Auth">
      {!props.authenticated ? <LoginForm /> : <Home />}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    authenticated: state.auth.authenticated
  }
}

const mapDispatchToProps = (dispatch, getState) => {
  return {
    loginUser: (email, password) => {dispatch(loginUser(email, password))}
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
