import React from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import RequestsTable from '../ui/RequestsTable'
import {connect} from 'react-redux'


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

function Requests(props) {
  const classes = useStyles()

  // console.log(filteredRequestsByProductionStatus)
  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        className={classes.rowContainer}
        xs={12}
      >
        <RequestsTable inventory={props.inventory} requestsProducts={props.requestsProducts} />
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

export default connect(mapStateToProps, null)(Requests)
