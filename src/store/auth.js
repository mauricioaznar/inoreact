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
  isRoleSet: false,
  isUserBranchCaucel: false,
  isUserBranchBaca: false,
  isUserBranchBoth: false,
  isUserBranchSet: false
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
          return {...state, isRoleSet: true, isAdmin: true, isSuperAdmin: true}
        case 2:
          return {...state, isRoleSet: true, isAdmin: true}
        case 3:
          return {...state, isRoleSet: true, isExpenses: true}
        case 4:
          return {...state, isRoleSet: true, isProduction: true}
        case 5:
          return {...state, isRoleSet: true, isSales: true}
        default:
          return state
      }
    case 'UNSET_ROLE':
      return {
        ...state,
        isRoleSet: false,
        isSuperAdmin: false,
        isAdmin: false,
        isProduction: false,
        isSales: false,
        isExpenses: false,
        isMaintenance: false
      }
    case 'SET_USER_BRANCH':
      switch (action.userBranchId) {
        case 1:
          return {...state, isUserBranchSet: true, isUserBranchCaucel: true}
        case 2:
          return {...state, isUserBranchSet: true, isUserBranchBaca: true}
        case 3:
          return {...state, isUserBranchSet: true, isUserBranchBoth: true}
        default:
          return state
      }
    case 'UNSET_USER_BRANCH':
      return {
        ...state,
        isUserBranchSet: false,
        isUserBranchCaucel: false,
        isUserBranchBaca: false,
        isUserBranchBoth: false
      }
    default:
      return state
  }
}

export default auth
