import React from 'react'
import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

const dateFormat = 'YYYY-MM-DD'

function getWeekRange(week = 0) {
  let currentStart = moment().add(week, 'weeks').startOf('week');
  let endWeek = moment().startOf('week')
  let weeks = []
  while(currentStart.isBefore(endWeek, '[]')) {
    weeks.push({
      start: currentStart.startOf('week').format(dateFormat),
      end: currentStart.endOf('week').format(dateFormat),
      current_week_number: currentStart.week(),
      date: currentStart.format()
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}

export default function Maintenance(props) {

  const classes = useStyles()

  React.useEffect(() => {
    console.log(getWeekRange(-40))
  })

  return (
    <Grid container direction={'column'}>
      <Grid container>
        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '4em', marginBottom: '2em'}}
        >
          <Typography variant={'h2'}>
            Mantenimiento
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}