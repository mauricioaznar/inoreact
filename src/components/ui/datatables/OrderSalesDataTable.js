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


  const entityPath = 'orderSale'

  const orderRequestsInProductions = useFetch(apiUrl +
    'orderRequest/list?filter_exact_1=order_request_status_id&filter_exact_value_1=2')

  React.useEffect(() => {
    if (orderRequestsInProductions && !rowData) {
      setOrderRequests(orderRequestsInProductions)
    }
  }, [orderRequestsInProductions])

  const [orderRequest, setOrderRequest] = React.useState(null);


  const columns = [
    {
      title: 'Folio',
      field: 'order_code'
    },
    {
      title: 'Fecha de la venta',
      field: 'date',
      type: 'date'
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
      title: 'Kilos',
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.order_sale_products.map(saleProduct => {
                return (
                  <li style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
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
                  <li style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
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
    console.log(orderSale)
    mainEntityPromise({...orderSale, order_request_id: orderRequest.id}, entityPath)
      .then(result => {
        let orderSaleId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: orderSale.defaultValues.order_sale_products,
            subEntities: orderSale.order_sale_products,
            path: 'orderSaleProduct'
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
          setRowData(rowData)
          setOrderRequest(rowData.order_request)
          setOpen(true)
        }}
        columns={columns}
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
            <Grid container direction={'column'}>
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
                    onChange={(e, data) => {setOrderRequest(data)}}
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
          </Dialog>
          : undefined
      }

    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    products: state.production.products,
    clients: state.sales.clients
  }
}

export default connect(mapStateToProps, null)(OrderSalesDataTable)