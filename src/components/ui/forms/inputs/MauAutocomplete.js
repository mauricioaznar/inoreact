import React from 'react'
import {Controller} from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function MauAutocomplete (props) {

  let displayName = props.displayName || 'name'

  return (
    <FormControl
      fullWidth
    >
      <Controller
        render={renderProps => (
          <Autocomplete
            defaultValue={props.options.find(option => {return String(option.id) === props.defaultValue})}
            options={props.options}
            getOptionLabel={option => {
              return option[displayName]
            }}
            disabled={props.disabled || undefined}
            renderInput={params => (
              <TextField
                {...params}
                label={props.label}
                error={!!props.error}
                placeholder={props.placeholder}
              />
            )}
            onChange={(e, data) => {
              let newData = data !== null ? String(data.id) : ''
              if(props.onChange) props.onChange(e, newData)
              renderProps.onChange(newData)
            }}
          />
        )}
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue}
        rules={{
          validate: (value) => {
            let isRequiredValid = props.rules && props.rules.required ? value && value.id : true
            let isCustomValidateValid = props.rules && props.rules.validate ? props.rules.validate(value) : true
            return isCustomValidateValid && isRequiredValid
          }
        }}
      />
    </FormControl>
  )
}