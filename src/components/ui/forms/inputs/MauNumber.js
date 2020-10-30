import React from 'react'
import {Controller} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import {DatePicker} from '@material-ui/pickers'
import TextField from '@material-ui/core/TextField'
import NumberFormat from 'react-number-format';

export default function MauNumber (props) {
  return (
    <FormControl
      style={props.style ? {...props.style} : undefined}
      fullWidth
      disabled={props.disabled}
    >
      <Controller
        render={renderProps => {
          return (
            <NumberFormat
              label={props.label}
              helperText={null}
              error={props.error}
              thousandSeparator={props.thousand === false ? false : true}
              defaultValue={props.defaultValue}
              decimalScale={props.decimal === false ? 0 : 2}
              InputLabelProps={{
                shrink: true
              }}
              value={renderProps.value}
              onValueChange={(values) => {
                const {formattedValue, value} = values
                renderProps.onChange(value)
                if (props.onChange) {
                  props.onChange(value)
                }
              }}
              disabled={props.disabled}
              allowNegative={props.negative === false || props.negative === undefined ? false : true}
              allowLeadingZeros={false}
              customInput={TextField}
            />
          )
        }}
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue ? props.defaultValue : ''}
        rules={{
          ...props.rules
        }}
      />
    </FormControl>
  )
}