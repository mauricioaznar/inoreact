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
import useFetch from '../../helpers/useFetch'
import MauMonthYear from '../ui/inputs/MauMonthYear'


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


export default function Equilibrium(props) {

  const [year, setYear] = React.useState(moment().year())
  const [month, setMonth] = React.useState(moment().month())

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))

  //check usages with ctl + v
  const expensesEstimation = useFetch(apiUrl + 'analytics/expensesEstimation?dateGroup=month')
  const sales = useFetch(apiUrl + 'analytics/sales?dateGroup=month&entityGroup=material')
  const expensesNoEstimatesByCatSubBra = useFetch(apiUrl + 'analytics/expenses?dateGroup=month&entityGroup=branch|expenseCategory|expenseSubcategory&noEstimates')
  const expensesBySupSub = useFetch(apiUrl + 'analytics/expenses?dateGroup=month&entityGroup=supplier|expenseCategory|expenseSubcategory')
  const invoicesBySup = useFetch(apiUrl + 'analytics/invoices?dateGroup=day&entityGroup=supplier')
  const otherIncomes = useFetch(apiUrl + 'analytics/otherIncomes')


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
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <MauMonthYear
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
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
          alignItems={'flex-start'}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={4}
          >
            <Grid
              item
              container
              direction={'column'}
            >
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant={'h6'}
                  style={{marginBottom: '1.5em'}}
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
            md={12}
            lg={8}
          >
            <Grid
              item
              container
              direction={'column'}
            >
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
        >
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              paddingRight: '1em',
              paddingLeft: '1em'
            }}
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
                  Gastos reales
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
            style={{
              paddingRight: '1em',
              paddingLeft: '1em'
            }}
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
        <InvoicesBySupTable
          invoices={invoicesBySup}
          month={month}
          year={year}
        />
      </Grid>
    </Grid>
  )
}