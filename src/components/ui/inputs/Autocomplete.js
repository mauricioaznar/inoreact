import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function MauAutocomplete (props) {

  let displayName = props.displayName || 'name'

  return (
    <Autocomplete
      options={props.options}
      getOptionLabel={option => {
        return String(option[displayName])
      }}
      value={props.value ? props.value : null}
      renderInput={params => (
        <TextField
          label={props.label ? props.label : null}
          {...params}
        />
      )}
      getOptionSelected={(option, value) => {
        return props.value === option
      }}
      onChange={(e, data) => {
        if (props.onChange) {
          props.onChange(e, data)
        }
      }}
    />
  )
}