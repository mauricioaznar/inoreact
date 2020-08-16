import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {Input} from "@material-ui/core";
import {useForm, Controller} from "react-hook-form";
import {green} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
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
      alignItems: 'center'
    },
    wrapper: {
      position: 'relative'
    },
    buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700]
      }
    },
    fabProgress: {
      color: green[500],
      position: 'absolute',
      top: -6,
      left: -6,
      zIndex: 1
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
    }
  }
})


const options = [
  {_id: 1, name: "Country 1"},
  {_id: 2, name: "Country 2"},
  {_id: 3, name: "Country 3"}
];

const top100Films = [
  {title: "The Shawshank Redemption", year: 1994},
  {title: "The Godfather", year: 1972},
  {title: "The Godfather: Part II", year: 1974},
  {title: "The Dark Knight", year: 2008},
  {title: "12 Angry Men", year: 1957},
  {title: "Schindler's List", year: 1993}
];


const ExpenseForm = (props) => {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {register, handleSubmit, reset, watch, control, setValue, getValues} = useForm({
    defaultValues: {
      description: props.expense.description,
      something: 'something',
      expenseItems: []
    }
  });

  const classes = useStyles()

  useEffect(() => {
    register({name: 'something'})
    register({name: "expenseItems"},
      {
        required: true,
        validate: (value) => {return value.length > 0}
      });
  }, []);


  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
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

  const handleAutocompleteChange = (e, data) => {
    setValue('expenseItems', data)
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
              options={top100Films}
              multiple
              getOptionLabel={option => option.title}
              defaultValue={top100Films
                .filter((film) => {
                  return film.year !== 1993
                }
              )}
              onChange={handleAutocompleteChange}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    label={"Resolution Code"}
                    variant="outlined"
                    name={"resolutionCode"}
                    fullWidth
                  />
                );
              }}
            />
            {/*<Controller*/}
            {/*  name={'subcategories'}*/}
            {/*  control={control}*/}
            {/*  onChange={([, obj]) => getOpObj(obj).id}*/}
            {/*  defaultValue={props.expenseSubcategories[0]}*/}
            {/*  as={*/}
            {/*   <Autocomplete*/}
            {/*     multiple*/}
            {/*     options={props.expenseSubcategories}*/}
            {/*     getOptionLabel={option => option.name}*/}
            {/*     getOptionSelected={(option, value) => {*/}
            {/*       return option.id === getOpObj(value).id;*/}
            {/*     }}*/}
            {/*     renderInput={params => (*/}
            {/*       <TextField*/}
            {/*         {...params}*/}
            {/*         variant="standard"*/}
            {/*         label="Multiple values"*/}
            {/*         placeholder="Favorites"*/}
            {/*         margin="normal"*/}
            {/*         fullWidth*/}
            {/*       />*/}
            {/*     )}*/}
            {/*   />*/}
            {/* }*/}
            {/*/>*/}
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
              {success ? <CheckIcon/> : <SaveIcon/>}
            </Fab>
            {loading && <CircularProgress
              size={68}
              className={classes.fabProgress}
            />}
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