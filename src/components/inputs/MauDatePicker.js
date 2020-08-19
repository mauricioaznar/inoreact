import React, {useState, useEffect} from 'react'
import moment from 'moment'
import DateMomentUtils from '@date-io/moment';
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

function MauDatePicker (props) {
  const [selectedDate, handleSelectedDate] = useState(new Date());

  useEffect(() => {
    props.register({name: props.name}, {required: true})
  }, [props.register])

  const handleDateChange = (value) => {
    props.setValue(props.name, value.format())
    handleSelectedDate(value)
  }

  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils}>
      <DatePicker
        label="Basic example"
        value={selectedDate}
        onChange={handleDateChange}
        animateYearScrolling
      />
    </MuiPickersUtilsProvider>
  )
}


export default MauDatePicker