const sales = (state = {
  sales: [],
  salesProducts: [],
  requests: [],
  requestsProducts: [],
}, action) => {
  switch (action.type) {
    case 'SET_SALES':
      return {...state, sales: action.sales}
    case 'SET_SALES_PRODUCTS':
      return {...state, salesProducts: action.salesProducts}
    case 'SET_REQUESTS_PRODUCTS':
      return {...state, requestsProducts: action.requestsProducts}
    case 'SET_REQUESTS':
      return {...state, requests: action.requests}
    default:
      return state
  }
}

export default sales
