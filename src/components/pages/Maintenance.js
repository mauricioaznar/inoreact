import React from 'react'
import {connect} from 'react-redux'


import moment from 'moment'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles, useTheme} from '@material-ui/core/styles'

import ProductionEventChart from '../ui/ProductionEventChart'
import axios from 'axios'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import {isNumber} from 'recharts/lib/util/DataUtils'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em',
    }
  }
})

const dateFormat = 'YYYY-MM-DD'


const useFetch = (url) => {
  const [data, setData] = React.useState(null);

  // empty array as second argument equivalent to componentDidMount
  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    }
    fetchData();
  }, [url]);

  return data;
};

function getWeekRange(week = 0, content) {
  let currentStart = moment().add(week, 'weeks').startOf('week');
  let endWeek = moment().startOf('week')
  let weeks = []

  while(currentStart.isBefore(endWeek, '[]')) {
    weeks.push({
      first_day_of_the_week: currentStart.startOf('week').format(dateFormat),
      last_day_of_the_week: currentStart.endOf('week').format(dateFormat),
      current_week_number: currentStart.week(),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}

//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function Maintenance(props) {

  const classes = useStyles()

  const theme = useTheme()




  const [weekRange, setWeekRange] = React.useState([])
  const [machineNamesArray, setMachineNamesArray] = React.useState([])

  React.useEffect(() => {
    axios.get(apiUrl + 'analytics/productionEvents?dateGroup=week', {headers: {...authHeader()}})
      .then(results => {
        let machinesIdObject = props.machines.reduce(function(obj, itm) {
          obj[itm.name] = 0;
          return obj;
        }, {})
        setMachineNamesArray(props.machines
          .filter(machine => {
            return machine.machine_type_id === 1
          })
          .map(machine => {
            return machine.name
          }))
        const weekRangeTemp = getWeekRange(-40, machinesIdObject)
        results.data.data.forEach(result => {
          let weekRangeFound = weekRangeTemp.find(range => {
          return result.first_day_of_the_week === range.first_day_of_the_week && result.last_day_of_the_week === range.last_day_of_the_week
        })
        if (weekRangeFound) {
          weekRangeFound[result.machine_name] += isNaN(result.duration) ? 0 : Number(result.duration)
        }
        })
        setWeekRange(weekRangeTemp)
      })
  }, [])

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
        <Grid item xs={12} style={{marginBottom: '2em'}}>
          <ProductionEventChart dataKeys={machineNamesArray} data={weekRange} xDataKey={'first_day_of_the_week'}  />
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines
  }
}

export default connect(mapStateToProps, null) (Maintenance)