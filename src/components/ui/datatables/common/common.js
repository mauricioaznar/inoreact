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