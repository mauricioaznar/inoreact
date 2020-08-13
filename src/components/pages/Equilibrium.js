import React from 'react'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import axios from 'axios'

import moment from 'moment';
import 'moment/locale/es';

import {makeStyles, useTheme} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EstimatedExpensesTable from '../ui/EstimatedExpensesTable'
import SalesByMaterialTable from '../ui/SalesByMaterialTable'
import ExpensesByCatSubBraTable from '../ui/ExpensesByCatSubBraTable'
import ExpensesBySupSubTable from '../ui/ExpensesBySubSupTable'
import InvoicesBySupTable from '../ui/InvoicesBySupTable'
import ExpensesVsSalesChart from '../ui/ExpensesVsSalesChart'
import EquilibriumSummary from '../ui/EquilibriumSummary'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import useMediaQuery from '@material-ui/core/useMediaQuery'


const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '4em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})


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


export default function Equilibrium(props) {

  const [year, setYear] = React.useState(moment().year())
  const [month, setMonth] = React.useState(moment().month() + 1)

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  //check usages with ctl + v
  const expensesEstimation = useFetch(apiUrl + 'analytics/expensesEstimation?dateGroup=month')
  const sales = useFetch(apiUrl + 'analytics/sales?dateGroup=month&entityGroup=material')
  const expensesNoEstimatesByCatSubBra = useFetch(apiUrl + 'analytics/expenses?dateGroup=month&entityGroup=branch|expenseCategory|expenseSubcategory&noEstimates')
  const expensesBySupSub = useFetch(apiUrl + 'analytics/expenses?dateGroup=month&entityGroup=supplier|expenseCategory|expenseSubcategory')
  const invoicesBySup = useFetch(apiUrl + 'analytics/invoices?dateGroup=month&entityGroup=supplier')
  const otherIncomes = useFetch(apiUrl + 'analytics/otherIncomes')

  const handleYearChange = (e) => {
    console.log(e.target.value)
    setYear(e.target.value)
  }

  const handleMonthChange = (e) => {
    console.log(e.target.value)
    setMonth(e.target.value)
  }

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid item>
          <Typography variant={matchesXS ? 'h2' : 'h1'}>
            Punto de equilibrio
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction={matchesXS ? 'column' : 'row'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
        >
          <FormControl
            className={classes.formControl}
            fullWidth
          >
            <InputLabel id="demo-simple-select-label">Mes</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={month}
              onChange={(e) => {
                handleMonthChange(e)
              }}
            >
              <MenuItem value={1}>{moment().month(0).format('MMMM')}</MenuItem>
              <MenuItem value={2}>{moment().month(1).format('MMMM')}</MenuItem>
              <MenuItem value={3}>{moment().month(2).format('MMMM')}</MenuItem>
              <MenuItem value={4}>{moment().month(3).format('MMMM')}</MenuItem>
              <MenuItem value={5}>{moment().month(4).format('MMMM')}</MenuItem>
              <MenuItem value={6}>{moment().month(5).format('MMMM')}</MenuItem>
              <MenuItem value={7}>{moment().month(6).format('MMMM')}</MenuItem>
              <MenuItem value={8}>{moment().month(7).format('MMMM')}</MenuItem>
              <MenuItem value={9}>{moment().month(8).format('MMMM')}</MenuItem>
              <MenuItem value={10}>{moment().month(9).format('MMMM')}</MenuItem>
              <MenuItem value={11}>{moment().month(10).format('MMMM')}</MenuItem>
              <MenuItem value={12}>{moment().month(11).format('MMMM')}</MenuItem>

            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          style={{marginLeft: matchesXS ? 0 : '4em'}}
        >
          <FormControl
            className={classes.formControl}
            fullWidth
          >
            <InputLabel id="demo-simple-select-label">Año</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              onChange={(e) => {
                handleYearChange(e)
              }}
            >
              <MenuItem value={2019}>2019</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em'}}
      >

        <Grid
          item
          container
          direction={matchesXS ? 'column' : 'row'}
          alignItems={'center'}
          spacing={8}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
          >
            <Grid item container direction={'column'}>
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant={'h5'}
                  style={{marginBottom: '0.5em'}}
                >
                  Resumen
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <EquilibriumSummary
                  expensesEstimates={expensesEstimation}
                  expensesNoEstimates={expensesNoEstimatesByCatSubBra}
                  sales={sales}
                  otherIncomes={otherIncomes}
                  invoices={invoicesBySup}
                  month={month}
                  year={year}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={8}
          >
            <Grid item container direction={'column'}>
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant={'h6'}
                  align={'center'}
                  style={{marginBottom: '0.5em'}}
                >
                  Ventas vs gastos del año {moment().year(year).format('YYYY')}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <ExpensesVsSalesChart
                  year={year}
                  sales={sales}
                  expensesNoEstimates={expensesNoEstimatesByCatSubBra}
                  expensesEstimates={expensesEstimation}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >

        <Grid
          item
          xs={12}
        >
          <Typography
            variant={'h5'}
            style={{marginBottom: '0.5em'}}
          >
            Ventas
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <SalesByMaterialTable
            sales={sales}
            month={month}
            year={year}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}

      >
        <Grid
          item
          container
          direction={matchesXS ? 'column' : 'row'}
          spacing={8}
        >
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Grid container>
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant={'h5'}
                  style={{marginBottom: '0.5em'}}
                >
                  Gastos no estimados
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <ExpensesByCatSubBraTable
                  expenses={expensesNoEstimatesByCatSubBra}
                  sales={sales}
                  month={month}
                  year={year}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
          >
            <Grid container>
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant={'h5'}
                  style={{marginBottom: '0.5em'}}
                >
                  Gastos estimados
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <EstimatedExpensesTable
                  expensesEstimation={expensesEstimation}
                  month={month}
                  year={year}

                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >

        <Grid
          item
          xs={12}
        >
          <Typography
            variant={'h5'}
            style={{marginBottom: '0.5em'}}
          >
            Gastos por proveedor
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <ExpensesBySupSubTable
            expenses={expensesBySupSub}
            month={month}
            year={year}
          />
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >

        <Grid
          item
          xs={12}
        >
          <Typography
            variant={'h5'}
            style={{marginBottom: '0.5em'}}
          >
            Facturas por proveedor
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <InvoicesBySupTable
            invoices={invoicesBySup}
            month={month}
            year={year}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}