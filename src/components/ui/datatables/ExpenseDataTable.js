import React from 'react'
import {connect} from 'react-redux'


import AddBox from '@material-ui/icons/AddBox';
import Edit from '@material-ui/icons/Edit';

import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import MaterialTable from 'material-table'
import Dialog from '@material-ui/core/Dialog'
import ExpenseForm from '../forms/ExpenseForm'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {localization, tableIcons} from './common/common'
import MaterialTableDate from './common/MaterialTableDate'
import MaterialTableText from './common/MaterialTableText'

const dateFormat = 'YYYY-MM-DD'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}




//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ExpenseDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  let expenseTypeLookup = props.expenseTypes.reduce((acc, expenseType) => {
    return {...acc, [expenseType.id]: expenseType.name}
  }, {})

  let suppliersLookup = props.suppliers.reduce((prevObject, supplier) => {
    return {...prevObject, [supplier.id]: supplier.name}
  }, {})

  const columns = [
    {
      title: 'Fecha de pago',
      field: 'date_paid',
      type: 'date',
      dateSetting: {locale: 'en-ca'},
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['date_paid'].value}
              onChange={(momentDate) => {
                handleFilters( 'date_paid', momentDate !== null && momentDate.isValid() ?
                  momentDate.format('YYYY-MM-DD') : null)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Fecha de provision',
      field: 'invoice_provision_date',
      type: 'date',
      dateSetting: {locale: 'en-ca'},
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['invoice_provision_date'].value}
              onChange={(momentDate) => {
                handleFilters( 'invoice_provision_date', momentDate !== null && momentDate.isValid() ?
                  momentDate.format('YYYY-MM-DD') : null)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Fecha de emision',
      field: 'date_emitted',
      type: 'date',
      dateSetting: {locale: 'en-ca'},
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['date_emitted'].value}
              onChange={(momentDate) => {
                handleFilters( 'date_emitted', momentDate !== null && momentDate.isValid() ?
                  momentDate.format('YYYY-MM-DD') : null)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Tipo de gasto',
      field: 'expense_type_id',
      lookup: expenseTypeLookup,
      filterComponent: (filterProps) => {
        return (
          <Autocomplete
            options={props.expenseTypes}
            value={filters['expense_type_id'].value}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              handleFilters( 'expense_type_id', data)
            }}
          />
        )
      }
    },
    {
      title: 'Proveedor',
      field: 'supplier_id',
      lookup: suppliersLookup,
      // defaultFilter: props.suppliers[0],
      filterComponent: (filterProps) => {
        return (
          <Autocomplete
            // defaultValue={props.suppliers[0]}
            value={filters['supplier_id'].value}
            options={props.suppliers}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              handleFilters( 'supplier_id', data)
            }}
          />
        )
      }
    },
    {
      title: 'Descripcion',
      field: 'description',
      filterComponent: (filterProps) => {
        return (
          <MaterialTableText
            focus={filters['description'].focus}
            value={filters['description'].value}
            onChange={(text) => {
              handleFilters( 'description', text)
            }}
          />
        )
      }
    },
    {
      title: 'Codigo de la factura',
      field: 'invoice_code',
      filterComponent: (filterProps) => {
        return (
          <MaterialTableText
            focus={filters['invoice_code'].focus}
            value={filters['invoice_code'].value}
            onChange={(text) => {
              handleFilters( 'invoice_code', text)
            }}
          />
        )
      }
    },
    {
      title: 'Codigo interno',
      field: 'internal_code',
      filterComponent: (filterProps) => {
        return (
          <MaterialTableText
            focus={filters['internal_code'].focus}
            value={filters['internal_code'].value}
            onChange={(text) => {
              handleFilters( 'internal_code', text)
            }}
          />
        )
      }
    },
    {
      title: 'Total',
      sorting: false,
      type: 'currency',
      render: (rawData) => {
        let expenseItemsTotal = rawData.expense_items.reduce((a, b) => {
          return a + b.subtotal
        }, 0)
        return <>${formatNumber(expenseItemsTotal)}</>
      }
    },
    {
      title: 'IVA',
      sorting: false,
      field: 'tax',
      filtering: false,
      type: 'currency'
    }
  ]

  let storageFilters = localStorage.getItem('expense_filters') ?
    JSON.parse(localStorage.getItem('expense_filters')) : {}

  const [filters, setFilters] = React.useState(columns.reduce((acc, column) => {
      return {...acc, [column.field]: {
          value: storageFilters[column.field] ? storageFilters[column.field].value : (column.type === 'date' || column.lookup) ? null : '',
          type: column.type ? column.type : column.lookup ? 'lookup' : 'text',
          focus: false
        }}
    }, {}));

  const handleFilters = (field, value) => {
    const newFilters = {...filters, focus: false}
    const foundFilter = newFilters[field]
    foundFilter.value = value
    foundFilter.focus = true
    setFilters(newFilters)
    tableRef.current && tableRef.current.onQueryChange()
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (expense, callback) => {
    let promises = []
    let expensePromise
    if (expense.id) {
      expensePromise = axios.put(apiUrl + 'expense/' + expense.id, {...expense}, {headers: {...authHeader()}})
    } else {
      expensePromise = axios.post(apiUrl + 'expense', {...expense}, {headers: {...authHeader()}})
    }
    expensePromise.then(result => {
      let expenseId = result.data.data.id

      let deletedExpenseItems = expense.defaultValues.expense_items
      expense.expense_items.forEach(expenseItem => {
        if (expenseItem.id !== '') {
          promises.push(axios.put(apiUrl + 'expenseItem/' + expenseItem.id, {...expenseItem}, {headers: {...authHeader()}}))
          deletedExpenseItems = deletedExpenseItems.filter(initialExpenseItem => {
            return String(initialExpenseItem.id) !== expenseItem.id
          })
        } else {
          promises.push(axios.post(apiUrl + 'expenseItem', {...expenseItem, expense_id: expenseId}, {headers: {...authHeader()}}))
        }
      })
      deletedExpenseItems.forEach(expenseItem => {
        promises.push(axios.put(apiUrl + 'expenseItem/' + expenseItem.id, {active: -1}, {headers: {...authHeader()}}))
      })

      let deletedExpenseComplements = expense.defaultValues.expense_invoice_complements
      expense.expense_invoice_complements.forEach(complement => {
        if (complement.id !== '') {
          promises.push(axios.put(apiUrl + 'expenseInvoiceComplement/' + complement.id, {...complement}, {headers: {...authHeader()}}))
          deletedExpenseComplements = deletedExpenseComplements.filter(initialComplement => {
            return String(initialComplement.id) !== complement.id
          })
        } else {
          promises.push(axios.post(apiUrl + 'expenseInvoiceComplement', {...complement, expense_id: expenseId}, {headers: {...authHeader()}}))
        }
      })
      deletedExpenseComplements.forEach(complement => {
        promises.push(axios.put(apiUrl + 'expenseInvoiceComplement/' + complement.id, {active: -1}, {headers: {...authHeader()}}))
      })

      let deletedExpenseProducts = expense.defaultValues.expense_products
      expense.expense_products.forEach(expenseProduct => {
        if (expenseProduct.id !== '') {
          promises.push(axios.put(apiUrl + 'expenseProduct/' + expenseProduct.id, {...expenseProduct}, {headers: {...authHeader()}}))
          deletedExpenseProducts = deletedExpenseProducts.filter(initialExpenseProduct => {
            return String(initialExpenseProduct.id) !== expenseProduct.id
          })
        } else {
          promises.push(axios.post(apiUrl + 'expenseProduct', {...expenseProduct, expense_id: expenseId}, {headers: {...authHeader()}}))
        }
      })
      deletedExpenseProducts.forEach(expenseProduct => {
        promises.push(axios.put(apiUrl + 'expenseProduct/' + expenseProduct.id, {active: -1}, {headers: {...authHeader()}}))
      })

      let deletedExpenseCreditNotes = expense.defaultValues.expense_credit_notes
      expense.expense_credit_notes.forEach(creditNote => {
        if (creditNote.id !== '') {
          promises.push(axios.put(apiUrl + 'expenseCreditNote/' + creditNote.id, {...creditNote}, {headers: {...authHeader()}}))
          deletedExpenseCreditNotes = deletedExpenseCreditNotes.filter(initialExpenseCreditNote => {
            return String(initialExpenseCreditNote.id) !== creditNote.id
          })
        } else {
          promises.push(axios.post(apiUrl + 'expenseCreditNote', {...creditNote, expense_id: expenseId}, {headers: {...authHeader()}}))
        }
      })
      deletedExpenseCreditNotes.forEach(creditNote => {
        promises.push(axios.put(apiUrl + 'expenseCreditNote/' + creditNote.id, {active: -1}, {headers: {...authHeader()}}))
      })
      return Promise.all(promises)
    }).then(results => {
      callback(true)
      tableRef.current && tableRef.current.onQueryChange()
      setOpen(false)
    }).finally(() => {
      props.setUpdates(props.updates + 1)
    })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + 'expense/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    oldData.expense_items.forEach(expenseItem => {
      promises.push(axios.put(apiUrl + 'expenseItem/' + expenseItem.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_credit_notes.forEach(creditNote => {
      promises.push(axios.put(apiUrl + 'expenseCreditNote/' + creditNote.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_products.forEach(expenseProduct => {
      promises.push(axios.put(apiUrl + 'expenseProduct/' + expenseProduct.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_invoice_complements.forEach(complement => {
      promises.push(axios.put(apiUrl + 'expenseInvoiceComplement/' + complement.id, {active: -1}, {headers: {...authHeader()}}))
    })
    return Promise.all(promises).then(results => {
      return new Promise((resolve, reject) => {
        props.setUpdates(props.updates + 1)
        resolve()
      })
    })
  }


  return (
    <>
      <Grid
        container
        direction={'column'}
      >
        <Grid
          item
          xs={12}
          style={{marginTop: '2em'}}
        >
          <MaterialTable
            icons={tableIcons}
            title="Gastos"
            tableRef={tableRef}
            localization={localization}
            editable={{
              onRowDelete: (oldData) => {
                return handleRowDelete(oldData)
              }
            }}
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 20, 30],
              selection: false,
              search: false,
              filtering: true
            }}
            actions={[
              {
                icon: (props) => <Edit {...props} color={'action'} fontSize={'small'} />,
                position: 'row',
                tooltip: 'Editar',
                onClick: (event, rowData) => {
                  setRowData(rowData)
                  setOpen(true)
                }
              },
              {
                icon: (props) => <AddBox {...props} color={'action'} fontSize={'small'} />,
                tooltip: 'Agregar',
                isFreeAction: true,
                onClick: (event) => {
                  setRowData(null)
                  setOpen(true)
                }
              }
            ]}
            columns={columns}
            data={query =>
              new Promise((resolve, reject) => {
                let url = apiUrl + 'expense/list?'
                url += 'per_page=' + query.pageSize
                url += '&page=' + (query.page + 1)
                if (query.orderBy) {
                  url += '&sort=' + query.orderBy.field + '|' + query.orderDirection
                }
                let likes = 1
                let exacts = 1
                let index = 1
                for (let field in filters) {
                  if (filters.hasOwnProperty(field)) {
                    let filter = filters[field]
                    if (filter.type === 'date' && filter.value !== null) {
                      let startDate = moment(filter.value).startOf('month').format(dateFormat)
                      url += `&start_date_${index + 1}=${field}`
                      url += `&start_date_value_${index + 1}=${startDate}`
                      let endDate = moment(filter.value).startOf('month').add(1, 'month').format(dateFormat)
                      url += `&end_date_${index + 1}=${field}`
                      url += `&end_date_value_${index + 1}=${endDate}`
                      index++
                    } else if (filter.type === 'lookup' && filter.value !== null) {
                      url += `&filter_exact_${exacts}=${field}`
                      url += `&filter_exact_value_${exacts}=${filter.value.id}`
                      exacts++
                    } else if (filter.type === 'text' && filter.value !== '') {
                      url += `&filter_like_${likes}=${field}`
                      url += `&filter_like_value_${likes}=${filter.value}`
                      likes++
                    }
                  }
                }
                axios.get(url, {headers: {...authHeader()}})
                  .then(response => {
                    return response.data
                  })
                  .then(result => {
                    localStorage.setItem('expense_filters', JSON.stringify(filters))
                    resolve({
                      data: result.data,
                      page: result.links.pagination.current_page - 1,
                      totalCount: result.links.pagination.total,
                    })
                  })
              })
            }
          />
        </Grid>
      </Grid>
      <Dialog
        maxWidth={!matchesXS ? 'lg' : null}
        fullWidth={!matchesXS || null}
        open={open}
        fullScreen={matchesXS}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <ExpenseForm expense={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    productTypes: state.production.productTypes,
    expenseTypes: state.expenses.expenseTypes,
    suppliers: state.expenses.suppliers,
    paymentMethods: state.expenses.paymentMethods,
    paymentForm: state.expenses.paymentForm,
    moneySources: state.expenses.moneySources
  }
}

export default connect(mapStateToProps, null)(ExpenseDataTable)