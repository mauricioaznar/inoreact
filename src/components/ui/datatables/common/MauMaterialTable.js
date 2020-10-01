import React from 'react'
import {localization, tableIcons} from './common'
import Edit from '@material-ui/icons/Edit'
import AddBox from '@material-ui/icons/AddBox'
import apiUrl from '../../../../helpers/apiUrl'
import moment from 'moment'
import axios from 'axios'
import authHeader from '../../../../helpers/authHeader'
import MaterialTable from 'material-table'
import MaterialTableDate from './MaterialTableDate'
import MaterialTableText from './MaterialTableText'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'


const dateFormat = 'YYYY-MM-DD'

export default function MauMaterialTable (props) {

  const tableRef = props.tableRef;

  const entityPath = props.entityPath

  const localStorageFiltersName = entityPath + 'Filters'

  let columns = props.columns.map(column => {

    let newColumn = {...column}

    if (newColumn.type === 'date' || newColumn.type === 'date_time') {

      return {
        ...newColumn,
        filterComponent: (filterProps) => {
          return (
            <>
              <MaterialTableDate
                value={filters[newColumn.field].value}
                onChange={(momentDate) => {
                  handleFilters( newColumn.field, momentDate)
                }}
              />
            </>
          )
        }
      }

    } else if (newColumn.type === 'options') {

      const lookup = newColumn.options.reduce((acc, option) => {
        return {...acc, [option.id]: option[newColumn.optionLabel]}
      }, {})

      return {
        ...newColumn,
        lookup,
        filterComponent: (filterProps) => {
          return (
            <Autocomplete
              options={newColumn.options}
              value={filters[newColumn.field].value}
              getOptionLabel={option => {
                return option[newColumn.optionLabel]
              }}
              renderInput={params => (
                <TextField
                  {...params}
                />
              )}
              onChange={(e, data) => {
                handleFilters( newColumn.field, data)
              }}
            />
          )
        }
      }

    } else {

      return {
        ...newColumn,
        filterComponent: (filterProps) => {
          return (
            <MaterialTableText
              focus={filters[newColumn.field].focus}
              value={filters[newColumn.field].value}
              onChange={(text) => {
                handleFilters( newColumn.field, text)
              }}
            />
          )
        }
      }

    }

  })


  let storageFilters = localStorage.getItem(localStorageFiltersName) ?
    JSON.parse(localStorage.getItem(localStorageFiltersName)) : {}

  const [filters, setFilters] = React.useState(columns.reduce((acc, column) => {
    return {...acc, [column.field]: {
        value: storageFilters[column.field] ? storageFilters[column.field].value
          : (column.type === 'date' || column.type === 'date_time' || column.lookup) ? null : '',
        type: column.type ? column.type : column.lookup ? 'options' : 'text',
        focus: false
      }}
  }, {}));

  let editable = {}

  if (props.onRowDelete) {
    editable.onRowDelete = props.onRowDelete
  }

  let actions = []

  if (props.onRowEdit) {
    actions.push(        {
      icon: (props) => <Edit {...props} color={'action'} fontSize={'small'} />,
      position: 'row',
      tooltip: 'Editar',
      onClick: props.onRowEdit
    })
  }

  if (props.onRowAdd) {
    actions.push(              {
      icon: (props) => <AddBox {...props} color={'action'} fontSize={'small'} />,
      tooltip: 'Agregar',
      isFreeAction: true,
      onClick: props.onRowAdd
    })
  }

  const handleFilters = (field, value) => {
    const newFilters = {...filters}
    const foundFilter = newFilters[field]
    foundFilter.value = value
    foundFilter.focus = true
    setFilters(newFilters)
    tableRef.current && tableRef.current.onQueryChange()
  }


  return (
    <MaterialTable
      icons={tableIcons}
      title={props.title}
      tableRef={tableRef}
      localization={localization}
      editable={editable}
      options={{
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        selection: false,
        search: false,
        filtering: true
      }}
      actions={actions}
      columns={columns}
      data={query =>
        new Promise((resolve, reject) => {
          let url = apiUrl + entityPath + '/list?'
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
              } else if (filter.type === 'options' && filter.value !== null) {
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
              localStorage.setItem(localStorageFiltersName, JSON.stringify(filters))
              resolve({
                data: result.data,
                page: result.links.pagination.current_page - 1,
                totalCount: result.links.pagination.total,
              })
            })
        })
      }
    />
  )
}