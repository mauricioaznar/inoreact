import React, {forwardRef} from 'react'
import {connect} from 'react-redux'


import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn'

import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import MaterialTable from 'material-table'
import Dialog from '@material-ui/core/Dialog'
import ExpenseForm from './forms/ExpenseForm'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateMomentUtils from '@date-io/moment'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

const dateFormat = 'YYYY-MM-DD'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}
                                          color={'action'}
                                          fontSize={'small'}
  />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref}
                                           color={'action'}
                                           fontSize={'small'}
  />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}
                                           color={'action'}
                                           fontSize={'small'}
  />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}
                                                    color={'action'}
                                                    fontSize={'small'}
  />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}
                                                        color={'action'}
                                                        fontSize={'small'}
  />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}
                                         color={'action'}
                                         fontSize={'small'}
  />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}
                                              color={'action'}
                                              fontSize={'small'}
  />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}
                                                 color={'action'}
                                                 fontSize={'small'}
  />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}
                                                   color={'action'}
                                                   fontSize={'small'}
  />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}
                                                 color={'action'}
                                                 fontSize={'small'}
  />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}
                                                     color={'action'}
                                                     fontSize={'small'}
  />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}
                                                        color={'action'}
                                                        fontSize={'small'}
  />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}
                                                 color={'action'}
                                                 fontSize={'small'}
  />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref}
                                             color={'action'}
                                             fontSize={'small'}
  />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}
                                                       color={'action'}
                                                       fontSize={'small'}
  />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}
                                                      color={'action'}
                                                      fontSize={'small'}
  />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}
                                                     color={'action'}
                                                     fontSize={'small'}
  />)
};

function getDayRange(day = 0, content) {
  let currentStart = moment().add(day, 'days');
  let endDay = moment()
  let days = []

  while (currentStart.isBefore(endDay, '[]')) {
    days.push({
      day: currentStart.format('MM-DD'),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'day')
  }
  return days
}


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ExpenseDataTable(props) {

  const classes = useStyles()

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let expenseTypeLookup = props.expenseTypes.reduce((acc, expenseType) => {
    return {...acc, [expenseType.id]: expenseType.name}
  }, {})

  let suppliersLookup = props.suppliers.reduce((prevObject, supplier) => {
    return {...prevObject, [supplier.id]: supplier.name}
  }, {})

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
    return Promise.all(promises)
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
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MaterialTable
            icons={tableIcons}
            title="Gastos"
            tableRef={tableRef}
            localization={{
              body: {
                deleteTooltip: 'Borrar',
                addTooltip: 'Añadir',
                editTooltip: 'Editar',
                editRow: {
                  deleteText: '¿Estas seguro que quieres borrar esta fila?'
                },
                filterRow: {
                  filterTooltip: 'Filtrar'
                }
              },
              header: {
                actions: 'Acciones'
              },
              pagination: {
                labelDisplayedRows: '{from} - {to} de {count}',
                labelRowsSelect: 'Filas',
                firstTooltip: 'Primera pagina',
                previousTooltip: 'Pagina anterior',
                nextTooltip: 'Pagina siguiente',
                lastTooltip: 'Ultima pagina'

              }
            }}
            editable={{
              onRowDelete: handleRowDelete
            }}
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 40, 60],
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
            columns={[
              {
                title: 'id',
                field: 'id'
              },
              {
                title: 'Fecha de pago',
                field: 'date_paid',
                type: 'date',
                dateSetting: {locale: 'en-ca'},
                defaultFilter: moment().subtract(1, 'month').format('YYYY-MM'),
                filterComponent: (filterProps) => {
                  return (
                    <MuiPickersUtilsProvider utils={DateMomentUtils}>
                      <KeyboardDatePicker
                        clearable
                        autoOk={true}
                        views={["month"]}
                        minDate={new Date("2018-01-01")}
                        maxDate={new Date("2021-12-31")}
                        value={filterProps.columnDef.tableData.filterValue}
                        variant={'dialog'}
                        format={'YYYY-MM'}
                        onChange={(momentDate) => {
                          filterProps.onFilterChanged(
                            filterProps.columnDef.tableData.id,
                            momentDate !== null && momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : null)
                        }}
                        animateYearScrolling
                      />
                    </MuiPickersUtilsProvider>
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
                      getOptionLabel={option => {
                        return option['name']
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                        />
                      )}
                      onChange={(e, data) => {
                        filterProps.onFilterChanged(
                          filterProps.columnDef.tableData.id,
                          data)
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
                        filterProps.onFilterChanged(
                          filterProps.columnDef.tableData.id,
                          data)
                      }}
                    />
                  )
                }
              },
              {
                title: 'Descripcion',
                field: 'description'
              },
              {
                title: 'Total',
                sorting: false,
                type: 'currency',
                render: (rawData) => {
                  let expenseItemsTotal = rawData.expense_items.reduce((a, b) => {
                    return a + b.subtotal
                  }, 0)
                  return <>{formatNumber(expenseItemsTotal)}</>
                }
              }
            ]}
            data={query =>
              new Promise((resolve, reject) => {
                console.log(query)
                let url = apiUrl + 'expense/list?'
                url += 'per_page=' + query.pageSize
                url += '&page=' + (query.page + 1)
                if (query.orderBy) {
                  url += '&sort=' + query.orderBy.field + '|' + query.orderDirection
                }
                if (query.filters) {
                  let likes = 1
                  let exacts = 1
                  query.filters.forEach((filter, index) => {
                    if (filter.column.type === 'date') {
                      let startDate = moment(filter.value).startOf('month').format(dateFormat)
                      url += `&start_date_${index + 1}=${filter.column.field}`
                      url += `&start_date_value_${index + 1}=${startDate}`
                      let endDate = moment(filter.value).startOf('month').add(1, 'month').format(dateFormat)
                      url += `&end_date_${index + 1}=${filter.column.field}`
                      url += `&end_date_value_${index + 1}=${endDate}`
                    } else if (filter.column.lookup) {
                      url += `&filter_exact_${exacts}=${filter.column.field}`
                      url += `&filter_exact_value_${exacts}=${filter.value.id}`
                      exacts++
                    } else {
                      url += `&filter_like_${likes}=${filter.column.field}`
                      url += `&filter_like_value_${likes}=${filter.value}`
                      likes++
                    }
                    // url += `&filter_exact_${index}=${}`
                  })
                }
                axios.get(url, {headers: {...authHeader()}})
                  .then(response => {
                    return response.data
                  })
                  .then(result => {
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
    suppliers: state.expenses.suppliers
  }
}

export default connect(mapStateToProps, null)(ExpenseDataTable)