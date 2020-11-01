import React from 'react'
import {connect} from 'react-redux'

import Grid from '@material-ui/core/Grid'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise, subEntitiesPromises} from './common/common'
import SupplierForm from '../forms/SupplierForm'
import MauMaterialTable from './common/MauMaterialTable'
import MachineForm from '../forms/MachineForm'
import EquipmentForm from '../forms/EquipmentForm'
import EquipmentTransactionForm from '../forms/EquipmentTransactionForm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function EquipmentTransactionDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'equipmentTransaction'

  const columns = [
    {
      title: 'Nombre',
      field: 'description',
      type: 'text'
    },
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (equipment, callback) => {
    mainEntityPromise(equipment, entityPath)
      .then(result => {
        let equipmentId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: equipment.defaultValues.equipment_transaction_items,
            subEntities: equipment.equipment_transaction_items,
            path: 'equipmentTransactionItem'
          }
        ]
        const mainEntityConf = {
          'equipment_transaction_id': equipmentId
        }
        return Promise.all(subEntitiesPromises(subEntitiesConfs, mainEntityConf))
      })
      .then(result => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
      })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + entityPath + '/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    return Promise.all(promises).then(results => {
      return new Promise((resolve, reject) => {
        resolve()
      })
    })
  }


  return (
    <>
      <Grid
        container
        direction={'column'}
      >
        <Grid
          item
          xs={12}
          style={{marginTop: '2em'}}
        >
          <MauMaterialTable
            tableRef={tableRef}
            title="Transacciones de refacciones"
            entityPath={entityPath}
            onRowAdd={(event, rowData) => {
              setRowData(null)
              setOpen(true)
            }}
            onRowEdit={(event, rowData) => {
              setRowData(rowData)
              setOpen(true)
            }}
            columns={columns}



          />
        </Grid>
      </Grid>
      <Dialog
        maxWidth={!matchesXS ? 'lg' : null}
        fullWidth={!matchesXS || null}
        open={open}
        fullScreen={matchesXS}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <EquipmentTransactionForm equipmentTransaction={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentTransactionDataTable)