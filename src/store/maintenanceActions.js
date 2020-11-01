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
  console.log(equipmentTransactionTypes)
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