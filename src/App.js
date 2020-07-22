import React from 'react';
import './App.css';
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import {connect} from 'react-redux'



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


export default connect(mapStateToProps, null)(App);
