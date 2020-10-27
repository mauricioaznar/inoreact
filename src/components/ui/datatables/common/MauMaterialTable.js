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
                value={filters[newColumn.field + newColumn.title] ? filters[newColumn.field + newColumn.title].value : null}
                onChange={(momentDate) => {
                  handleFilters( newColumn.field + newColumn.title, momentDate)
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

          let selectedOption = null

          if (filters[newColumn.field + newColumn.title] && filters[newColumn.field + newColumn.title].value) {
            selectedOption = newColumn.options.find(option => {
              return option.id === filters[newColumn.field + newColumn.title].value
            })
          }

          return (
            <Autocomplete
              options={newColumn.options}
              value={selectedOption}
              getOptionLabel={option => {
                return option[newColumn.optionLabel]
              }}
              renderInput={params => (
                <TextField
                  {...params}
                />
              )}
              onChange={(e, data) => {
                handleFilters( newColumn.field + newColumn.title, data ? data.id : null)
              }}
            />
          )
        }
      }

    } else if (newColumn.type === 'entity' && newColumn.options) {

    return {
      ...newColumn,
      customFilterAndSearch: () => { return true },
      filterComponent: (filterProps) => {

        let selectedOption = null

        if (filters[newColumn.field + newColumn.title] && filters[newColumn.field + newColumn.title].value) {
          selectedOption = newColumn.options.find(option => {
            return option.id === filters[newColumn.field + newColumn.title].value
          })
        }

        return (
          <Autocomplete
            options={newColumn.options}
            value={selectedOption}
            getOptionLabel={option => {
              return option[newColumn.optionLabel]
            }}
            renderInput={params => (
              <TextField
                {...params}
              />
            )}
            onChange={(e, data) => {
              handleFilters( newColumn.field + newColumn.title, data ? data.id : null)
            }}
          />
        )
      },
      render: (rowData) => {

        if (newColumn.single) {
          let option = newColumn.options.find(option => option.id === rowData[newColumn.table][newColumn.field])
          return option[newColumn.optionLabel]
        } else {
          return (
            <ul>
            {
              rowData[newColumn.table].map(entity => {
                let option = newColumn.options.find(option => option.id === entity[newColumn.field])
                return (
                  <li key={entity.id} style={{whiteSpace: 'nowrap'}}>
                    {option[newColumn.optionLabel]}
                  </li>
                )
              })
            }
          </ul>
          )
        }

      }
    }

    } else if (newColumn.type === 'entity' && !newColumn.options) {

      return {
        ...newColumn,
        filterComponent: (filterProps) => {
          return (
            <MaterialTableText
              focus={filters[newColumn.field + newColumn.title] ? filters[newColumn.field + newColumn.title].focus : false}
              value={filters[newColumn.field + newColumn.title] ? filters[newColumn.field + newColumn.title].value : null}
              onChange={(text) => {
                handleFilters( newColumn.field + newColumn.title, text)
              }}
            />
          )
        },
        render: (rowData) => {
          return rowData[newColumn.table][newColumn.field]
        }
      }

    } else if (newColumn.type === 'text') {

      return {
        ...newColumn,
        filterComponent: (filterProps) => {
          return (
            <MaterialTableText
              focus={filters[newColumn.field + newColumn.title] ? filters[newColumn.field + newColumn.title].focus : null}
              value={filters[newColumn.field + newColumn.title] ? filters[newColumn.field + newColumn.title].value : null}
              onChange={(text) => {
                handleFilters( newColumn.field + newColumn.title, text)
              }}
            />
          )
        }
      }

    } else {

        return {
          ...newColumn
        }

    }

  })


  let storageFilters = localStorage.getItem(localStorageFiltersName) ?
    JSON.parse(localStorage.getItem(localStorageFiltersName)) : {}

  const [filters, setFilters] = React.useState(columns.reduce((acc, column) => {

    let filter = {}

    if (column.field && column.title) {
      filter[column.field + column.title] =  {
        value: storageFilters[column.field + column.title] ? storageFilters[column.field + column.title].value
          : (
            column.type === 'date'
            || column.type === 'date_time'
            || column.type === 'options'
            || column.type === 'entity'
          ) ? null : '',
          type: column.type,
          field: column.field,
          entity: column.type === 'entity' ? column.entity : '',
          focus: false,
          exact: column.exact ? true : false
      }
    }

    return {...acc, ...filter}
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

  if (props.actions) {
    actions = actions.concat(props.actions)
  }

  const handleFilters = (name, value) => {
    const newFilters = {...filters}
    for (let name in newFilters) {
      if (newFilters.hasOwnProperty(name)) {
        newFilters[name].focus = false
      }
    }
    const foundFilter = newFilters[name]
    if (foundFilter) {
      foundFilter.value = value
      foundFilter.focus = true
      setFilters(newFilters)
      tableRef.current && tableRef.current.onQueryChange()
    }
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
          let entities = 1
          let index = 1
          for (let name in filters) {
            if (filters.hasOwnProperty(name)) {
              let filter = filters[name]
              let field = filter.field
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
                url += `&filter_exact_value_${exacts}=${filter.value}`
                exacts++
              } else if (filter.type === 'entity' && filter.value !== null && filter.value !== '') {
                url += `&filter_entity_property_${entities}=${field}`
                url += `&filter_entity_value_${entities}=${filter.value}`
                url += `&filter_entity_${entities}=${filter.entity}`
                entities++
              } else if (filter.type === 'text' && !filter.exact && filter.value !== '') {
                url += `&filter_like_${likes}=${field}`
                url += `&filter_like_value_${likes}=${filter.value}`
                likes++
              } else if (filter.type === 'text' && filter.exact && filter.value !== '') {
                url += `&filter_exact_${exacts}=${field}`
                url += `&filter_exact_value_${exacts}=${filter.value}`
                exacts++
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