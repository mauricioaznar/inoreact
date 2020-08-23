const expenses = (state = {
  expenses: [],
  expenseCategories: [],
  expenseSubcategories: [],
  expenseTypes: [],
  suppliers: [],
  paymentMethods: []
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
    case 'SET_EXPENSE_TYPES':
      return {...state, expenseTypes: action.expenseTypes}
    case 'SET_EXPENSE_INVOICE_PAYMENT_METHODS':
      return {...state, paymentMethods: action.paymentMethods}
    default:
      return state
  }
}

export default expenses