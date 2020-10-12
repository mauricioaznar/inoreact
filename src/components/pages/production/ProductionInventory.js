import React from 'react'
import Grid from '@material-ui/core/Grid'
import InventoryTable from './tables/InventoryTable'
import useFetch from '../../../helpers/useFetch'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function ProductionInventory (props) {

  const inventory = useFetch(apiUrl + 'stats/inventory')

  let loading = !inventory

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
            <InventoryTable type={'material'} inventory={inventory} />
          </Grid>
          <Grid
            item
            xs
            sm={8}
            md={6}
          >
            <InventoryTable type={'product'} inventory={inventory}/>
          </Grid>
        </Grid>
  )
}