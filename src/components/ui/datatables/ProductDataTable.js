import React from 'react'
import {connect} from 'react-redux'


import Grid from '@material-ui/core/Grid'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise} from './common/common'
import MauMaterialTable from './common/MauMaterialTable'
import ProductForm from '../forms/ProductForm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});





//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ProductDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const entityPath = 'product'

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const columns = [
    {
      title: 'Tipo de product',
      field: 'product_type_id',
      type: 'options',
      options: props.productTypes,
      optionLabel: 'name'
    },
    {
      title: 'Calibre',
      field: 'calibre',
      type: 'text'
    },
    {
      title: 'Ancho',
      field: 'width',
      type: 'text'
    },
    {
      title: 'Largo',
      field: 'length',
      type: 'text'
    },
    {
      title: 'Descripción',
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

  const handleOnSubmit = (production, callback) => {
    let productionPromise = mainEntityPromise(production, entityPath)
    productionPromise
      .then(result => {
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
            entityPath={entityPath}
            title="Productos"
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
        fullWidth
        open={open}
        fullScreen
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <ProductForm product={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    productTypes: state.production.productTypes
  }
}

export default connect(mapStateToProps, null)(ProductDataTable)