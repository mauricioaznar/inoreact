const validateToken = () => {
  return window.localStorage.getItem('auth') ? JSON.parse(window.localStorage.getItem('auth')) : null
}

const auth = (state = {
  authenticated: validateToken() !== null,
  token: validateToken() !== null ? validateToken().token : '',
  isTokenLoading: false
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
    default:
      return state
  }
}

export default auth
