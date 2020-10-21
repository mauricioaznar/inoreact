import React from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import {makeStyles} from '@material-ui/core/styles'
import OrderSaleDataTable from '../ui/datatables/OrderSalesDataTable'


const useStyles = makeStyles((theme) => ({
  rowContainer: {
    paddingLeft: '2em',
    paddingRight: '2em'
  }
}));

const Sales = (props) => {

  const classes = useStyles()

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        className={classes.rowContainer}
        style={{marginBottom: '2em', marginTop: '2em'}}
      >
        <OrderRequestsDataTable />
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginBottom: '2em', marginTop: '2em'}}
      >
        <OrderSaleDataTable />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, null)(Sales)