import React from 'react'
import Grid from '@material-ui/core/Grid'
import RequestsProductsTable from './tables/RequestsProductsTable'
import OrderRequestsDataTable from '../../ui/datatables/OrderRequestsDataTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function ProductionToProduce (props) {

  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')

  let loading = !requestProducts

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
            xs
            sm={8}
            md={6}
          >
            <RequestsProductsTable
              type={'materials'}
              requestProducts={requestProducts}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={8}
            md={6}
          >
            <RequestsProductsTable
              type={'extrusion'}
              requestProducts={requestProducts}
            />
          </Grid>
        </Grid>
  )
}