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


export const setSales = (sales) => {
  return {
    type: 'SET_SALES',
    sales: sales
  }
}

export const setSalesProducts = (salesProducts) => {
  return {
    type: 'SET_SALES_PRODUCTS',
    salesProducts: salesProducts
  }
}