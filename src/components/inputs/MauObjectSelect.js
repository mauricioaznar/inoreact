import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import {Controller} from 'react-hook-form'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'

export default function MauObjectSelect (props) {


  let displayName = props.displayName || 'name'

  return (
    <FormControl
      fullWidth
      error={!!props.error}
    >
      <InputLabel id={props.id}>{props.label}</InputLabel>
      <Controller
        as={
          <Select
            labelId={props.id}
          >
            <MenuItem
              key={0}
              value={'null'}
            >
              &nbsp;
            </MenuItem>
            {props.options.map(option => {
              return (
                <MenuItem
                  key={option.id}
                  value={String(option.id)}
                >
                  {option[displayName]}
                </MenuItem>
              )
            })}
          </Select>
        }
        name={props.name}
        rules={props.rules}
        control={props.control}
        defaultValue={props.defaultValue}
      />
    </FormControl>
  )
}