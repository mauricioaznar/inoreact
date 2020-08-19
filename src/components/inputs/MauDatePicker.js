import React, {useState, useEffect} from 'react'
import moment from 'moment'
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

function MauDatePicker (props) {
  const [selectedDate, handleSelectedDate] = useState(props.defaultValue || null);

  useEffect(() => {
    props.register({name: props.name}, {required: true})
  }, [props.register])

  const handleDateChange = (value) => {
    props.setValue(props.name, value !== null ? value.format('YYYY-MM-DD') : '0000-00-00')
    handleSelectedDate(value)
  }

  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils}>
      <KeyboardDatePicker
        label="Basic example"
        value={selectedDate}
        variant={'inline'}
        format={'YYYY-MM-DD'}
        onChange={handleDateChange}
        animateYearScrolling
        PopoverProps={{
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          transformOrigin: { horizontal: "left"}
        }}
      />
    </MuiPickersUtilsProvider>
  )
}


export default MauDatePicker