import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import moment from 'moment'
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import combinedReducers from './store/index'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {BrowserRouter as Router} from 'react-router-dom'

const store = createStore(combinedReducers, {}, composeWithDevTools(applyMiddleware(thunk)))


moment.locale('es')

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
