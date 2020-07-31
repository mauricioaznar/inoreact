const sales = (state = {
  sales: [],
  salesProducts: [],
  requests: [],
  requestsProducts: [],
  otherIncomes: []
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
    case 'SET_OTHER_INCOMES':
      return {...state, otherIncomes: action.otherIncomes}
    default:
      return state
  }
}

export default sales
