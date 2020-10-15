import React from 'react'
import {connect} from 'react-redux'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise} from './common/common'
import MauMaterialTable from './common/MauMaterialTable'
import OrderRequestForm from '../forms/OrderRequestForm'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function OrderRequestDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'orderRequest'

  const columns = [
    {
      title: 'Codigo',
      field: 'order_code'
    }
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (user, callback) => {
    mainEntityPromise(user, entityPath)
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
      <MauMaterialTable
        tableRef={tableRef}
        title="Pedidos"
        entityPath={entityPath}
        onRowDelete={(oldData) => {
          return handleRowDelete(oldData)
        }}
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
      <Dialog
        maxWidth={!matchesXS ? 'lg' : null}
        fullWidth={!matchesXS || null}
        open={open}
        fullScreen={matchesXS}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <OrderRequestForm orderRequest={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, null)(OrderRequestDataTable)