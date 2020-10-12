import React from 'react'
import Grid from '@material-ui/core/Grid'
import ProductionsByMatMacTable from './tables/ProductionsByMatMacTable'
import EmployeePerformanceTable from './tables/EmployeePerformanceTable'
import moment from 'moment'
import {dateFormat} from '../../../helpers/dateFormat'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function ProductionCalculations(props) {

  let initialDate = moment('2019-01-01', dateFormat).format(dateFormat);

  const machineProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine&initialDate=' + initialDate)
  const employeeProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|employee&initialDate=' + initialDate)
  const employeePerformances = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=employee&initialDate=' + initialDate)

  let loading = !machineProductions || !employeeProductions || !employeePerformances

  return (
    loading
      ? <CircularProgress size={40} style={{marginLeft: '.5em'}}/>
      : <Grid
          container
          direction={'column'}
        >
          <Grid
            item
            style={{marginBottom: '3em'}}
          >
            <ProductionsByMatMacTable
              machineProductions={machineProductions}
              employeeProductions={employeeProductions}
            />
          </Grid>
          <Grid
            item
          >
            <EmployeePerformanceTable employeePerformances={employeePerformances}/>
          </Grid>
        </Grid>
  )
}