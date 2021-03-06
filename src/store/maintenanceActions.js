import axios from 'axios'
import apiUrl from '../helpers/apiUrl'
import authHeader from '../helpers/authHeader'

export const setProductionEventTypes = (productionEventTypes) => {
  return {
    type: 'SET_PRODUCTION_EVENT_TYPES',
    productionEventTypes: productionEventTypes
  }
}

export const setEquipmentCategories = (equipmentCategories) => {
  return {
    type: 'SET_EQUIPMENT_CATEGORIES',
    equipmentCategories: equipmentCategories
  }
}

export const setEquipmentSubcategories = (equipmentSubcategories) => {
  return {
    type: 'SET_EQUIPMENT_SUBCATEGORIES',
    equipmentSubcategories
  }
}

export const setEquipmentMeasurementUnits = (equipmentMeasurementUnits) => {
  return {
    type: 'SET_EQUIPMENT_MEASUREMENT_UNITS',
    equipmentMeasurementUnits
  }
}

export const setEquipmentTransactionTypes = (equipmentTransactionTypes) => {
  return {
    type: 'SET_EQUIPMENT_TRANSACTION_TYPES',
    equipmentTransactionTypes
  }
}

export const setEquipmentTransactionStatuses = (equipmentTransactionStatuses) => {
  return {
    type: 'SET_EQUIPMENT_TRANSACTION_STATUSES',
    equipmentTransactionStatuses
  }
}

export const setEquipments = (equipments) => {
  return {
    type: 'SET_EQUIPMENTS',
    equipments
  }
}

export const getEquipments = () => {
  return (dispatch, getState) => {
    return axios.get(apiUrl + 'equipment/list?paginate=false&simple=true', {headers: {...authHeader()}})
      .then(result => {
        const equipments = result.data.data
        dispatch(setEquipments(equipments))
      })
  }
}