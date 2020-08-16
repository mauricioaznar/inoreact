import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {Input} from "@material-ui/core";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {green} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

const useStyles = makeStyles((theme) => {
  return {
    table: {
      minWidth: 400,
      overflow: 'auto'
    },
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

  const initialExpenseSubcategoriesIds = props.expense.expense_items.map(expenseItem => expenseItem.expense_subcategory_id)
  const initialExpenseSubcategories = props.expenseSubcategories.filter(expenseSubcategory => {
    return initialExpenseSubcategoriesIds.includes(expenseSubcategory.id)
  })


  const {register, handleSubmit, reset, watch, control, setValue, getValues} = useForm({
    defaultValues: {
      description: props.expense.description,
      expense_items: props.expense.expense_items
    }
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "expense_items",
      keyName: 'id'
    }
  );


  const classes = useStyles()

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
    data.forEach(expenseSubcategory => {
      let foundExpenseItem = props.expense.expense_items.find(expenseItem => {
        return expenseItem.expense_subcategory_id === expenseSubcategory.id
      })
      if (foundExpenseItem) {
        append(foundExpenseItem)
      } else {
        append({expense_subcategory_id: expenseSubcategory.id, subtotal: 0})
      }
    })
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
              options={props.expenseSubcategories}
              multiple
              getOptionLabel={option => option.name}
              defaultValue={initialExpenseSubcategories}
              groupBy={option => {
                return option.expense_category_id
              }}
              onChange={handleAutocompleteChange}
              renderInput={params => {
                return (
                  <TextField
                    {...params}
                    label={"Resolution Code"}
                    variant="standard"
                    name={"resolutionCode"}
                    fullWidth
                  />
                );
              }}
            />
          </FormControl>
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >

          <TableContainer component={Paper}>
            <Table aria-label="simple table" className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{display: 'none'}}>Id</TableCell>
                  <TableCell>Rubro</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((expenseItem, index) => (
                  <TableRow key={expenseItem.expense_subcategory_id}>
                    <TableCell style={{display: 'none'}}>
                      <TextField
                        id="standard-number"
                        label="Number"
                        type="number"
                        disabled
                        name={`expense_items[${index}].id`}
                        defaultValue={`${expenseItem.id}`}
                        inputRef={register}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="standard-number"
                        label="Number"
                        type="number"
                        disabled
                        name={`expense_items[${index}].expense_subcategory_id`}
                        defaultValue={`${expenseItem.expense_subcategory_id}`}
                        inputRef={register({ required: true })}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        id="standard-number"
                        label="Number"
                        type="number"
                        name={`expense_items[${index}].subtotal`}
                        defaultValue={`${expenseItem.subtotal}`}
                        inputRef={register({ required: true })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
    expenseSubcategories: state.expenses.expenseSubcategories.sort((a, b) => {
      return a.expense_category_id > b.expense_category_id ? 1 : -1
    })
  }
}

export default connect(mapStateToProps, null)(ExpenseForm)