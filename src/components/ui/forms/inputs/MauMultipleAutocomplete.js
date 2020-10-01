import React from 'react'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function MauMultipleAutocomplete (props) {

  let displayName = props.displayName || 'name'

  const handleAutocompleteChange = (e, data) => {
    if(props.onChange) props.onChange(e, data)
    let filteredFieldArrayFields = [...props.fieldArray.fields]
    data.forEach(option => {
      let foundOption = filteredFieldArrayFields.find(field => {
        return String(field[props.relationshipId]) === String(option.id)
      })
      filteredFieldArrayFields = filteredFieldArrayFields.filter(field => {
        return String(field[props.relationshipId]) !== String(option.id)
      })
      if (!foundOption) {
        props.fieldArray.append({[props.relationshipId]: option.id, id: ''})
      }
    })

    if (filteredFieldArrayFields[0]) {
      let remainingField = filteredFieldArrayFields[0]
      let remainingFieldIndex = props.fieldArray.fields.findIndex(field => {
        return String(remainingField[props.relationshipId]) === String(field[props.relationshipId])
      })
      props.fieldArray.remove(remainingFieldIndex)
    }
  }

  const defaultValue = props.defaultValue && props.defaultValue.length > 0 ?
    props.options.filter(option => {
      return props.defaultValue.find(dv => {
        return dv[props.relationshipId] === option.id
      })
    }) : []
  // props.options.find(option => {return String(option.id) === props.defaultValue})

  return (
    <>
      <FormControl
        fullWidth
      >
        <Autocomplete
          multiple
          defaultValue={defaultValue}
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
            handleAutocompleteChange(e, data)
          }}
        />
      </FormControl>
      <ul style={{display: 'none'}}>
          {props.fieldArray.fields.map((item, index) => {
              return (
                <li key={index}>
                  <input name={`${props.name}[${index}].id`} ref={props.register()} defaultValue={`${item.id}`}/>
                  <input name={`${props.name}[${index}].${props.relationshipId}`} ref={props.register()} defaultValue={`${item[props.relationshipId]}`} />
                </li>
              );
            })
          }
      </ul>
    </>
  )
}