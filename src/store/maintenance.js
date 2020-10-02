const maintenance = (state = {
  productionEventTypes: []
}, action) => {
  switch (action.type) {
    case 'SET_PRODUCTION_EVENT_TYPES':
      return {...state, productionEventTypes: action.productionEventTypes}
    default:
      return state
  }
}

export default maintenance