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
import {tableIcons, mainEntityPromise, subEntitiesPromises} from './common/common'
import ProductionForm from '../forms/ProductionForm'
import MauMaterialTable from './common/MauMaterialTable'
import ProductionEventForm from '../forms/ProductionEventForm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});





//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ProductionDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const entityPath = 'productionEvent'

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const columns = [
    {
      title: 'Fecha de inicio',
      field: 'start_date_time',
      type: 'date_time'
    },
    {
      title: 'Fecha de fin',
      field: 'end_date_time',
      type: 'date_time'
    },
    {
      title: 'Maquina',
      field: 'machine_id',
      type: 'options',
      options: props.machines,
      optionLabel: 'name'
    },
    {
      title: 'Empleado que reporto',
      field: 'report_employee_id',
      type: 'options',
      options: props.employees,
      optionLabel: 'fullname'
    },
    {
      title: 'Empleado que reparo',
      field: 'maintenance_employee_id',
      type: 'options',
      options: props.employees,
      optionLabel: 'fullname'
    },
    {
      title: 'Eventos',
      sorting: false,
      render: (rawData) => {
        let events = rawData.production_e_production_ets
          .map((productionEProductionEt) => {
            let productionEventTypeFound = props.productionEventTypes
              .find(productionEventType => productionEventType.id === productionEProductionEt.production_event_type_id)
            return productionEventTypeFound ? productionEventTypeFound.name : ''
          })
          .join(', ')
        return <>{events}</>
      }
    },
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (production, callback) => {
    let productionPromise = mainEntityPromise(production, entityPath)
    productionPromise
      .then(result => {
        let productionId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: production.defaultValues.production_e_production_ets,
            subEntities: production.production_e_production_ets,
            path: 'productionEProductionEt'
          }
        ]
        const mainEntityConf = {
          'production_event_id': productionId
        }
        let productionSubEntitiesPromises = subEntitiesPromises(subEntitiesConfs, mainEntityConf)
        return Promise.all(productionSubEntitiesPromises)
      })
      .then(results => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
      })
      .finally(() => {
        if (props.setUpdates) {
          props.setUpdates(props.updates + 1)
        }
      })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + entityPath + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    return Promise.all(promises).then(results => {
      return new Promise((resolve, reject) => {
        props.setUpdates(props.updates + 1)
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
            icons={tableIcons}
            entityPath={entityPath}
            title="Reportes de mantenimiento"
            onRowDelete={(oldData) => {
              return handleRowDelete(oldData)
            }}
            onRowAdd={(event, rowData) => {
              setRowData(rowData)
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
        fullWidth
        open={open}
        fullScreen
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <ProductionEventForm productionEvent={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    employees: state.general.employees,
    productTypes: state.production.productTypes,
    productionEventTypes: state.maintenance.productionEventTypes
  }
}

export default connect(mapStateToProps, null)(ProductionDataTable)