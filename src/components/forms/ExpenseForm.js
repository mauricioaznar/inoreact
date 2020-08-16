import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {Input, Select, MenuItem} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import {makeStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})

const ExpenseForm = (props) => {

  const {register, handleSubmit, reset, watch, control} = useForm({defaultValues: {
      select: "",
      input: "",
      description: props.expense.description
    }});

  const classes = useStyles()

  const onSubmit = data => {
    let id = props.expense.id
    props.onSubmit({...data, id})
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
       <Grid
         xs={12}
         container
         direction={'column'}
       >
          <Grid
            item
            xs={12}
            className={classes.rowContainer}
            style={{marginTop: '2em'}}
          >
            <FormControl fullWidth>
              <Controller
                as={
                  <Select

                  >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                </Select>
                }
                control={control}
                name="select"
                defaultValue={10}
              />
            </FormControl>
         </Grid>

         <Grid
           item
           xs={12}
           className={classes.rowContainer}
           style={{marginTop: '2em'}}
         >
           <FormControl
            fullWidth
           >
             <Input
               inputRef={register}
               name="description"
             />
           </FormControl>
         </Grid>

          <Grid
            item
            xs={12}
            className={classes.rowContainer}
            style={{marginTop: '2em'}}
          >
             <input type="submit" />
          </Grid>

       </Grid>
    </form>
  )
}

export default ExpenseForm