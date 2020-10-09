import React from 'react'
import Grid from '@material-ui/core/Grid'
import RequestsProductsTable from '../../ui/RequestsProductsTable'
import OrderRequestsDataTable from '../../ui/datatables/OrderRequestsDataTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'

export default function ProductionToProduce (props) {

  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <RequestsProductsTable
          type={'materials'}
          requestProducts={requestProducts}
        />
      </Grid>
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <RequestsProductsTable
          type={'extrusion'}
          requestProducts={requestProducts}
        />
      </Grid>
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <OrderRequestsDataTable/>
      </Grid>
      <Grid
        item
      >
        <RequestsProductsTable
          type={'products'}
          requestProducts={requestProducts}
        />
      </Grid>
    </Grid>
  )
}