import React from 'react'
import Grid from '@material-ui/core/Grid'
import InventoryTable from '../../ui/InventoryTable'

export default function ProductionInventory (props) {
  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        style={{marginBottom: '3em'}}
      >
        <InventoryTable type={'material'}/>
      </Grid>
      <Grid item>
        <InventoryTable type={'product'}/>
      </Grid>
    </Grid>
  )
}