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
import formatNumber from '../../../helpers/formatNumber'

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
      title: 'Fecha emision',
      field: 'date_emitted',
      type: 'date'
    },
    {
      title: 'Fecha estimada de entrega',
      field: 'date_estimated_delivery',
      type: 'date'
    },
    {
      title: 'Nombre',
      field: 'description',
      type: 'text'
    },
    {
      title: 'Tipo de transaccion',
      field: 'equipment_transaction_type_id',
      type: 'options',
      options: props.equipmentTransactionTypes,
      optionLabel: 'name'
    },
    {
      title: 'Estado de transaccion',
      field: 'equipment_transaction_status_id',
      type: 'options',
      options: props.equipmentTransactionStatuses,
      optionLabel: 'name'
    },
    {
      title: 'Refacciones',
      type: 'entity',
      field: 'equipment_id',
      entity: 'equipmentTransactionItems',
      table: 'equipment_transaction_items',
      options: props.equipments,
      optionLabel: 'description'
    },
    {
      title: 'Cantidad',
      sorting: false,
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.equipment_transaction_items.map(equipmentTransactionItem => {
                return (
                  <li key={`${equipmentTransactionItem.equipment_id}${equipmentTransactionItem.machine_id}`} style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                    {formatNumber(equipmentTransactionItem.quantity)}
                  </li>
                )
              })
            }
          </ul>
        )
      },
    },
    {
      title: 'Maquinas',
      type: 'entity',
      field: 'machine_id',
      entity: 'equipmentTransactionItem',
      table: 'equipment_transaction_items',
      options: props.machines,
      optionLabel: 'name'
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
        if (props.setUpdates) {
          props.setUpdates(props.updates + 1)
        }
      })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + entityPath + '/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    oldData.equipment_transaction_items.forEach(equipmentTransactionItem => {
      promises.push(axios.put(apiUrl + 'equipmentTransactionItem/' + equipmentTransactionItem.id, {active: -1}, {headers: {...authHeader()}}))
    })
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
            onRowDelete={(oldData) => {
              return handleRowDelete(oldData)
            }}
            columns={columns}



          />
        </Grid>
      </Grid>
      <Dialog
        maxWidth
        fullWidth
        open={open}
        fullScreen
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
    equipmentTransactionTypes: state.maintenance.equipmentTransactionTypes,
    equipmentTransactionStatuses: state.maintenance.equipmentTransactionStatuses,
    machines: state.production.machines,
    equipments: state.maintenance.equipments
  }
}



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentTransactionDataTable)