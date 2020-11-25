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
import {mainEntityPromise} from './common/common'
import SupplierForm from '../forms/SupplierForm'
import MauMaterialTable from './common/MauMaterialTable'
import MachineForm from '../forms/MachineForm'
import EquipmentForm from '../forms/EquipmentForm'
import {getEquipments} from '../../../store/maintenanceActions'
import formatNumber from '../../../helpers/formatNumber'
import imageUrl from '../../../helpers/imageUrl'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function EquipmentDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'equipment'

  const columns = [
    {
      title: 'Nombre',
      field: 'description',
      type: 'text'
    },
    {
      title: 'Categoria',
      field: 'equipment_category_id',
      type: 'options',
      options: props.equipmentCategories,
      optionLabel: 'name'
    },
    {
      title: 'Subcategoria',
      field: 'equipment_subcategory_id',
      type: 'options',
      options: props.equipmentSubcategories,
      optionLabel: 'name'
    },
    {
      title: 'Kilos',
      sorting: false,
      render: (rowData) => {
        return (
          <img style={{height: '50px', width: '50px'}} src={imageUrl + 'equipments/' + rowData.id + '.jpg'} alt={'Imagen no disponible'}/>
        )
      }
    }
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
        const bodyFormData = new FormData()
        bodyFormData.append('photo', equipment.photo[0])
        bodyFormData.append('id', result.data.data.id)
        return axios.post(apiUrl + entityPath + '/image', bodyFormData, {headers: {...authHeader(), 'Content-Type': 'multipart/form-data'}})
      })
      .then(result => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
        if (props.setUpdates) {
          props.setUpdates(props.updates + 1)
        }
        props.getEquipments()
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
            title="Refacciones"
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
        <EquipmentForm equipment={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    equipmentSubcategories: state.maintenance.equipmentSubcategories,
    equipmentCategories: state.maintenance.equipmentCategories,
  }
}



const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getEquipments: () => {
      dispatch(getEquipments())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentDataTable)