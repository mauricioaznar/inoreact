import React from 'react'
import {connect} from 'react-redux'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise, subEntitiesPromises} from './common/common'
import MauMaterialTable from './common/MauMaterialTable'
import formatNumber from '../../../helpers/formatNumber'
import OrderSaleForm from '../forms/OrderSaleForm'
import useFetch from '../../../helpers/useFetch'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Autocomplete from '../inputs/Autocomplete'
import {green} from '@material-ui/core/colors'
import CircularProgress from '@material-ui/core/CircularProgress'
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide
    direction="up"
    ref={ref} {...props} />;
});


const useStyles = makeStyles((theme) => {
  return {
    table: {
      minWidth: 400,
      overflow: 'auto'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    },
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    wrapper: {
      position: 'relative'
    },
    tableTitle: {
      flexGrow: 1
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700]
      }
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  }
})


function OrderSalesDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const classes = useStyles()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);
  const [orderRequests, setOrderRequests] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [updates, setUpdates] = React.useState(0)

  const entityPath = 'orderSale'

  const orderRequestsInProductions = useFetch(apiUrl +
    'orderRequest/list?filter_exact_1=order_request_status_id&filter_exact_value_1=2', [updates])

  React.useEffect(() => {
    if (orderRequestsInProductions && !rowData) {
      setOrderRequests(orderRequestsInProductions)
    }
  }, [orderRequestsInProductions])

  const [orderRequest, setOrderRequest] = React.useState(null);


  const columns = [
    {
      title: 'Folio',
      field: 'order_code',
      type: 'text',
      exact: true
    },
    {
      title: 'Fecha de la venta',
      field: 'date',
      type: 'date'
    },
    {
      title: 'Tipo',
      field: 'order_sale_receipt_type_id',
      type: 'options',
      options: props.saleReceiptTypes,
      optionLabel: 'name'
    },
    {
      title: 'Cliente',
      type: 'entity',
      field: 'client_id',
      entity: 'orderRequest',
      table: 'order_request',
      options: props.clients,
      optionLabel: 'name',
      single: true
    },
    {
      title: 'Productos',
      type: 'entity',
      field: 'product_id',
      entity: 'orderSaleProducts',
      table: 'order_sale_products',
      options: props.products,
      optionLabel: 'description'
    },
    {
      title: 'Pedido',
      type: 'entity',
      field: 'order_code',
      entity: 'orderRequest',
      table: 'order_request'
    },
    {
      title: 'Estado',
      field: 'order_sale_status_id',
      type: 'options',
      options: props.saleStatuses,
      optionLabel: 'name'
    },
    {
      title: 'Kilos',
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.order_sale_products.map(saleProduct => {
                return (
                  <li key={saleProduct.id} style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                    {formatNumber(saleProduct.kilos)} kg
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
              rowData.order_sale_products.map(saleProduct => {
                return (
                  <li key={saleProduct.id} style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                   ${formatNumber(saleProduct.kilos * saleProduct.kilo_price)}
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
        let total = rowData.order_sale_products
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

  const handleOnSubmit = (orderSale, callback) => {
    mainEntityPromise({...orderSale, order_request_id: orderRequest.id}, entityPath)
      .then(result => {
        let orderSaleId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: orderSale.defaultValues.order_sale_products,
            subEntities: orderSale.order_sale_products,
            path: 'orderSaleProduct'
          },
          {
            initialSubEntities: orderSale.defaultValues.order_sale_payments,
            subEntities: orderSale.order_sale_payments,
            path: 'orderSalePayment'
          }
        ]
        const mainEntityConf = {
          'order_sale_id': orderSaleId
        }
        return Promise.all(subEntitiesPromises(subEntitiesConfs, mainEntityConf))
      })
      .then(results => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
        setUpdates(updates + 1)
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

  const handleRowEdit = (rowData) => {
    setLoading(true)
    setOpen(true)
    axios.get(apiUrl + 'orderRequest/' + rowData.order_request.id, {headers: {...authHeader()}})
      .then(result => {
        setRowData(rowData)
        setOrderRequest(result.data.data)
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const actions = [
    {
      icon: (props) => <PictureAsPdfIcon {...props} color={'action'} fontSize={'small'} />,
      position: 'row',
      tooltip: 'Exportar',
      onClick: (e, data) => {
        window.open(apiUrl + 'downloads/pdf/' + data.id)
      }
    }
  ]


  return (
    <>
      <MauMaterialTable
        tableRef={tableRef}
        title="Ventas"
        entityPath={entityPath}
        onRowDelete={(oldData) => {
          return handleRowDelete(oldData)
        }}
        onRowAdd={(event, rowData) => {
          setRowData(null)
          setOrderRequest(null)
          setOpen(true)
        }}
        onRowEdit={(event, rowData) => {
          handleRowEdit(rowData)
        }}
        columns={columns}
        actions={actions}
      />

      {
        orderRequestsInProductions ?
          <Dialog
            maxWidth={!matchesXS ? 'lg' : null}
            fullWidth={!matchesXS || null}
            open={open}
            fullScreen
            TransitionComponent={Transition}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            {
              loading ? <CircularProgress
                  size={40}
                  style={{marginLeft: '2em', marginTop: '2em'}}
                />
                : <div>
                    <Grid
                      container
                      direction={'column'}
                    >
                    <Grid
                      item
                      xs={12}
                      className={classes.rowContainer}
                      style={{
                        marginTop: '2em'
                      }}
                    >
                      <FormControl fullWidth>
                        <Autocomplete
                          label={'Folio del pedido'}
                          key={orderRequest}
                          options={orderRequests}
                          disabled={!props.orderSale}
                          displayName={'order_code'}
                          value={orderRequest}
                          onChange={(e, data) => {
                            setOrderRequest(data)
                          }}
                        />
                      </FormControl>
                    </Grid>

                  </Grid>
                   <OrderSaleForm
                     key={orderRequest ? orderRequest.id : 0}
                     orderRequestsInProduction={orderRequestsInProductions ? orderRequestsInProductions : []}
                     orderRequest={orderRequest}
                     orderSale={rowData}
                     onSubmit={handleOnSubmit}
                   />
                  </div>
            }
          </Dialog>
          : undefined
      }

    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    products: state.production.products,
    clients: state.sales.clients,
    saleStatuses: state.sales.saleStatuses,
    saleReceiptTypes: state.sales.saleReceiptTypes
  }
}

export default connect(mapStateToProps, null)(OrderSalesDataTable)