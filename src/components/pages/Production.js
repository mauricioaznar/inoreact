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
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import MaterialTable from 'material-table'
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
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


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useFetch = (url) => {
  const [data, setData] = React.useState(null);

  // empty array as second argument equivalent to componentDidMount
  React.useEffect(() => {
    let unmounted = false

    async function fetchData() {
      const response = await axios.get(url, {headers: {...authHeader()}});
      if (!unmounted) {
        setData(response.data.data)
      }
    }

    if (!unmounted) {
      fetchData();
    }
    return () => {
      unmounted = true
    };
  }, [url]);

  return data;
};

function getWeekRange(week = 0, content) {
  let currentStart = moment().add(week, 'weeks').startOf('week');
  let endWeek = moment().startOf('week')
  let weeks = []

  while (currentStart.isBefore(endWeek, '[]')) {
    weeks.push({
      first_day_of_the_week: currentStart.startOf('week').format(dateFormat),
      last_day_of_the_week: currentStart.endOf('week').format(dateFormat),
      current_week_number: '#' + currentStart.week() + ' ' + currentStart.format('YYYY-MM'),
      week: currentStart.startOf('week').format(dateFormat) + ' ' + currentStart.endOf('week').format(dateFormat),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}

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

  const theme = useTheme()

  console.log(props)

  return (
    <Grid
      xs={12}
      container
      direction={'column'}
    >
      <Grid
        item
        className={classes.rowContainer}
        style={{marginTop: '2em'}}
      >
        <MaterialTable
          icons={tableIcons}
          title="POPIS"

          editable={{
            onBulkUpdate: changes =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  /* setData([...data, newData]); */
                  console.log('Bulk update')
                  console.log(changes)
                  resolve();
                }, 1000);
              }),
            onRowAddCancelled: rowData => console.log('Row adding cancelled'),
            onRowUpdateCancelled: rowData => console.log('Row editing cancelled'),
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                console.log(newData)
                setTimeout(() => {
                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {

                setTimeout(() => {
                  resolve();
                }, 1000);
              })
          }}

          options={{
            pageSize: 25,
            pageSizeOptions: [25, 40, 60]
          }}
          columns={[
            {
              title: 'Fecha de pago',
              field: 'date_paid',
              type: 'date',
              dateSetting: { locale: 'en-ca' },
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
              console.log(query)
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
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    productTypes: state.production.productTypes,
    suppliers: state.expenses.suppliers
      .reduce((prevObject, supplier)=> {
        return {...prevObject, [supplier.id]: supplier.name}
      }, {})
  }
}

export default connect(mapStateToProps, null)(Production)