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

export const setSaleStatuses = (saleStatuses) => {
  return {
    type: 'SET_ORDER_SALE_STATUSES',
    saleStatuses: saleStatuses
  }
}


export const setSalesProducts = (salesProducts) => {
  return {
    type: 'SET_SALES_PRODUCTS',
    salesProducts: salesProducts
  }
}

export const setOtherIncomes = (otherIncomes) => {
  return {
    type: 'SET_OTHER_INCOMES',
    otherIncomes: otherIncomes
  }
}

export const setSaleReceiptTypes = (saleReceiptTypes) => {
  return {
    type: 'SET_ORDER_SALE_RECEIPT_TYPES',
    saleReceiptTypes: saleReceiptTypes
  }
}


export const setOrderSaleCollectionStatuses = (collectionStatuses) => {
  return {
    type: 'SET_ORDER_SALE_COLLECTION_STATUSES',
    collectionStatuses
  }
}

export const setOrderRequestStatuses = (requestStatuses) => {
  return {
    type: 'SET_ORDER_REQUEST_STATUSES',
    requestStatuses
  }
}

export const setClients = (clients) => {
  return {
    type: 'SET_CLIENTS',
    clients
  }
}