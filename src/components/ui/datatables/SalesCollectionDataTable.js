import React, {forwardRef} from 'react'
import {connect} from 'react-redux'


import AddBox from '@material-ui/icons/AddBox';
import Edit from '@material-ui/icons/Edit';

import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import MaterialTable from 'material-table'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {localization, tableIcons} from './common/common'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateMomentUtils from '@date-io/moment'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

const dateFormat = 'YYYY-MM-DD'

//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function SalesCollectionDataTable(props) {

  const classes = useStyles()

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [rowData, setRowData] = React.useState(null);

  let collectionStatusesLookup = props.collectionStatuses.reduce((prevObject, collectionStatus) => {
    return {...prevObject, [collectionStatus.id]: collectionStatus.name}
  }, {})

  console.log(collectionStatusesLookup)

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
            title="Cobranzas"
            tableRef={tableRef}
            localization={localization}
            editable={{
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  let url = apiUrl + 'orderSalePayment/' + oldData.id
                  console.log(newData)
                  axios.put(url, newData,{headers: {...authHeader()}})
                    .then(response => {
                      return response.data
                    })
                    .then(result => {
                      resolve()
                    })
                })
            }}
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 40, 60],
              selection: false,
              search: false,
              filtering: true
            }}
            columns={[
              {
                title: '# Venta',
                sorting: false,
                render: (rawData) => {
                  return <>{rawData.order_sale.order_code}</>
                }
              },
              {
                title: 'Fecha de cobranza',
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
                title: 'Estatus',
                field: 'order_sale_collection_status_id',
                lookup: collectionStatusesLookup,
                // defaultFilter: props.suppliers[0],
                filterComponent: (filterProps) => {
                  return (
                    <Autocomplete
                      // defaultValue={props.suppliers[0]}
                      options={props.collectionStatuses}
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
                title: 'Cantidad',
                field: 'amount',
                type: 'currency',
                editable: 'never'
              },
              {
                title: 'Cliente',
                sorting: false,
                render: (rawData) => {
                  return <>{rawData.order_sale.client.name}</>
                }
              }
            ]}
            data={query =>
              new Promise((resolve, reject) => {
                console.log(query)
                let url = apiUrl + 'orderSalePayment/list?'
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
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    collectionStatuses: state.sales.collectionStatuses,
  }
}

export default connect(mapStateToProps, null)(SalesCollectionDataTable)