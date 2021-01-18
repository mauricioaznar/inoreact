import React from 'react'
import {MobileDateTimePicker} from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl'
import {Controller} from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import moment from 'moment'
import {dateTimeFormat} from '../../../../helpers/dateFormat'

function MauDateTimePicker(props) {

  return (
    <FormControl
      fullWidth
    >
      <Controller
        render={renderProps => {
          return (
            <MobileDateTimePicker
              label={props.label}
              value={renderProps.value}
              renderInput={(params) => {
                return (<TextField
                  {...params}
                  helperText={null}
                  error={!!props.error}
                />)
              }}
              onChange={(date) => {
                renderProps.onChange(date.set({second: 0}).format(dateTimeFormat))
              }}
              inputFormat={'YYYY-MM-DD HH:mm:ss'}
              animateYearScrolling
              PopoverProps={{
                anchorOrigin: {horizontal: "left", vertical: "bottom"},
                transformOrigin: {horizontal: "left", vertical: "top"}
              }}
            />
          )
        }}
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue ? props.defaultValue : null}
        rules={{
          ...props.rules,
          validate: (value) => {
            let isValid = props.rules && props.rules.required ? moment(value, dateTimeFormat) : true
            return isValid || `La ${props.label.toLowerCase()} es requerida`
          }
        }}
      />
    </FormControl>
  )
}


export default MauDateTimePicker