const production = (state = {
  orderProductions: [],
  materials: [],
  productTypes: []
}, action) => {
  switch (action.type) {
    case 'SET_ORDER_PRODUCTIONS':
      return {...state, orderProductions: action.orderProductions}
    case 'SET_MATERIALS':
      return {...state, materials: action.materials}
    case 'SET_PRODUCT_TYPES':
      return {...state, productTypes: action.productTypes}
    default:
      return state
  }
}

export default production