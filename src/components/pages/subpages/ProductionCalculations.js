import React from 'react'
import Grid from '@material-ui/core/Grid'
import ProductionsByMatMacTable from '../../ui/ProductionsByMatMacTable'
import EmployeePerformanceTable from '../../ui/EmployeePerformanceTable'
import moment from 'moment'
import {dateFormat} from '../../../helpers/dateFormat'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'

export default function ProductionCalculations(props) {

  let initialDate = moment('2019-01-01', dateFormat).format(dateFormat);

  const machineProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine&initialDate=' + initialDate)
  const employeeProductions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|employee&initialDate=' + initialDate)
  const employeePerformances = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=employee&initialDate=' + initialDate)

  return (
    <Grid
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