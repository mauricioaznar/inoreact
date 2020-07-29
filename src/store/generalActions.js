import axios from 'axios'
import authHeader from '../helpers/authHeader'
import {setRequests, setRequestsProducts, setSales} from './salesActions'
import {setExpenses, setExpenseCategories, setExpenseSubcategories} from './expensesActions'
import apiUrl from '../helpers/apiUrl'

export const setInventory = (inventory) => {
  return {
    type: 'SET_INVENTORY',
    inventory: inventory
  }
}

export const getApiEntities = () => {
  return (dispatch, getState) => {
    dispatch(setAreEntitiesLoading())
    return axios.all([
      axios.get(apiUrl + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'stats/inventory', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'stats/expenses', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'expenseCategory/list?paginate=false', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'expenseSubcategory/list?paginate=false', {headers: {...authHeader()}})
    ]).then(result => {
      // const orderProductions = result[0].data.data[0]
      const {sales, requests, requests_products} = result[0].data.data
      const inventory = result[1].data.data
      const expenses = result[2].data.data
      const expenseCategories = result[3].data.data
      const expenseSubcategories = result[4].data.data
      // dispatch(setOrderProductions(orderProductions))
      dispatch(setSales(sales))
      dispatch(setRequests(requests))
      dispatch(setRequestsProducts(requests_products))
      dispatch(setInventory(inventory))
      dispatch(setExpenses(expenses))
      dispatch(setExpenseCategories(expenseCategories))
      dispatch(setExpenseSubcategories(expenseSubcategories))
    }).finally(() => {
      dispatch(unsetAreEntitiesLoading())
    })
  }
}

export const setAreEntitiesLoading = () => {
  return {
    type: 'SET_ARE_ENTITIES_LOADING'
  }
}

export const unsetAreEntitiesLoading = () => {
  return {
    type: 'UNSET_ARE_ENTITIES_LOADING'
  }
}