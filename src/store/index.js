import {combineReducers} from 'redux'
import auth from './auth'
import expenses from './expenses'
import sales from './sales'
import production from './production'
import general from './general'


export default combineReducers({auth, expenses, sales, production, general})