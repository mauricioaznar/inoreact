import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import {connect} from 'react-redux'
import {loginUser} from './store/authActions'
import useFetch from './helpers/useFetch'
import apiUrl from './helpers/apiUrl'



function App(props) {

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

  }
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
