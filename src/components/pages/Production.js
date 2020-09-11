import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useFetch from '../../helpers/useFetch'
import apiUrl from '../../helpers/apiUrl'

const useStyles = makeStyles((theme) => {
  return {
    analyticsContainer: {
      marginTop: '4em'
    },
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})


export default function Production () {

  const classes = useStyles()
  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const productions = useFetch(apiUrl + 'analytics/production?dateGroup=none&entityGroup=material|product|machine')

  if (productions) {
    console.log(productions)
  }

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid item>
          <Typography variant={matchesXS ? 'h2' : 'h1'}>
            Produccion
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
