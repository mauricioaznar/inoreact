import axios from 'axios'
import authHeader from '../helpers/authHeader'
import {
    setExpenseCategories,
    setExpenseInvoiceCdfiUses,
    setExpenseInvoicePaymentForms,
    setExpenseInvoicePaymentMethods,
    setExpenseMoneySources,
    setExpenseSubcategories,
    setExpenseTypes,
    setSuppliers
} from './expensesActions'
import {
    setMachines,
    setMachineTypes,
    setMaterials,
    setOrderProductionTypes,
    setPackings,
    setProducts,
    setProductTypes
} from './productionActions'
import apiUrl from '../helpers/apiUrl'
import {
    setClients,
    setOrderRequestStatuses,
    setOrderSaleCollectionStatuses,
    setSaleReceiptTypes,
    setSaleStatuses
} from './salesActions'
import {
    setEquipmentCategories,
    setEquipmentMeasurementUnits,
    setEquipments,
    setEquipmentSubcategories,
    setEquipmentTransactionStatuses,
    setEquipmentTransactionTypes,
    setProductionEventTypes
} from './maintenanceActions'

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

export const setEmployees = (employees) => {
  return {
    type: 'SET_EMPLOYEES',
    employees: employees
  }
}

export const setRoles = (roles) => {
  return {
    type: 'SET_ROLES',
    roles: roles
  }
}

export const getApiEntities = () => {
  return (dispatch, getState) => {
    dispatch(setAreEntitiesLoading())
    return axios.all([
      axios.get(apiUrl + 'stats/dependentEntities', {headers: {...authHeader()}})
    ]).then(result => {
      // const orderProductions = result[0].data.data[0]
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
        clients,
        employees,
        roles,
        order_production_type: orderProductionTypes,
        production_event_type: productionEventTypes,
        packings,
        order_sale_statuses: saleStatuses,
        order_sale_receipt_type: saleReceiptTypes,
        equipment_categories,
        equipment_subcategories,
        equipment_measurement_units,
        equipment_transaction_type,
        equipment_transaction_statuses,
        equipments,
        machine_type: machineTypes
      } = result[0].data.data
      // dispatch(setOrderProductions(orderProductions))
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
      dispatch(setEmployees(employees))
      dispatch(setRoles(roles))
      dispatch(setOrderProductionTypes(orderProductionTypes))
      dispatch(setProductionEventTypes(productionEventTypes))
      dispatch(setPackings(packings))
      dispatch(setSaleStatuses(saleStatuses))
      dispatch(setSaleReceiptTypes(saleReceiptTypes))
      dispatch(setEquipmentCategories(equipment_categories))
      dispatch(setEquipmentSubcategories(equipment_subcategories))
      dispatch(setEquipmentMeasurementUnits(equipment_measurement_units))
      dispatch(setEquipmentTransactionTypes(equipment_transaction_type))
      dispatch(setEquipmentTransactionStatuses(equipment_transaction_statuses))
      dispatch(setEquipments(equipments))
      dispatch(setMachineTypes(machineTypes))
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