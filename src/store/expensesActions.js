export const setExpenseCategories = (expenseCategories) => {
  return {
    type: 'SET_EXPENSE_CATEGORIES',
    expenseCategories
  }
}

export const setExpenseSubcategories = (expenseSubcategories) => {
  return {
    type: 'SET_EXPENSE_SUBCATEGORIES',
    expenseSubcategories
  }
}


export const setSuppliers = (suppliers) => {
  return {
    type: 'SET_SUPPLIERS',
    suppliers
  }
}

export const setExpenseTypes = (expenseTypes) => {
  return {
    type: 'SET_EXPENSE_TYPES',
    expenseTypes
  }
}

export const setExpenseInvoicePaymentMethods = (paymentMethods) => {
  return {
    type: 'SET_EXPENSE_INVOICE_PAYMENT_METHODS',
    paymentMethods
  }
}
