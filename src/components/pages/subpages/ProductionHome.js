import React from 'react'
import ProductionDataTable from '../../ui/datatables/ProductionDataTable'
import Grid from '@material-ui/core/Grid'

export default function ProductionHome (props) {
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
    </Grid>
  )
}