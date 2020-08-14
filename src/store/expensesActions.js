export const setExpenses = (expenses) => {
  return {
    type: 'SET_EXPENSES',
    expenses: expenses
  }
}

export const setExpenseCategories = (expenseCategories) => {
  return {
    type: 'SET_EXPENSE_CATEGORIES',
    expenseCategories: expenseCategories
  }
}

export const setExpenseSubcategories = (expenseSubcategories) => {
  return {
    type: 'SET_EXPENSE_SUBCATEGORIES',
    expenseSubcategories: expenseSubcategories
  }
}


export const setSuppliers = (suppliers) => {
  return {
    type: 'SET_SUPPLIERS',
    suppliers: suppliers
  }
}
