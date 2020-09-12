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
import {localization, tableIcons, mainEntityPromise, subEntitiesPromises} from './common/common'
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

function OrderRequestsDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  let requestStatusesLookup = props.requestStatuses.reduce((acc, requestStatus) => {
    return {...acc, [requestStatus.id]: requestStatus.name}
  }, {})

  let clientsLookup = props.clients.reduce((acc, client) => {
    return {...acc, [client.id]: client.name}
  }, {})

  const columns = [
    {
      title: 'Fecha',
      field: 'date',
      type: 'date',
      dateSetting: {locale: 'en-ca'},
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['date'].value}
              onChange={(momentDate) => {
                handleFilters( 'date', momentDate !== null && momentDate.isValid() ?
                  momentDate.format('YYYY-MM-DD') : null)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Status',
      field: 'order_request_status_id',
      lookup: requestStatusesLookup,
      filterComponent: (filterProps) => {
        return (
          <Autocomplete
            options={props.requestStatuses}
            value={filters['order_request_status_id'].value}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              // TODO nomralize ---- pass id instead of data
              handleFilters( 'order_request_status_id', data)
            }}
          />
        )
      },
      editComponent: (editProps) => {
        return (
          <Autocomplete
            options={props.requestStatuses}
            value={editProps.value}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              editProps.onChange(data ? data.id : '')
            }}
          />
        )
      }
    },
    {
      title: 'Cliente',
      field: 'client_id',
      lookup: clientsLookup,
      editable: false,
      filterComponent: (filterProps) => {
        return (
          <Autocomplete
            options={props.clients}
            value={filters['client_id'].value}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              // TODO nomralize ---- pass id instead of data
              handleFilters( 'client_id', data)
            }}
          />
        )
      }
    },
    {
      title: 'Folio',
      field: 'order_code',
      filterComponent: (filterProps) => {
        return (
          <MaterialTableText
            focus={filters['order_code'].focus}
            value={filters['order_code'].value}
            onChange={(text) => {
              handleFilters('order_code', text)
            }}
          />
        )
      },
    },
    {
      title: 'Prioridad',
      field: 'priority',
      filterComponent: (filterProps) => {
        return (
          <MaterialTableText
            focus={filters['priority'].focus}
            value={filters['priority'].value}
            onChange={(text) => {
              handleFilters( 'priority', text)
            }}
          />
        )
      },
    }
  ]

  let storageFilters = localStorage.getItem('order_requests_filters') ?
    JSON.parse(localStorage.getItem('order_requests_filters')) : {}

  const [filters, setFilters] = React.useState(columns.reduce((acc, column) => {
    return {...acc, [column.field]: {
        value: storageFilters[column.field] ? storageFilters[column.field].value : (column.type === 'date' || column.lookup) ? null : '',
        type: column.type ? column.type : column.lookup ? 'lookup' : 'text',
        focus: false
      }}
  }, {}));

  const handleFilters = (field, value) => {
    const newFilters = {...filters}
    for(let filterKey in newFilters) {
      if (newFilters.hasOwnProperty(filterKey)) {
        newFilters[filterKey].focus = false
      }
    }
    const foundFilter = newFilters[field]
    foundFilter.value = value
    foundFilter.focus = true
    setFilters(newFilters)
    tableRef.current && tableRef.current.onQueryChange()
  }


  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + 'orderRequest/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
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
              },
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  let url = apiUrl + 'orderRequest/' + oldData.id
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
              pageSize: 10,
              pageSizeOptions: [10, 20, 30],
              selection: false,
              search: false,
              filtering: true
            }}
            columns={columns}
            data={query =>
              new Promise((resolve, reject) => {
                let url = apiUrl + 'orderRequest/list?'
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
                    localStorage.setItem('order_requests_filters', JSON.stringify(filters))
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
    requestStatuses: state.sales.requestStatuses,
    clients: state.sales.clients
  }
}

export default connect(mapStateToProps, null)(OrderRequestsDataTable)