import React from 'react'
import Grid from '@material-ui/core/Grid'
import ProductionByProductTypeTable from '../../ui/ProductionByProductTypeTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import moment from 'moment'
import {dateFormat} from '../../../helpers/dateFormat'

export default function ProductionSummary (props) {

  const daysBack = 30

  let initialDate = moment().subtract(daysBack, 'days').format(dateFormat);

  const materialProductions = useFetch(apiUrl + 'analytics/production?dateGroup=day&entityGroup=material|branch&initialDate=' + initialDate)

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <ProductionByProductTypeTable
          productions={materialProductions}
          branchId={1}
          daysBack={daysBack}
        />
      </Grid>
      <Grid item>
        <ProductionByProductTypeTable
          productions={materialProductions}
          branchId={2}
          daysBack={daysBack}
        />
      </Grid>
    </Grid>
  )
}