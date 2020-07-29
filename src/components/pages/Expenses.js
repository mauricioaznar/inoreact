import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import ExpensesCategoryTable from '../ui/ExpensesCategoryTable'


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

function Expenses(props) {
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
          Gastos
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        style={{marginBottom: '2em'}}
      >
        <Typography variant={'h4'}>
          Gastos por rubro
        </Typography>
      </Grid>
      <Grid
        item
        className={classes.rowContainer}
        xs={12}
      >
        <ExpensesCategoryTable />
      </Grid>
    </Grid>
  )
}


export default Expenses