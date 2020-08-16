import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {Input, Select, MenuItem} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import { green } from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    },
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    wrapper: {
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }
})

const ExpenseForm = (props) => {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {register, handleSubmit, reset, watch, control} = useForm({defaultValues: {
      description: props.expense.description
    }});

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const onSubmit = data => {
    let id = props.expense.id
    setSuccess(false);
    setLoading(true);
    props.onSubmit({...data, id}, onSubmitCallback)
  };

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
  }

  const onTagsChange = (event, values) => {

  }

  return (
    <form>
       <Grid
         container
         direction={'column'}
       >
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
               inputRef={register({required: true})}
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
           <FormControl
            fullWidth
           >
             <Autocomplete
               multiple
               disableCloseOnSelect
               options={props.expenseSubcategories}
               getOptionLabel={option => option.name}
               onChange={onTagsChange}
               renderInput={params => (
                 <TextField
                   {...params}
                   variant="standard"
                   label="Multiple values"
                   placeholder="Favorites"
                   margin="normal"
                   fullWidth
                 />
               )}
             />
           </FormControl>
         </Grid>

         <Grid
           item
           xs={12}
           className={classes.rowContainer}
           style={{marginTop: '2em', marginBottom: '2em'}}
         >
           <div className={classes.wrapper}>
             <Fab
               aria-label="save"
               color="primary"
               className={buttonClassname}
               onClick={handleSubmit(onSubmit)}
             >
               {success ? <CheckIcon /> : <SaveIcon />}
             </Fab>
             {loading && <CircularProgress size={68} className={classes.fabProgress} />}
           </div>
         </Grid>


       </Grid>
    </form>
  )
}


const mapStateToProps = (state) => {
  return {
    suppliers: state.expenses.suppliers,
    expenseSubcategories: state.expenses.expenseSubcategories
  }
}

export default connect(mapStateToProps, null)(ExpenseForm)