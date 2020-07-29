import React from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import RequestsProductsTable from '../ui/RequestsProductsTable'


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

function Sales(props) {
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
        <RequestsProductsTable />
      </Grid>
    </Grid>
  )
}


export default Sales
