import axios from 'axios'
import apiUrl from '../helpers/apiUrl'

export const loginUser = (email, password) => {
  return (dispatch, getState) => {
    dispatch(setIsTokenLoading())
    return axios.post(apiUrl + 'auth/login', {email, password}).then(result => {
      const token = result.data.data.token
      dispatch(setToken(token))
    }).catch(e => {
      console.log(e)
    })
  }
}

export const setIsTokenLoading = () => {
  return {
    type: 'SET_IS_TOKEN_LOADING'
  }
}

export const unsetIsTokenLoading = () => {
  return {
    type: 'UNSET_IS_TOKEN_LOADING'
  }
}

export const setToken = (token) => {
  window.localStorage.setItem('auth', JSON.stringify({token: token}))
  return {
    type: 'SET_TOKEN',
    token: token
  }
}

export const unsetToken = () => {
  window.localStorage.removeItem('auth')
  return {
    type: 'UNSET_TOKEN'
  }
}