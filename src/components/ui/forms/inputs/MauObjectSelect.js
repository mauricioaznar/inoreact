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
        onChange={e => {console.log(e)}}
        render={(renderProps) => {
          return (
            <Select
              labelId={props.id}
              onChange={(e) => {
                if (props.onChange) props.onChange(e)
                renderProps.onChange(e)
              }}
              value={renderProps.value}
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
          )
        }}
        name={props.name}
        rules={
          {
            ...props.rules,
            validate: (value) => {
              let isRequired = props.rules && props.rules.required
              let isNull = (value === 'null' || value === null)
              let isEmpty = value === ''
              if (isRequired) {
                console.log(value)
              }
              return isRequired ? !(isNull || isEmpty) : true
            }
          }
        }
        control={props.control}
        defaultValue={props.defaultValue}
      />
    </FormControl>
  )
}