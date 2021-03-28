import React from 'react'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import moment from 'moment'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {makeStyles, useTheme} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  rowContainer: {
    paddingLeft: '2em',
    paddingRight: '2em'
  }
}));

export default function MauMonthYear (props) {

  const classes = useStyles();

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const handleYearChange = (e) => {
    console.log(e.target.value)
    props.setYear(e.target.value)
  }

  const handleMonthChange = (e) => {
    console.log(e.target.value)
    props.setMonth(e.target.value)
  }

  return (
    <Grid
      item
      container
      direction={matchesXS ? 'column' : 'row'}
    >
      <Grid
        item
        xs={12}
        sm={4}
        md={2}
      >
        <FormControl
          className={classes.formControl}
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">Mes</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.month}
            onChange={(e) => {
              handleMonthChange(e)
            }}
          >
            <MenuItem value={1}>{moment().month(0).format('MMMM')}</MenuItem>
            <MenuItem value={2}>{moment().month(1).format('MMMM')}</MenuItem>
            <MenuItem value={3}>{moment().month(2).format('MMMM')}</MenuItem>
            <MenuItem value={4}>{moment().month(3).format('MMMM')}</MenuItem>
            <MenuItem value={5}>{moment().month(4).format('MMMM')}</MenuItem>
            <MenuItem value={6}>{moment().month(5).format('MMMM')}</MenuItem>
            <MenuItem value={7}>{moment().month(6).format('MMMM')}</MenuItem>
            <MenuItem value={8}>{moment().month(7).format('MMMM')}</MenuItem>
            <MenuItem value={9}>{moment().month(8).format('MMMM')}</MenuItem>
            <MenuItem value={10}>{moment().month(9).format('MMMM')}</MenuItem>
            <MenuItem value={11}>{moment().month(10).format('MMMM')}</MenuItem>
            <MenuItem value={12}>{moment().month(11).format('MMMM')}</MenuItem>

          </Select>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        md={2}
        style={{marginLeft: matchesXS ? 0 : '4em'}}
      >
        <FormControl
          className={classes.formControl}
          fullWidth
        >
          <InputLabel id="demo-simple-select-label">Año</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={props.year}
            onChange={(e) => {
              handleYearChange(e)
            }}
          >
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}