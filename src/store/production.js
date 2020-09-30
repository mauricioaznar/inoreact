const production = (state = {
  orderProductions: [],
  materials: [],
  productTypes: [],
  machines: [],
  products: [],
  orderProductionTypes: []
}, action) => {
  switch (action.type) {
    case 'SET_ORDER_PRODUCTIONS':
      return {...state, orderProductions: action.orderProductions}
    case 'SET_MATERIALS':
      return {...state, materials: action.materials}
    case 'SET_PRODUCT_TYPES':
      return {...state, productTypes: action.productTypes}
    case 'SET_MACHINES':
      return {...state, machines: action.machines}
    case 'SET_PRODUCTS':
      return {...state, products: action.products}
    case 'SET_ORDER_PRODUCTION_TYPES':
      return {...state, orderProductionTypes: action.orderProductionTypes}
    default:
      return state
  }
}

export default production