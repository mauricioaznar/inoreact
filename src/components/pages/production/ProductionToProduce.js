import React from 'react'
import Grid from '@material-ui/core/Grid'
import RequestsProductsTable from './tables/RequestsProductsTable'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function ProductionToProduce (props) {

  const requestProducts = useFetch(apiUrl + 'stats/requestProducts')
  const inventory = useFetch(apiUrl + 'stats/inventory')

  let loading = !requestProducts || !inventory

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
            sm={12}
            md={6}
          >
            <RequestsProductsTable
              type={'materials'}
              requestProducts={requestProducts}
              inventory={inventory}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={12}
            md={6}
          >
            <RequestsProductsTable
              type={'extrusion'}
              requestProducts={requestProducts}
              inventory={inventory}
            />
          </Grid>
          <Grid
            item
            style={{marginBottom: '3em'}}
            xs
            sm={12}
            md={12}
          >
            <RequestsProductsTable
              requestProducts={requestProducts}
              inventory={inventory}
            />
          </Grid>
        </Grid>
  )
}