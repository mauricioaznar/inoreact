import React from 'react'
import {
  DatePicker
} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl'
import {Controller} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'

function MauDatePicker (props) {
  return (
    <FormControl
      fullWidth
    >
      <Controller
        render={renderProps => {
          return (
            <DatePicker
              label={props.label}
              value={renderProps.value}
              renderInput={(props) => <TextField {...props} helperText={null}/>}
              error={props.error}
              onChange={(date) => {
                renderProps.onChange(date)
              }}
              inputFormat={'YYYY-MM-DD'}
              animateYearScrolling
              PopoverProps={{
                anchorOrigin: { horizontal: "left", vertical: "bottom" },
                transformOrigin: { horizontal: "left", vertical: "top"}
              }}
            />
          )
        }}
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue && props.defaultValue !== '0000-00-00' ? props.defaultValue : null}
        rules={{
          ...props.rules,
          validate: (value) => {
            let isValid = props.rules && props.rules.required ? value !== '0000-00-00' : true
            return  isValid || `La ${props.label.toLowerCase()} es requerida`
          }
        }}
      />
    </FormControl>
  )
}


export default MauDatePicker