import React, {useState, useEffect} from 'react'
import moment from 'moment'
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';

function MauDatePicker (props) {
  const [selectedDate, handleSelectedDate] = useState(props.defaultValue && props.defaultValue !== '0000-00-00' ?
    props.defaultValue : null);

  useEffect(() => {
    props.register({name: props.name},
      {
        required: true,
        validate: (value) => {
          return props.required ?  value !== '0000-00-00' : true
        }
      }
    )
  }, [props.register])

  const handleDateChange = (momentDate) => {
    props.setValue(props.name, momentDate !== null && momentDate.isValid()
      ? momentDate.format('YYYY-MM-DD') : '0000-00-00', { shouldValidate: true })
    handleSelectedDate(momentDate)
  }

  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils}>
      <KeyboardDatePicker
        label={props.label}
        value={selectedDate}
        variant={'inline'}
        format={'YYYY-MM-DD'}
        error={props.error}
        helperText={props.helperText}
        onChange={handleDateChange}
        animateYearScrolling
        PopoverProps={{
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          transformOrigin: { horizontal: "left", vertical: "top"}
        }}
      />
    </MuiPickersUtilsProvider>
  )
}


export default MauDatePicker