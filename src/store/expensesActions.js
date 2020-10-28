import {setAreEntitiesLoading, setBranches, setEmployees, setRoles} from './generalActions'
import axios from 'axios'
import apiUrl from '../helpers/apiUrl'
import authHeader from '../helpers/authHeader'
import {
  setMachines,
  setMaterials,
  setOrderProductionTypes,
  setPackings,
  setProducts,
  setProductTypes
} from './productionActions'
import {
  setClients,
  setOrderRequestStatuses,
  setOrderSaleCollectionStatuses,
  setSaleReceiptTypes,
  setSaleStatuses
} from './salesActions'
import {setProductionEventTypes} from './maintenanceActions'

export const setExpenseCategories = (expenseCategories) => {
  return {
    type: 'SET_EXPENSE_CATEGORIES',
    expenseCategories
  }
}

export const setExpenseSubcategories = (expenseSubcategories) => {
  return {
    type: 'SET_EXPENSE_SUBCATEGORIES',
    expenseSubcategories
  }
}


export const setSuppliers = (suppliers) => {
  return {
    type: 'SET_SUPPLIERS',
    suppliers
  }
}

export const setExpenseTypes = (expenseTypes) => {
  return {
    type: 'SET_EXPENSE_TYPES',
    expenseTypes
  }
}

export const setExpenseInvoicePaymentMethods = (paymentMethods) => {
  return {
    type: 'SET_EXPENSE_INVOICE_PAYMENT_METHODS',
    paymentMethods
  }
}

export const setExpenseInvoicePaymentForms = (paymentForms) => {
  return {
    type: 'SET_EXPENSE_INVOICE_PAYMENT_FORMS',
    paymentForms
  }
}

export const setExpenseMoneySources = (moneySources) => {
  return {
    type: 'SET_EXPENSE_MONEY_SOURCES',
    moneySources
  }
}

export const setExpenseInvoiceCdfiUses = (cdfiUses) => {
  return {
    type: 'SET_EXPENSE_INVOICE_CDFI_USES',
    cdfiUses
  }
}


export const getSuppliers = () => {
  return (dispatch, getState) => {
    return axios.get(apiUrl + 'supplier/list?paginate=false', {headers: {...authHeader()}})
      .then(result => {
        const suppliers = result.data.data
        console.log(suppliers)
        dispatch(setSuppliers(suppliers))
      })
  }
}



//
// case 'SET_EXPENSE_INVOICE_PAYMENT_FORMS':
// return {...state, paymentForms: action.paymentForms}
// case 'SET_EXPENSE_MONEY_SOURCES':
// return {...state, moneySources: action.moneySources}
// case 'SET_EXPENSE_INVOICE_CDFI_USES':
// return {...state, cdfiUses: action.cdfiUses}