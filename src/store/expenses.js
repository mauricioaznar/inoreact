const expenses = (state = {
  expenses: [],
  expenseCategories: [],
  expenseSubcategories: [],
  suppliers: []
}, action) => {
  switch (action.type) {
    case 'SET_EXPENSES':
      return {...state, expenses: action.expenses}
    case 'SET_EXPENSE_CATEGORIES':
      return {...state, expenseCategories: action.expenseCategories}
    case 'SET_EXPENSE_SUBCATEGORIES':
      return {...state, expenseSubcategories: action.expenseSubcategories}
    case 'SET_SUPPLIERS':
      return {...state, suppliers: action.suppliers}
    default:
      return state
  }
}

export default expenses