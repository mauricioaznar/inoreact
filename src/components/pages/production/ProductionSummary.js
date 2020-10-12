import React from 'react'
import Grid from '@material-ui/core/Grid'
import ProductionByProductTypeTable from './tables/ProductionByProductTypeTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import moment from 'moment'
import {dateFormat} from '../../../helpers/dateFormat'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

export default function ProductionSummary(props) {

  const daysBack = 30

  let initialDate = moment().subtract(daysBack, 'days').format(dateFormat);

  const materialProductions = useFetch(apiUrl + 'analytics/production?dateGroup=day&entityGroup=material|branch&initialDate=' + initialDate)

  let loading = !materialProductions

  return (
    loading
      ? <CircularProgress
        size={40}
        style={{marginLeft: '.5em'}}
      />
      : <Grid
        container
        direction={'column'}
      >
          <Grid
            item
            style={{marginBottom: '1em'}}
          >
            <Typography
              variant={'h4'}
            >
              Bolseo en Caucel
            </Typography>
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={10}
          >
            <ProductionByProductTypeTable
              productions={materialProductions}
              branchId={1}
              productTypeId={1}
              daysBack={daysBack}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '1em'}}
          >
            <Typography
              variant={'h4'}
            >
              Extrusión en Caucel
            </Typography>
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={10}
          >
            <ProductionByProductTypeTable
              productions={materialProductions}
              branchId={1}
              productTypeId={2}
              daysBack={daysBack}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '1em'}}
          >
            <Typography
              variant={'h4'}
            >
              Bolseo en Baca
            </Typography>
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={10}
          >
            <ProductionByProductTypeTable
              productions={materialProductions}
              branchId={2}
              productTypeId={1}
              daysBack={daysBack}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '1em'}}
          >
            <Typography
              variant={'h4'}
            >
              Extrusión en Baca
            </Typography>
          </Grid>
          <Grid item>
            <ProductionByProductTypeTable
              productions={materialProductions}
              branchId={2}
              productTypeId={2}
              daysBack={daysBack}
            />
          </Grid>
        </Grid>
  )
}