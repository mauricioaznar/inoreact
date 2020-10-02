import {combineReducers} from 'redux'
import auth from './auth'
import expenses from './expenses'
import sales from './sales'
import production from './production'
import general from './general'
import maintenance from './maintenance'


export default combineReducers(
  {
      auth,
      expenses,
      sales,
      production,
      maintenance,
      general
    }
  )