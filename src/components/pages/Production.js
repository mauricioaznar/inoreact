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
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import ExpenseForm from '../forms/ExpenseForm'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'

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

function Production(props) {

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

  const handleOnSubmit = (expense, callback) => {

    console.log(expense)

    if (expense.id) {
      let promises = []
      promises.push(axios.put(apiUrl + 'expense/' + expense.id, {...expense}, {headers: {...authHeader()}}))
      expense.expense_items.forEach(expenseItem => {
        if (expenseItem.id) {
          promises.push(axios.put(apiUrl + 'expenseItem/' + expenseItem.id, {...expenseItem}, {headers: {...authHeader()}}))
        }
      })
      Promise.all(promises).then(results => {
        console.log(results)
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
      })
    }
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
            editable={{
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {

                  setTimeout(() => {
                    resolve();
                  }, 1000);
                })
            }}
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 40, 60],
              selection: true
            }}
            actions={[
              {
                icon: (props) => <Edit {...props} color={'action'}
                                       fontSize={'small'}
                />,
                position: 'row',
                tooltip: 'Editar gasto',
                onClick: (event, rowData) => {
                  setRowData(rowData)
                  setOpen(true)
                }
              }
            ]}
            columns={[
              {
                title: 'Fecha de pago',
                field: 'date_paid',
                type: 'date',
                dateSetting: {locale: 'en-ca'},
                defaultSort: 'desc',
                editComponent: (props) => {
                  return (
                    <TextField
                      id="date"
                      type="date"
                      value={props.value}
                      onChange={e => props.onChange(e.target.value)}
                    />
                  )
                }
              },
              {
                title: 'Proveedor',
                field: 'supplier_id',
                lookup: props.suppliers
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
                let url = apiUrl + 'expense/list?'
                url += 'per_page=' + query.pageSize
                url += '&page=' + (query.page + 1)
                if (query.orderBy) {
                  url += '&sort=' + query.orderBy.field + '|' + query.orderDirection
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
    suppliers: state.expenses.suppliers
      .reduce((prevObject, supplier) => {
        return {...prevObject, [supplier.id]: supplier.name}
      }, {})
  }
}

export default connect(mapStateToProps, null)(Production)