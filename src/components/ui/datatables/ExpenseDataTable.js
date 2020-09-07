import React, {forwardRef} from 'react'
import {connect} from 'react-redux'


import AddBox from '@material-ui/icons/AddBox';
import ImportExport from '@material-ui/icons/ImportExport'
import Edit from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress'

import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import MaterialTable from 'material-table'
import Dialog from '@material-ui/core/Dialog'
import ExpenseForm from '../forms/ExpenseForm'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateMomentUtils from '@date-io/moment'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {localization, tableIcons} from './common/common'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'

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


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const mapExpenseToInvoice = (expenses) => {
  return expenses.map(expense => {
    return {
      id: expense.id
    }
  })
}

//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ExpenseDataTable(props) {

  const classes = useStyles()

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);
  const [date, setDate] = React.useState(moment().subtract(1, 'month').format('YYYY-MM-DD'))
  const [loading, setLoading] = React.useState(false)
  const [exportedExpenses, setExportedExpenses] = React.useState(null)

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      let paidInvoicesResponse = await axios.get(apiUrl + 'expense/list?', {headers: {...authHeader()}})
      if (active) {
        let startDate = moment(date).startOf('month').format(dateFormat)
        let endDate = moment(date).add(1, 'month').startOf('month').format(dateFormat)
        paidInvoicesResponse = await axios.get(apiUrl + 'expense/list?' +
          'paginate=false' +
          '&filter_exact_1=expense_type_id' +
          '&filter_exact_value_1=2' +
          '&start_date_1=date_paid' +
          '&start_date_value_1=' +  startDate +
          '&end_date_1=date_paid' +
          '&end_date_value_1=' +  endDate,
          {headers: {...authHeader()}})
        setExportedExpenses({paidInvoices: mapExpenseToInvoice(paidInvoicesResponse.data.data)})
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [date])

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
            localization={localization}
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
                icon: (props) =>
                  loading ? <CircularProgress size={25} /> :
                    <ImportExport {...props} color={'action'} fontSize={'small'} />,
                tooltip: 'Exportar',
                isFreeAction: true,
                onClick: (event) => {
                  if (!loading) {
                    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                    const fileExtension = '.xlsx';
                    let workbook = xlsx.utils.book_new()
                    let invoicesExcel = xlsx.utils.json_to_sheet(exportedExpenses.paidInvoices)
                    xlsx.utils.book_append_sheet(workbook, invoicesExcel, 'Facturas pagadas')
                    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
                    const data = new Blob([excelBuffer], {type: fileType})
                    fileSaver.saveAs(data, 'Facturas de ' + fileExtension)
                  }
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
                          setDate(momentDate !== null && momentDate.isValid() ? momentDate.format('YYYY-MM-DD') : null)
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