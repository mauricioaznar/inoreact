const general = (state = {
  inventory: [],
  branches: [],
  employees: [],
  areEntitiesLoading: false,
  inventoryDrawerOpen: false
}, action) => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return {...state, inventory: action.inventory}
    case 'SET_BRANCHES':
      return {...state, branches: action.branches}
    case 'SET_EMPLOYEES':
      return {...state, employees: action.employees}
    case 'SET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: true}
    case 'UNSET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: false}
    case 'SET_INVENTORY_DRAWER_OPEN':
      return {...state, inventoryDrawerOpen: action.inventoryDrawerOpen}
    default:
      return state
  }
}

export default general