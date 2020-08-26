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
            renderInput={params => (
              <TextField
                {...params}
                label={props.label}
                error={!!props.error}
                placeholder={props.placeholder}
              />
            )}
            onChange={(e, data) => {
              if(props.onChange) props.onChange(e, data)
              renderProps.onChange(data !== null ? String(data.id) : '')
            }}
          />
        )}
        name={props.name}
        control={props.control}
        rules={props.rules}
      />
    </FormControl>
  )
}