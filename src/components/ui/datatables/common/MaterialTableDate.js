import React from 'react'
import {MobileDatePicker} from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField'

export default function MaterialTableDate (props) {
  return (
    <MobileDatePicker
      clearable
      autoOk={true}
      renderInput={(props) => <TextField {...props}/>}
      views={["month"]}
      minDate={new Date("2018-01-01")}
      maxDate={new Date("2021-12-31")}
      value={props.value}
      inputFormat={'yyyy-MM'}
      onChange={props.onChange}
      animateYearScrolling
    />
  )
}