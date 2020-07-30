import React from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import RequestsProductsTable from '../ui/RequestsProductsTable'
import Typography from '@material-ui/core/Typography'
import ProductTypeSalesTable from '../ui/ProductTypeSalesTable'


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
      <Grid item
            className={classes.rowContainer}
            style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Typography variant={'h1'}>
          Ventas
        </Typography>
      </Grid>
      <Grid
         item
         className={classes.rowContainer}
         style={{marginBottom: '2em'}}
      >
        <Typography variant={'h4'}>
          Pedidos en produccion
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        xs={12}
      >
        <RequestsProductsTable />
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginBottom: '2em', marginTop: '2em'}}
      >
        <Typography variant={'h4'}>
          Ventas por subtipo de producto
        </Typography>
      </Grid>
      <Grid
         item
         className={classes.rowContainer}
         xs={12}
      >
        <ProductTypeSalesTable />
      </Grid>
    </Grid>
  )
}


export default Sales
