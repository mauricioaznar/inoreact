import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ProductionEventsDataTable from '../ui/datatables/ProductionEventsDataTable'
import MachineDataTable from '../ui/datatables/MachineDataTable'
import EquipmentDataTable from '../ui/datatables/EquipmentDataTable'
import EquipmentTransactionDataTable
  from '../ui/datatables/EquipmentTransactionDataTable'
import useFetch from '../../helpers/useFetch'
import apiUrl from '../../helpers/apiUrl'
import EquipmentInventory from './maintenance/EquipmentInventory'

const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '4em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

export default function Maintenance (props) {

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))

  const [transactionUpdates, setTransactionUpdates] = React.useState(0)
  const [machineUpdates, setMachineUpdates] = React.useState(0)
  const [equipmentUpdates, setEquipmentUpdates] = React.useState(0)

  const equipmentInventory = useFetch(apiUrl + 'stats/equipmentInventory', [transactionUpdates, machineUpdates, equipmentUpdates])

  console.log(equipmentInventory)

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid item>
          <Typography variant={matchesXS ? 'h2' : 'h1'}>
            Mantenimiento
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Grid item xs>
          <ProductionEventsDataTable />
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Grid item xs>
          <MachineDataTable updates={machineUpdates} setUpdates={setMachineUpdates} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Grid item xs>
          <EquipmentDataTable updates={equipmentUpdates} setUpdates={setEquipmentUpdates} />
        </Grid>
      </Grid>
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '2em', marginBottom: '2em'}}
      >
        <Grid item xs>
          <EquipmentTransactionDataTable updates={transactionUpdates} setUpdates={setTransactionUpdates}/>
        </Grid>
      </Grid>
            <Grid
              item
              container
              className={classes.rowContainer}
              style={{marginTop: '2em', marginBottom: '2em'}}
            >
        <Grid item xs>
          <EquipmentInventory equipmentInventory={equipmentInventory} />
        </Grid>
      </Grid>
    </Grid>
  )
}