import React from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import RequestsTable from '../ui/RequestsTable'
import {connect} from 'react-redux'


const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '2em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function Analytics(props) {
  const classes = useStyles()
  const headers = ['Codigo', 'Cliente', 'Producto', 'Cantidad solicitada', 'Inventario fisico']
  const requestsTableRows = []
  props.requestsProducts.forEach(requestProduct => {
    if (requestProduct.order_request_status_id === 2) {
      const inventoryProduct = props.inventory.find(inventoryElement => {
        return inventoryElement.id === requestProduct.product_id
      })
      const inventoryBalance = inventoryProduct.kilos_cut + inventoryProduct.kilos_adjusted - inventoryProduct.kilos_sold_given
      requestsTableRows.push([requestProduct.order_code, requestProduct.client_name, requestProduct.product_description, formatNumber(requestProduct.product_kilos), formatNumber(inventoryBalance)])
    }
  })
  // console.log(filteredRequestsByProductionStatus)
  return (
    <Grid
      container
      direction={'column'}
      className={classes.analyticsContainer}
    >
      <Grid
        item
        container
        direction={'column'}
        className={classes.rowContainer}
      >
        <Grid
          item
          sm
          xs={12}
        >
          <RequestsTable headers={headers} rows={requestsTableRows} />

        </Grid>
        <Grid
          item
          sm
          xs={12}
        >
          <RequestsTable headers={headers} rows={requestsTableRows} />

        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    requests: state.auth.requests,
    requestsProducts: state.auth.requestsProducts,
    inventory: state.auth.inventory
  }
}

export default connect(mapStateToProps, null)(Analytics)
