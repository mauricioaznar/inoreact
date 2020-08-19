import axios from 'axios'
import authHeader from '../helpers/authHeader'
import {setExpenseCategories, setExpenseSubcategories, setSuppliers, setExpenseTypes} from './expensesActions'
import {setMachines, setMaterials, setProductTypes} from './productionActions'
import apiUrl from '../helpers/apiUrl'

export const setInventory = (inventory) => {
  return {
    type: 'SET_INVENTORY',
    inventory: inventory
  }
}

export const setBranches = (branches) => {
  return {
    type: 'SET_BRANCHES',
    branches: branches
  }
}

export const getApiEntities = () => {
  return (dispatch, getState) => {
    dispatch(setAreEntitiesLoading())
    return axios.all([
      axios.get(apiUrl + 'stats/inventory', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'expenseCategory/list?paginate=false', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'stats/dependentEntities', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'material/list?paginate=false', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'productType/list?paginate=false', {headers: {...authHeader()}}),
      axios.get(apiUrl + 'supplier/list?paginate=false', {headers: {...authHeader()}})
    ]).then(result => {
      // const orderProductions = result[0].data.data[0]
      const inventory = result[0].data.data
      const expenseCategories = result[1].data.data
      const {expense_subcategories: expenseSubcategories, machines, branches, expense_type: expenseTypes} = result[2].data.data
      const materials = result[3].data.data
      const productTypes = result[4].data.data
      const suppliers = result[5].data.data
      // dispatch(setOrderProductions(orderProductions))
      dispatch(setInventory(inventory))
      dispatch(setBranches(branches))
      dispatch(setExpenseCategories(expenseCategories))
      dispatch(setExpenseSubcategories(expenseSubcategories))
      dispatch(setMaterials(materials))
      dispatch(setMachines(machines))
      dispatch(setProductTypes(productTypes))
      dispatch(setSuppliers(suppliers))
      dispatch(setExpenseTypes(expenseTypes))
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