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
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

const dateFormat = 'YYYY-MM-DD'


const useFetch = (url) => {
  const [data, setData] = React.useState(null);

  // empty array as second argument equivalent to componentDidMount
  React.useEffect(() => {
    let unmounted = false

    async function fetchData() {
      const response = await axios.get(url, {headers: {...authHeader()}});
      if (!unmounted) {
        setData(response.data.data)
      }
    }

    if (!unmounted) {
      fetchData();
    }
    return () => {
      unmounted = true
    };
  }, [url]);

  return data;
};

function getWeekRange(week = 0, content) {
  let currentStart = moment().add(week, 'weeks').startOf('week');
  let endWeek = moment().startOf('week')
  let weeks = []

  while (currentStart.isBefore(endWeek, '[]')) {
    weeks.push({
      first_day_of_the_week: currentStart.startOf('week').format(dateFormat),
      last_day_of_the_week: currentStart.endOf('week').format(dateFormat),
      current_week_number: '#' + currentStart.week() + ' ' + currentStart.format('YYYY-MM'),
      week: currentStart.startOf('week').format(dateFormat) + ' ' + currentStart.endOf('week').format(dateFormat),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}

function getDayRange(day = 0, content) {
  let currentStart = moment().add(day, 'days');
  let endDay = moment()
  let days = []

  while (currentStart.isBefore(endDay, '[]')) {
    days.push({
      day: currentStart.format('MM-DD'),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'day')
  }
  return days
}


//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function Production(props) {

  const classes = useStyles()

  const theme = useTheme()
  const [machineTypeId, setMachineTypeId] = React.useState(1)

  const productionEvents = useFetch(apiUrl + 'analytics/productionEvents?dateGroup=day')
  const productionByProductType = useFetch(apiUrl + 'analytics/production?dateGroup=day')

  const handleChange = (event) => {
    setMachineTypeId(event.target.value);
  };


  let machinesIdObject = props.machines
    .reduce(function (obj, itm) {
      obj[itm.name] = 0;
      return obj;
    }, {})
  let machineNamesArray = props.machines
    .filter(machine => {
      return machine.machine_type_id === machineTypeId
    })
    .map(machine => {
      return machine.name
    })

  let dayRangeEvents = getDayRange(-200, machinesIdObject)

  if (productionEvents) {
    console.log(productionEvents)
    console.log(dayRangeEvents)
    productionEvents.forEach(result => {
      let dayRangeFound = dayRangeEvents.find(range => {
        return result.start_date === range.date
      })
      if (dayRangeFound) {
        dayRangeFound[result.machine_name] += isNaN(result.duration) ? 0 : Number(result.duration)
      }
    })
  }

  let productTypeObject = props.productTypes.reduce(function (obj, itm) {
    obj[itm.name] = 0;
    return obj;
  }, {})
  let productTypeNamesArray = props.productTypes.filter(productType => productType.id !== 3)
    .map(productType => {
      return productType.name
    })
  let dayRangeProduction = getDayRange(-200, productTypeObject)
  if (productionByProductType) {
    productionByProductType.forEach(result => {
      let dayRangeFound = dayRangeProduction.find(range => {
        return result.start_date === range.date
      })
      if (dayRangeFound) {
        dayRangeFound[result.product_type_name] += Number(result.kilos)
      }
    })
  }

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid container>
        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '4em', marginBottom: '4em'}}
        >
          <Typography variant={'h2'}>
            Mantenimiento
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction={'column'}
          xs={12}
          className={classes.rowContainer}
          style={{marginBottom: '2em'}}
        >
          <Grid
            item
            xs={12}
          >
            <Typography variant={'h5'}>
              Minutos de paro vs maquinas
            </Typography>
          </Grid>
          <Grid
            item
            style={{marginTop: '1.5em', marginBottom: '1.5em'}}
            xs={12}
            sm={3}
            md={2}
          >
            <FormControl
              className={classes.formControl}
              fullWidth
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={machineTypeId}
                onChange={handleChange}
              >
                <MenuItem value={1}>Bolseo</MenuItem>
                <MenuItem value={2}>Extrusion</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <ProductionEventChart
              dataKeys={machineNamesArray}
              data={dayRangeEvents}
              xDataKey={'day'}
            />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          className={classes.rowContainer}
          style={{marginBottom: '2em'}}
        >
          <Grid item xs={12} style={{marginBottom: '1.5em'}}>
            <Typography variant={'h5'}>
              Kilos producidos por tipo de producto
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <ProductionEventChart
              dataKeys={productTypeNamesArray}
              data={dayRangeProduction}
              xDataKey={'day'}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    productTypes: state.production.productTypes
  }
}

export default connect(mapStateToProps, null)(Production)