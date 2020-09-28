import React, {forwardRef} from 'react'
import AddBox from '@material-ui/icons/AddBox'
import Check from '@material-ui/icons/Check'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Edit from '@material-ui/icons/Edit'
import SaveAlt from '@material-ui/icons/SaveAlt'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import Search from '@material-ui/icons/Search'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Remove from '@material-ui/icons/Remove'
import ViewColumn from '@material-ui/icons/ViewColumn'
import apiUrl from '../../../../helpers/apiUrl'
import authHeader from '../../../../helpers/authHeader'
import axios from 'axios'

export const tableIcons = {
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

export const mainEntityPromise = (mainEntity, path) => {
  let mainEntityPromise
  if (mainEntity.id) {
    mainEntityPromise = axios.put(apiUrl  + path + '/' + mainEntity.id, {...mainEntity}, {headers: {...authHeader()}})
  } else {
    mainEntityPromise = axios.post(apiUrl + path, {...mainEntity}, {headers: {...authHeader()}})
  }
  return mainEntityPromise
}

export const subEntitiesPromises = (subEntitiesConfs, mainEntityConf) => {
  const promises = []
  subEntitiesConfs.forEach(subEntityConf => {
    const {subEntities, initialSubEntities, path} = subEntityConf
    let deletedSubEntities = initialSubEntities.filter(subEntity => subEntity.id)
    subEntities.forEach(subEntity => {
      if (subEntity.id !== '') {
        promises.push(axios.put(apiUrl + path + '/' + subEntity.id, {...subEntity}, {headers: {...authHeader()}}))
        deletedSubEntities = deletedSubEntities.filter(initialSubEntity => {
          return String(initialSubEntity.id) !== subEntity.id
        })
      } else {
        promises.push(axios.post(apiUrl + path, {...subEntity, ...mainEntityConf}, {headers: {...authHeader()}}))
      }
    })
    deletedSubEntities.forEach(initialSubEntity => {
      promises.push(axios.put(apiUrl + path + '/' + initialSubEntity.id, {active: -1}, {headers: {...authHeader()}}))
    })
  })
  return promises
}

export const localization = {
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
}