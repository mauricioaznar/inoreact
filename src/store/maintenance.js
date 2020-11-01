const maintenance = (state = {
  productionEventTypes: [],
  equipmentCategories: [],
  equipmentSubcategories: [],
  equipmentMeasurementUnits: [],
  equipmentTransactionTypes: [],
  equipmentTransactionStatuses: [],
  equipments: []
}, action) => {
  switch (action.type) {
    case 'SET_PRODUCTION_EVENT_TYPES':
      return {...state, productionEventTypes: action.productionEventTypes}
    case 'SET_EQUIPMENT_CATEGORIES':
      return {...state, equipmentCategories: action.equipmentCategories}
    case 'SET_EQUIPMENT_SUBCATEGORIES':
      return {...state, equipmentSubcategories: action.equipmentSubcategories}
    case 'SET_EQUIPMENT_MEASUREMENT_UNITS':
      return {...state, equipmentMeasurementUnits: action.equipmentMeasurementUnits}
    case 'SET_EQUIPMENT_TRANSACTION_TYPES':
      console.log(action)
      return {...state, equipmentTransactionTypes: action.equipmentTransactionTypes}
    case 'SET_EQUIPMENT_TRANSACTION_STATUSES':
      return {...state, equipmentTransactionStatuses: action.equipmentTransactionStatuses}
    case 'SET_EQUIPMENTS':
      return {...state, equipments: action.equipments}
    default:
      return state
  }
}

export default maintenance