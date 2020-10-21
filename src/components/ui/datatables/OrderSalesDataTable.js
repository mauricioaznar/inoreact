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
import formatNumber from '../../../helpers/formatNumber'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function OrderSalesDataTable(props) {

  const tableRef = React.createRef();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'orderSale'

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
        title="Ventas"
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
           {/*<OrderRequestForm orderRequest={rowData} onSubmit={handleOnSubmit} />*/}
        </Dialog>
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