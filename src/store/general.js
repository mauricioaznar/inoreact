const general = (state = {
  inventory: [],
  branches: [],
  areEntitiesLoading: false,
}, action) => {
  switch (action.type) {
    case 'SET_INVENTORY':
      return {...state, inventory: action.inventory}
    case 'SET_BRANCHES':
      return {...state, branches: action.branches}
    case 'SET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: true}
    case 'UNSET_ARE_ENTITIES_LOADING':
      return {...state, areEntitiesLoading: false}
    default:
      return state
  }
}

export default general