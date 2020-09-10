import React from 'react'
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl'
import {Controller} from 'react-hook-form'

function MauDatePicker (props) {
  return (
    <FormControl
      fullWidth
    >
      <Controller
        render={renderProps => (
          <MuiPickersUtilsProvider utils={DateMomentUtils}>
            <KeyboardDatePicker
              label={props.label}
              value={renderProps.value}
              variant={'inline'}
              format={'YYYY-MM-DD'}
              error={props.error}
              helperText={props.helperText}
              onChange={(momentDate) => {
                renderProps.onChange(momentDate !== null && momentDate.isValid() ?
                  momentDate.format('YYYY-MM-DD') : '0000-00-00')
              }}
              animateYearScrolling
              PopoverProps={{
                anchorOrigin: { horizontal: "left", vertical: "bottom" },
                transformOrigin: { horizontal: "left", vertical: "top"}
              }}
            />
          </MuiPickersUtilsProvider>
        )}
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