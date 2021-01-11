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

export const setPackings = (packings) => {
  return {
    type: 'SET_PACKINGS',
    packings: packings
  }
}

export const setMachines = (machines) => {
  return {
    type: 'SET_MACHINES',
    machines: machines
  }
}

export const setMachineTypes = (machineTypes) => {
  return {
    type: 'SET_MACHINE_TYPES',
    machineTypes: machineTypes
  }
}

export const setProducts = (products) => {
  return {
    type: 'SET_PRODUCTS',
    products: products
  }
}


export const setProductTypes = (productTypes) => {
  return {
    type: 'SET_PRODUCT_TYPES',
    productTypes: productTypes
  }
}

export const setOrderProductionTypes = (orderProductionTypes) => {
  return {
    type: 'SET_ORDER_PRODUCTION_TYPES',
    orderProductionTypes: orderProductionTypes
  }
}