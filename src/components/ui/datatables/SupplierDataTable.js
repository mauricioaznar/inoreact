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
import {getSuppliers} from '../../../store/expensesActions'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function UserDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'supplier'

  const columns = [
    {
      title: 'Nombre',
      field: 'name',
      type: 'text'
    },
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (supplier, callback) => {
    mainEntityPromise(supplier, entityPath)
      .then(result => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
        props.getSuppliers()
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
            title="Proveedores"
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
         <SupplierForm supplier={rowData} onSubmit={handleOnSubmit} />
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
    getSuppliers: () => {
      dispatch(getSuppliers())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDataTable)