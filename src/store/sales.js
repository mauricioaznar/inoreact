const sales = (state = {
  sales: [],
  clients: [],
  salesProducts: [],
  saleStatuses: [],
  requests: [],
  requestsProducts: [],
  requestStatuses: [],
  otherIncomes: [],
  collectionStatuses: []
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
    case 'SET_ORDER_REQUEST_STATUSES':
      return {...state, requestStatuses: action.requestStatuses}
    case 'SET_ORDER_SALE_STATUSES':
      return {...state, saleStatuses: action.saleStatuses}
    case 'SET_ORDER_SALE_COLLECTION_STATUSES':
      return {...state, collectionStatuses: action.collectionStatuses}
    case 'SET_CLIENTS':
      return {...state, clients: action.clients}
    default:
      return state
  }
}

export default sales
