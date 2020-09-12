import axios from 'axios'
import authHeader from '../helpers/authHeader'
import {
  setExpenseCategories,
  setExpenseSubcategories,
  setSuppliers,
  setExpenseTypes,
  setExpenseInvoicePaymentMethods, setExpenseInvoicePaymentForms, setExpenseInvoiceCdfiUses, setExpenseMoneySources
} from './expensesActions'
import {
  setMachines,
  setMaterials,
  setProducts,
  setProductTypes
} from './productionActions'
import apiUrl from '../helpers/apiUrl'
import {
  setClients,
  setOrderRequestStatuses,
  setOrderSaleCollectionStatuses
} from './salesActions'

export const setInventory = (inventory) => {
  return {
    type: 'SET_INVENTORY',
    inventory: inventory
  }
}

export const setInventoryDrawerOpen = (inventoryDrawerOpen) => {
  return {
    type: 'SET_INVENTORY_DRAWER_OPEN',
    inventoryDrawerOpen: inventoryDrawerOpen
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
      axios.get(apiUrl + 'stats/dependentEntities', {headers: {...authHeader()}}),
    ]).then(result => {
      // const orderProductions = result[0].data.data[0]
      const inventory = result[0].data.data
      const {
        expense_subcategories: expenseSubcategories,
        machines,
        branches,
        expense_type: expenseTypes,
        expense_categories: expenseCategories,
        suppliers,
        product_type: productTypes,
        materials,
        expense_invoice_payment_methods,
        products,
        expense_invoice_cdfi_uses: cdfiUses,
        expense_invoice_payment_forms: paymentForms,
        expense_money_sources: moneySources,
        order_sale_collection_statuses: collectionStatuses,
        order_request_statuses: requestStatuses,
        clients
      } = result[1].data.data
      // dispatch(setOrderProductions(orderProductions))
      dispatch(setInventory(inventory))
      dispatch(setBranches(branches))
      dispatch(setExpenseCategories(expenseCategories))
      dispatch(setExpenseInvoicePaymentMethods(expense_invoice_payment_methods))
      dispatch(setExpenseSubcategories(expenseSubcategories))
      dispatch(setMaterials(materials))
      dispatch(setMachines(machines))
      dispatch(setProductTypes(productTypes))
      dispatch(setSuppliers(suppliers))
      dispatch(setExpenseTypes(expenseTypes))
      dispatch(setProducts(products))
      dispatch(setExpenseInvoicePaymentForms(paymentForms))
      dispatch(setExpenseInvoiceCdfiUses(cdfiUses))
      dispatch(setExpenseMoneySources(moneySources))
      dispatch(setOrderSaleCollectionStatuses(collectionStatuses))
      dispatch(setOrderRequestStatuses(requestStatuses))
      dispatch(setClients(clients))
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