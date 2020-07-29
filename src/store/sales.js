const sales = (state = {
  sales: [],
  requests: [],
  requestsProducts: [],
}, action) => {
  switch (action.type) {
    case 'SET_SALES':
      return {...state, sales: action.sales}
    case 'SET_REQUESTS_PRODUCTS':
      return {...state, requestsProducts: action.requestsProducts}
    case 'SET_REQUESTS':
      return {...state, requests: action.requests}
    default:
      return state
  }
}

export default sales
