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
import ProductionForm from '../forms/ProductionForm'

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

function ProductionDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  let productionTypesLookup = props.orderProductionTypes.reduce((acc, productionType) => {
    return {...acc, [productionType.id]: productionType.name}
  }, {})

  const columns = [
    {
      title: 'Fecha de inicio',
      field: 'start_date_time',
      type: 'date_time',
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['start_date_time'].value}
              onChange={(momentDate) => {
                handleFilters( 'start_date_time', momentDate)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Fecha de fin',
      field: 'end_date_time',
      type: 'date_time',
      filterComponent: (filterProps) => {
        return (
          <>
            <MaterialTableDate
              value={filters['end_date_time'].value}
              onChange={(momentDate) => {
                handleFilters( 'end_date_time', momentDate)
              }}
            />
          </>
        )
      }
    },
    {
      title: 'Tipo de produccion',
      field: 'order_production_type_id',
      lookup: productionTypesLookup,
      filterComponent: (filterProps) => {
        return (
          <Autocomplete
            options={props.orderProductionTypes}
            value={filters['order_production_type_id'].value}
            getOptionLabel={option => {
              return option['name']
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              handleFilters( 'order_production_type_id', data)
            }}
          />
        )
      }
    },
  ]

  let storageFilters = localStorage.getItem('order_production_filters') ?
    JSON.parse(localStorage.getItem('order_production_filters')) : {}

  const [filters, setFilters] = React.useState(columns.reduce((acc, column) => {
      return {...acc, [column.field]: {
          value: storageFilters[column.field] ? storageFilters[column.field].value
            : (column.type === 'date' || column.type === 'date_time' || column.lookup) ? null : '',
          type: column.type ? column.type : column.lookup ? 'lookup' : 'text',
          focus: false
        }}
    }, {}));

  const handleFilters = (field, value) => {
    const newFilters = {...filters}
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
    let expensePromise = mainEntityPromise(expense, 'expense')
    expensePromise.then(results => {
      callback(true)
      tableRef.current && tableRef.current.onQueryChange()
      setOpen(false)
    }).finally(() => {
      props.setUpdates(props.updates + 1)
    })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + 'orderProduction/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
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
            title="Produccion"
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
                let url = apiUrl + 'orderProduction/list?'
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
                    if ((filter.type === 'date' || filter.type === 'date_time') && filter.value !== null) {
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
                    localStorage.setItem('order_production_filters', JSON.stringify(filters))
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
         <ProductionForm production={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    productTypes: state.production.productTypes,
    orderProductionTypes: state.production.orderProductionTypes
  }
}

export default connect(mapStateToProps, null)(ProductionDataTable)