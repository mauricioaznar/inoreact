import React from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SalesCollectionDataTable from '../ui/datatables/SalesCollectionDataTable'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import {makeStyles} from '@material-ui/core/styles'


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
      >
        <SalesCollectionDataTable />
      </Grid>
      <Grid
        item
      >
        <OrderRequestsDataTable />
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

export default connect(mapStateToProps, null)(Sales)