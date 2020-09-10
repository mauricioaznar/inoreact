import React from 'react'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateMomentUtils from '@date-io/moment'

export default function MaterialTableDate (props) {
  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils}>
      <KeyboardDatePicker
        clearable
        autoOk={true}
        views={["month"]}
        minDate={new Date("2018-01-01")}
        maxDate={new Date("2021-12-31")}
        value={props.value}
        variant={'dialog'}
        format={'YYYY-MM'}
        onChange={props.onChange}
        animateYearScrolling
      />
    </MuiPickersUtilsProvider>
  )
}