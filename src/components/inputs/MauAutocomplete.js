import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import {Controller} from 'react-hook-form'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function MauAutocomplete (props) {


  let displayName = props.displayName || 'name'

  console.log(props.options)

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