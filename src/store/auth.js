const validateToken = () => {
  return window.localStorage.getItem('auth') ? JSON.parse(window.localStorage.getItem('auth')) : null
}

const auth = (state = {
  authenticated: validateToken() !== null,
  token: validateToken() !== null ? validateToken().token : '',
  isTokenLoading: false,
  areEntitiesLoading: false,
  orderProductions: [],
  sales: [],
  requests: [],
  requestsProducts: [],
  inventory: []
}, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {...state, authenticated: true, token: action.token}
    case 'UNSET_TOKEN':
      return {...state, authenticated: false, token: null}
    case 'SET_IS_TOKEN_LOADING':
      return {...state, isTokenLoading: true}
    case 'UNSET_IS_TOKEN_LOADING':
      return {...state, isTokenLoading: false}
    case 'SET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: true}
    case 'UNSET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: false}
    case 'SET_ORDER_PRODUCTIONS':
      return {...state, orderProductions: action.orderProductions}
    case 'SET_SALES':
      return {...state, sales: action.sales}
    case 'SET_REQUESTS_PRODUCTS':
      return {...state, requestsProducts: action.requestsProducts}
    case 'SET_REQUESTS':
      return {...state, requests: action.requests}
    case 'SET_INVENTORY':
      return {...state, inventory: action.inventory}
    default:
      return state
  }
}

export default auth