import axios from 'axios'
import authHeader from '../helpers/authHeader'


const url = process.env.NODE_ENV === 'development' ? 'http://inoserver.test/api/' : 'https://babytester.grupoinopack.com/api/'

export const loginUser = (email, password) => {
  return (dispatch, getState) => {
    dispatch(setIsTokenLoading())
    return axios.post(url + 'auth/login', {email, password}).then(result => {
      const token = result.data.data.token
      dispatch(setToken(token))
    }).catch(e => {
      console.log(e)
    })
  }
}


export const getApiEntities = () => {
  return (dispatch, getState) => {
    dispatch(setAreEntitiesLoading())
    return axios.all([
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/inventory', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
      axios.get(url + 'stats/sales', {headers: {...authHeader()}}),
    ]).then(result => {
      // const orderProductions = result[0].data.data[0]
      const {sales, requests, requests_products} = result[0].data.data
      const inventory = result[1].data.data
      // dispatch(setOrderProductions(orderProductions))
      dispatch(setSales(sales))
      dispatch(setRequests(requests))
      dispatch(setRequestsProducts(requests_products))
      dispatch(setInventory(inventory))
    }).finally(() => {
      dispatch(unsetAreEntitiesLoading())
    })
  }
}


export const setOrderProductions = (orderProductions) => {
  return {
    type: 'SET_ORDER_PRODUCTIONS',
    orderProductions: orderProductions
  }
}

export const setSales = (sales) => {
  return {
    type: 'SET_SALES',
    sales: sales
  }
}

export const setRequests = (requests) => {
  return {
    type: 'SET_REQUESTS',
    requests: requests
  }
}

export const setRequestsProducts = (requestsProducts) => {
  return {
    type: 'SET_REQUESTS_PRODUCTS',
    requestsProducts: requestsProducts
  }
}

export const setInventory = (inventory) => {
  return {
    type: 'SET_INVENTORY',
    inventory: inventory
  }
}


export const setAreEntitiesLoading = () => {
  return {
    type: 'SET_ARE_ENTITIES_LOADING'
  }
}

export const unsetAreEntitiesLoading = () => {
  return {
    type: 'UNSET_ARE_ENTITIES_LOADING'
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