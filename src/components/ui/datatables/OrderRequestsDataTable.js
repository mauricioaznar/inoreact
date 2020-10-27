import React from 'react'
import {connect} from 'react-redux'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise, subEntitiesPromises} from './common/common'
import MauMaterialTable from './common/MauMaterialTable'
import OrderRequestForm from '../forms/OrderRequestForm'
import formatNumber from '../../../helpers/formatNumber'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function OrderRequestsDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'orderRequest'

  const columns = [
    {
      title: 'Folio',
      field: 'order_code',
      type: 'text',
      exact: true
    },
    {
      title: 'Fecha de solicitud',
      field: 'date',
      type: 'date'
    },
    {
      title: 'Fecha de entrega estimada',
      field: 'estimated_delivery_date',
      type: 'date'
    },
    {
      title: 'Estado',
      field: 'order_request_status_id',
      type: 'options',
      options: props.requestStatuses,
      optionLabel: 'name'
    },
    {
      title: 'Cliente',
      field: 'client_id',
      type: 'options',
      options: props.clients,
      optionLabel: 'name'
    },
    {
      title: 'Productos',
      type: 'entity',
      field: 'product_id',
      entity: 'orderRequestProducts',
      table: 'order_request_products',
      options: props.products,
      optionLabel: 'description'
    },
    {
      title: 'Kilos',
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.order_request_products.map(requestProduct => {
                return (
                  <li key={requestProduct.id} style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                    {formatNumber(requestProduct.kilos)} kg
                  </li>
                )
              })
            }
          </ul>
        )
      },
    },
    {
      title: 'Total por producto',
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.order_request_products.map(requestProduct => {
                return (
                  <li key={requestProduct.id} style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                   ${formatNumber(requestProduct.kilos * requestProduct.kilo_price)}
                  </li>
                )
              })
            }
          </ul>
        )
      },
    },
    {
      title: 'total',
      render: (rowData) => {
        let total = rowData.order_request_products
          .reduce((acc, ele) => {
            return acc + (ele.kilos * ele.kilo_price)
          }, 0)
        return '$' + formatNumber(total)
      }
    }
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (orderRequest, callback) => {
    mainEntityPromise(orderRequest, entityPath)
      .then(result => {
        let orderRequestId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: orderRequest.defaultValues.order_request_products,
            subEntities: orderRequest.order_request_products,
            path: 'orderRequestProduct'
          }
        ]
        const mainEntityConf = {
          'order_request_id': orderRequestId
        }
        return Promise.all(subEntitiesPromises(subEntitiesConfs, mainEntityConf))
      })
      .then(results => {
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
        fullScreen
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
    products: state.production.products,
    clients: state.sales.clients,
    requestStatuses: state.sales.requestStatuses
  }
}

export default connect(mapStateToProps, null)(OrderRequestsDataTable)