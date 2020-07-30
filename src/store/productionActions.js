export const setOrderProductions = (orderProductions) => {
  return {
    type: 'SET_ORDER_PRODUCTIONS',
    orderProductions: orderProductions
  }
}

export const setMaterials = (materials) => {
  return {
    type: 'SET_MATERIALS',
    materials: materials
  }
}

export const setProductTypes = (productTypes) => {
  return {
    type: 'SET_PRODUCT_TYPES',
    productTypes: productTypes
  }
}