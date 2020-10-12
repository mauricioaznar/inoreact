import React from 'react'
import ProductionDataTable from '../../ui/datatables/ProductionDataTable'
import Grid from '@material-ui/core/Grid'
import ProductDataTable from '../../ui/datatables/ProductDataTable'

export default function ProductionDataCapture (props) {
  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <ProductionDataTable/>
      </Grid>
      <Grid
        item
      >
        <ProductDataTable/>
      </Grid>
    </Grid>
  )
}