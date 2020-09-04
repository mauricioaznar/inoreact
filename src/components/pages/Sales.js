import React from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import SalesCollectionDataTable from '../ui/datatables/SalesCollectionDataTable'


const Sales = (props) => {
  return (
    <Grid container direction={'column'}>
      <Grid item xs>
        <SalesCollectionDataTable/>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

export default connect (mapStateToProps, null) (Sales)