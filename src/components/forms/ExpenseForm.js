import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {Input} from "@material-ui/core";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {green} from '@material-ui/core/colors';
import {makeStyles, useTheme} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import MauDatePicker from '../inputs/MauDatePicker'
import InputLabel from '@material-ui/core/InputLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import FormLabel from '@material-ui/core/FormLabel'


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


const ExpenseForm = (props) => {

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // const theme = useTheme()

  // const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))


  // const initialExpenseSubcategoriesIds = props.expense.expense_items.map(expenseItem => expenseItem.expense_subcategory_id)
  // const initialExpenseSubcategories = props.expenseSubcategories.filter(expenseSubcategory => {
  //   return initialExpenseSubcategoriesIds.includes(expenseSubcategory.id)
  // })

  const defaultValues = {
    description: props.expense.description,
    expense_items: props.expense.expense_items,
    tax: props.expense.tax,
    supplier_id: String(props.expense.supplier_id),
    date_paid: props.expense.date_paid,
    invoice_code: props.expense.invoice_code,
    internal_code: props.expense.internal_code,
    expense_type_id: String(props.expense.expense_type_id)
    // expense_subcategories: initialExpenseSubcategories
  }

  const {register, handleSubmit, reset, watch, control, setValue, getValues} = useForm({
    defaultValues
  });


  const watchExpenseItems = watch('expense_items')
  const watchExpenseType = watch('expense_type_id')

  let total = watchExpenseItems.reduce((acc, expenseItem) => {
    return expenseItem.subtotal !== '' ? acc + Number(expenseItem.subtotal) : acc
  }, 0)


  let isInvoice = false
  let isNote = false

  if (watchExpenseType === "1") {
    isNote = true
  }

  if (watchExpenseType === "2") {
    isInvoice = true
  }

  const {fields, append, prepend, remove, swap, move, insert} = useFieldArray(
    {
      control,
      name: "expense_items"
    }
  );


  // useEffect(() => {
  //   register({name: "expense_subcategories"},
  //     {
  //       required: true,
  //       validate: (value) => {return value.length > 0}
  //     });
  // }, []);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const onSubmit = data => {
    console.log(data)
    let id = props.expense.id
    setSuccess(false);
    setLoading(true);
    props.onSubmit(
      {...data,
        tax: isInvoice ? data.tax : "0",
        invoice_code: isInvoice ? data.invoice_code : "",
        id,
        defaultValues
    }, onSubmitCallback)
  };

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
  }

  const handleAddExpenseItem = () => {
    append({expense_subcategory_id: '', subtotal: 0})
  }

  const handleRemoveExpenseItem = () => {
    remove(fields.length - 1)
  }

  const handleSubtotalChange = (e) => {
    if (isInvoice) setValue('tax', total * 0.16)
  }

  // const handleAutocompleteChange = (e, data) => {
  //   setValue('expense_subcategories', data)
  //   data.forEach(expenseSubcategory => {
  //     let foundExpenseItem = props.expense.expense_items.find(expenseItem => {
  //       return expenseItem.expense_subcategory_id === expenseSubcategory.id
  //     })
  //     if (foundExpenseItem) {
  //       append(foundExpenseItem)
  //     } else {
  //       append({expense_subcategory_id: expenseSubcategory.id, subtotal: 0})
  //     }
  //   })
  // }

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
        <InputLabel>Tipo de gasto</InputLabel>
         <Controller
           as={
             <RadioGroup aria-label="gender" row>
               {props.expenseTypes.map(expenseType => {
                 return (
                   <FormControlLabel
                     key={expenseType.id}
                     value={String(expenseType.id)}
                     control={<Radio />}
                     label={expenseType.name}
                   />
                 )
               })}
              </RadioGroup>
           }
           name="expense_type_id"
           control={control}
         />
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
            <MauDatePicker
              register={register}
              setValue={setValue}
              name="date_paid"
              defaultValue={props.expense.date_paid}
              label="Fecha de pago"
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
            <TextField
              inputRef={register({required: true})}
              name="description"
              label="Descripcion"
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
            <TextField
              inputRef={register({
                required: true
              })}
              type="number"
              name="internal_code"
              label="Codigo interno"
            />
          </FormControl>
        </Grid>

        {
          isInvoice ?
            <Grid
              item
              xs={12}
              className={classes.rowContainer}
              style={{marginTop: '2em'}}
            >
              <FormControl
                fullWidth
              >
                <TextField
                  inputRef={register({
                    required: true
                  })}
                  name="invoice_code"
                  label="Codigo de la factura"
                />
              </FormControl>
            </Grid> :
            null
        }

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <FormControl fullWidth>
            <InputLabel id="supplierLabel">Proveedor</InputLabel>
            <Controller
              as={
                <Select
                  labelId={'supplierLabel'}
                >
                  <MenuItem
                    key={0}
                    value={'null'}
                  >
                    &nbsp;
                  </MenuItem>
                  {props.suppliers.map(supplier => {
                    return (
                      <MenuItem
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              }
              name={`supplier_id`}
              rules={{required: "this is required"}}
              control={control}
              defaultValue={`${props.expense.supplier_id}`}
            />
          </FormControl>
        </Grid>


        {/*<Grid*/}
        {/*  item*/}
        {/*  xs={12}*/}
        {/*  className={classes.rowContainer}*/}
        {/*  style={{marginTop: '2em'}}*/}
        {/*>*/}
        {/*  <FormControl*/}
        {/*    fullWidth*/}
        {/*  >*/}

        {/*    <Autocomplete*/}
        {/*      options={props.expenseSubcategories}*/}
        {/*      multiple*/}
        {/*      getOptionLabel={option => option.name}*/}
        {/*      defaultValue={initialExpenseSubcategories}*/}
        {/*      groupBy={option => {*/}
        {/*        return option.expense_category_id*/}
        {/*      }}*/}
        {/*      onChange={handleAutocompleteChange}*/}
        {/*      renderInput={params => {*/}
        {/*        return (*/}
        {/*          <TextField*/}
        {/*            {...params}*/}
        {/*            label={"Resolution Code"}*/}
        {/*            variant="standard"*/}
        {/*            name={"resolutionCode"}*/}
        {/*            fullWidth*/}
        {/*          />*/}
        {/*        );*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </FormControl>*/}
        {/*</Grid>*/}


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >

          <Grid
            container
            direction={'column'}
          >
            <Grid
              item
              xs={12}
            >
              <ButtonGroup
                variant="contained"
                color="primary"
                aria-label="contained primary button group"
              >
                <Button
                  onClick={() => {
                    handleRemoveExpenseItem()
                  }}
                >Remover</Button>
                <Button
                  onClick={() => {
                    handleAddExpenseItem()
                  }}
                >Agregar</Button>
              </ButtonGroup>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{display: 'none'}}>Id</TableCell>
                      <TableCell style={{width: '50%'}}>Rubro</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((expenseItem, index) => (
                      <TableRow key={index + '' + expenseItem.expense_subcategory_id}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_items[${index}].id`}
                            defaultValue={`${expenseItem.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>

                          <FormControl fullWidth>

                            <Controller
                              as={
                                <Select>
                                  {props.expenseSubcategories.map(expenseSubcategory => {
                                    return (
                                      <MenuItem
                                        key={expenseSubcategory.id}
                                        value={expenseSubcategory.id}
                                      >
                                        {expenseSubcategory.name}
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                              }
                              name={`expense_items[${index}].expense_subcategory_id`}
                              rules={{required: "this is required"}}
                              control={control}
                              defaultValue={`${expenseItem.expense_subcategory_id}`}
                            />
                          </FormControl>

                          {/*<TextField*/}
                          {/*  id="standard-number"*/}
                          {/*  label="Number"*/}
                          {/*  type="number"*/}
                          {/*  disabled*/}
                          {/*  name={`expense_items[${index}].expense_subcategory_id`}*/}
                          {/*  defaultValue={`${expenseItem.expense_subcategory_id}`}*/}
                          {/*  inputRef={register({ required: true })}*/}
                          {/*/>*/}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_items[${index}].subtotal`}
                            defaultValue={`${expenseItem.subtotal}`}
                            inputRef={register({required: true, max: 10000000})}
                            onChange={(e) => {handleSubtotalChange(e)}}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>


        {
            isInvoice ?
              <Grid
                item
                xs={12}
                className={classes.rowContainer}
                style={{marginTop: '2em'}}
              >
                <FormControl
                  fullWidth
                >
                  <TextField
                    inputRef={register({
                      required: true
                    })}
                    type="number"
                    name="tax"
                    label="IVA"
                  />
                </FormControl>
              </Grid> :
              null
        }


        <Grid
          item
          container
          xs={12}
          justify={'flex-end'}
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
    suppliers: state.expenses.suppliers.sort((a, b) => {
      return a.name > b.name ? 1 : -1
    }),
    expenseSubcategories: state.expenses.expenseSubcategories.sort((a, b) => {
      return a.expense_category_id > b.expense_category_id ? 1 : -1
    }),
    expenseTypes: state.expenses.expenseTypes
  }
}

export default connect(mapStateToProps, null)(ExpenseForm)