const production = (state = {
  orderProductions: [],
}, action) => {
  switch (action.type) {
    case 'SET_ORDER_PRODUCTIONS':
      return {...state, orderProductions: action.orderProductions}
    default:
      return state
  }
}

export default production