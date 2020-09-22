const validateToken = () => {
  return window.localStorage.getItem('auth') ? JSON.parse(window.localStorage.getItem('auth')) : null
}

const auth = (state = {
  authenticated: validateToken() !== null,
  token: validateToken() !== null ? validateToken().token : '',
  isTokenLoading: false,
  isSuperAdmin: false,
  isAdmin: false,
  isProduction: false,
  isSales: false,
  isExpenses: false,
  isMaintenance: false,
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
    case 'SET_ROLE':
      switch (action.roleId) {
        case 1:
          return {...state, isAdmin: true, isSuperAdmin: true}
        case 2:
          return {...state, isAdmin: true}
        case 3:
          return {...state, isExpenses: true}
        case 4:
          return {...state, isProduction: true}
        case 5:
          return {...state, isSales: true}
        default:
          return state
      }
    case 'UNSET_ROLE':
      return {
        ...state,
        isSuperAdmin: false,
        isAdmin: false,
        isProduction: false,
        isSales: false,
        isExpenses: false,
        isMaintenance: false
      }
    default:
      return state
  }
}

export default auth
