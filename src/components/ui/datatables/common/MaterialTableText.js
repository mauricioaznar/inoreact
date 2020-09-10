import React from 'react'
import TextField from '@material-ui/core/TextField'

export default function MaterialTableText (props) {
  return (
    <TextField
      autoFocus={props.focus}
      value={props.value}
      onChange={(e) => {
        props.onChange(e.currentTarget.value)
      }}
    />
  )
}