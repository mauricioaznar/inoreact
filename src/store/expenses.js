const expenses = (state = {
  expenses: [],
  expenseCategories: [],
  expenseSubcategories: [],
  expenseTypes: [],
  suppliers: [],
  paymentMethods: [],
  cdfiUses: [],
  paymentForms: [],
  moneySources: []
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
    case 'SET_EXPENSE_INVOICE_PAYMENT_FORMS':
      return {...state, paymentForms: action.paymentForms}
    case 'SET_EXPENSE_MONEY_SOURCES':
      return {...state, moneySources: action.moneySources}
    case 'SET_EXPENSE_INVOICE_CDFI_USES':
      return {...state, cdfiUses: action.cdfiUses}
    default:
      return state
  }
}

export default expenses