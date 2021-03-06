import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import combinedReducers from './store/index'
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly'
import {BrowserRouter as Router} from 'react-router-dom'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import CssBaseline from '@material-ui/core/CssBaseline'
import {ThemeProvider} from '@material-ui/styles';
import DateFnsUtils from '@material-ui/pickers/adapter/moment';
import LocalizationProvider from '@material-ui/pickers/LocalizationProvider'

const store = createStore(combinedReducers, {}, composeWithDevTools(applyMiddleware(thunk)))

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  },
})


ReactDOM.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={DateFnsUtils}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </LocalizationProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
