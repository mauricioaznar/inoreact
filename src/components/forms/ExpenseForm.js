import Grid from '@material-ui/core/Grid'
import React, {useEffect} from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {green} from '@material-ui/core/colors';
import {makeStyles, useTheme} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
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

import ExpenseSubcategoriesSelect from '../inputs/ExpenseSubcategoriesSelect'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import moment from 'moment'
import FormLabel from '@material-ui/core/FormLabel'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import MauObjectSelect from '../inputs/MauObjectSelect'
import MauAutocomplete from '../inputs/MauAutocomplete'


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
    tableTitle: {
      flexGrow: 1
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
  const [isDatePaidRequired, setIsDatePaidRequired] = React.useState(moment(props.expense.date_paid).isValid());

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });


  // const theme = useTheme()

  // const matchesXS = useMediaQuery(theme.breakpoints.down('xs'))


  // const initialExpenseSubcategoriesIds = props.expense.expense_items.map(expenseItem => expenseItem.expense_subcategory_id)
  // const initialExpenseSubcategories = props.expenseSubcategories.filter(expenseSubcategory => {
  //   return initialExpenseSubcategoriesIds.includes(expenseSubcategory.id)
  // })

  const defaultValues = {
    description: props.expense.description,
    expense_items: props.expense.expense_items,
    expense_invoice_complements: props.expense.expense_invoice_complements.map(complement => {
      return {...complement, delivered: complement.delivered === 1}
    }),
    tax: props.expense.tax,
    invoice_isr_retained: props.expense.invoice_isr_retained,
    invoice_tax_retained: props.expense.invoice_tax_retained,
    supplier_id: String(props.expense.supplier_id),
    date_paid: props.expense.date_paid,
    invoice_code: props.expense.invoice_code,
    internal_code: props.expense.internal_code,
    expense_type_id: String(props.expense.expense_type_id),
    expense_invoice_payment_method_id: String(props.expense.expense_invoice_payment_method_id),
    expense_products: props.expense.expense_products.map(expenseProduct => {
      return {...expenseProduct, _kilos: expenseProduct.kilos, _groups: expenseProduct.groups}
    })
    // expense_subcategories: initialExpenseSubcategories
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });


  const expenseItems = useFieldArray(
    {
      control,
      name: "expense_items"
    }
  );

  const complements = useFieldArray(
    {
      control,
      name: "expense_invoice_complements"
    }
  );

  const expenseProducts = useFieldArray(
    {
      control,
      name: "expense_products"
    }
  );

  const watchExpenseItems = watch('expense_items')
  const watchExpenseType = watch('expense_type_id')
  const watchPaymentMethod = watch('expense_invoice_payment_method_id')
  const watchExpenseProducts = watch('expense_products')

  let isDifferedPaymentMethod = false

  if (watchPaymentMethod === "1") {
    isDifferedPaymentMethod = true
  } else {
    isDifferedPaymentMethod = false
  }

  let total = watchExpenseItems.reduce((acc, expenseItem) => {
    return expenseItem.subtotal !== '' ? acc + Number(expenseItem.subtotal) : acc
  }, 0)


  let isInvoice = false

  if (watchExpenseType === "1") {
    isInvoice = false
  } else if (watchExpenseType === "2") {
    isInvoice = true
  }




  // useEffect(() => {
  //   register({name: "expense_subcategories"},
  //     {
  //       required: true,
  //       validate: (value) => {return value.length > 0}
  //     });
  // }, []);

  const onSubmit = data => {
    let id = props.expense.id
    setSuccess(false);
    setLoading(true);
    let complements = isDifferedPaymentMethod && data.expense_invoice_complements ? data.expense_invoice_complements
      .map(complement => {
        return {...complement, delivered: (complement.delivered ? '1' : '-1')}
      }) : []


    console.log(data.expense_products)

    let finalSubmited = {
      ...data,
      tax: isInvoice ? data.tax : "0",
      invoice_tax_retained: isInvoice ? data.invoice_tax_retained : "0",
      invoice_isr_retained: isInvoice ? data.invoice_isr_retained : "0",
      invoice_code: isInvoice ? data.invoice_code : "",
      date_paid: isDatePaidRequired ? data.date_paid : '0000-00-00',
      expense_invoice_complements: complements,
      expense_products: isExpenseProductsRequired() ? data.expense_products : [],
      id,
      defaultValues
    }

    props.onSubmit(finalSubmited, onSubmitCallback)
  };

  const onError = data => {
    console.log(data)
  }

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
  }

  const handleAddExpenseItem = () => {
    expenseItems.append({expense_subcategory_id: '', subtotal: "0", branch_id: ''})
  }

  const handleRemoveExpenseItem = (index) => {
    expenseItems.remove(index)
  }


  const handleAddComplement = () => {
    complements.append({delivered: false, name: ''})
  }

  const handleRemoveComplement = (index) => {
    complements.remove(index)
  }

  const handleAddExpenseProduct = () => {
    expenseProducts.append({product_id: "null", _kilos: "0", _groups: "0", kilos: "0", groups: "0", group_weight: "0", kilo_price: "0"})
  }

  const handleRemoveExpenseProduct = (index) => {
    expenseProducts.remove(index)
  }

  const handleProductSelection = (e, index) => {
    let productId = e.target.value
    let groupWeight = "0"
    let kiloPrice = "0"
    let kilos = "0"
    let groups = "0"
    let initialExpenseProduct = defaultValues.expense_products.find(expenseProduct => {
      return productId === String(expenseProduct.product_id)
    })
    if (!initialExpenseProduct) {
      let product = props.products.find(product => {
        return String(product.id) === productId
      })
      groupWeight = product.current_group_weight ? product.current_group_weight : "0"
      kiloPrice = product.current_kilo_price
      kilos = "0"
      groups = "0"
    } else {
      groupWeight = initialExpenseProduct.group_weight
      kiloPrice = initialExpenseProduct.kilo_price
      kilos = initialExpenseProduct.kilos
      groups = initialExpenseProduct.groups
    }
    setValue(`expense_products[${index}].group_weight`, String(groupWeight))
    setValue(`expense_products[${index}].kilo_price`, String(kiloPrice))
    setValue(`expense_products[${index}].kilos`, String(kilos))
    setValue(`expense_products[${index}].groups`, String(groups))
  }

  const calculateExpenseProductKilos = (e, index) => {
    let kilos = Number(watchExpenseProducts[index].groups) *  Number(watchExpenseProducts[index].group_weight)
    setValue(`expense_products[${index}].kilos`, kilos)
  }

  const hasGroupWeight = (index) => {
    let expenseProduct = watchExpenseProducts[index]
    return expenseProduct && expenseProduct.group_weight !== "0"
  }

  const handleSubtotalChange = (e) => {
    setValue('tax', total * 0.16)
  }

  const isQuantityRequired = (index) => {
    let expenseItem = watchExpenseItems[index]
    if (!expenseItem) {
      return false
    }
    return (expenseItem.expense_subcategory_id === '12' ||
      expenseItem.expense_subcategory_id === '13' ||
      expenseItem.expense_subcategory_id === '39' ||
      expenseItem.expense_subcategory_id === '54')
  }

  const isExpenseProductsRequired = () => {
    return watchExpenseItems.reduce((acc, expenseItem) => {
      return expenseItem.expense_subcategory_id === "55"
    }, false)
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
             <RadioGroup
               aria-label="gender"
             >
               {props.expenseTypes.map(expenseType => {
                 return (
                   <FormControlLabel
                     onChange={(e) => {
                       handleSubtotalChange(e)
                     }}
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
          container
          xs={12}
          className={classes.rowContainer}
          direction={'column'}
          style={{marginTop: '2em'}}
        >

          <Grid item xs>
           <FormControl>
             <FormLabel component="legend">
               ¿Ya se pago?
             </FormLabel>
             <FormControlLabel
               control={
                 <Switch
                   checked={isDatePaidRequired}
                   onChange={() => {
                     setIsDatePaidRequired(!isDatePaidRequired)
                   }}
                   name="checkedB"
                   color="primary"
                 />
               }
               label={isDatePaidRequired ? 'Pagada' : 'Pendiente'}
             />
           </FormControl>
          </Grid>

          <Grid item xs style={{marginTop: '0.5em', display: !isDatePaidRequired ? 'none' : 'inherit'}}>
            <FormControl
              fullWidth
            >
              <MauDatePicker
                register={register}
                name="date_paid"
                setValue={setValue}
                required={isDatePaidRequired}
                error={!!errors.date_paid}
                helperText={errors.date_paid && errors.date_paid.message}
                defaultValue={props.expense.date_paid}
                label="Fecha de pago"
              />
            </FormControl>
          </Grid>
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
              error={!!errors.description}
              placeholder="Se compro 'x' porque 'y' "
              InputLabelProps={{
                shrink: true,
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
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register()}
              type="number"
              name="internal_code"
              label="Codigo interno"
              placeholder="14 o 35A o 15 y 16 "
              InputLabelProps={{
                shrink: true,
              }}
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
                  placeholder="CON 770707 "
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid> :
            null
        }

        {/*<Grid*/}
        {/*  item*/}
        {/*  xs={12}*/}
        {/*  className={classes.rowContainer}*/}
        {/*  style={{marginTop: '2em'}}*/}
        {/*>*/}
        {/*  <MauObjectSelect*/}
        {/*    error={!!errors.supplier_id}*/}
        {/*    label={'Proveedor'}*/}
        {/*    id={'supplierLabel'}*/}
        {/*    options={props.suppliers}*/}
        {/*    name={'supplier_id'}*/}
        {/*    rules={*/}
        {/*      {*/}
        {/*        required: "this is required",*/}
        {/*        validate: (value) => {*/}
        {/*          return value !== 'null'*/}
        {/*        }*/}
        {/*      }*/}
        {/*    }*/}
        {/*    control={control}*/}
        {/*    defaultValue={`${props.expense.supplier_id}`}*/}
        {/*  />*/}
        {/*</Grid>*/}


         <Grid
           item
           xs={12}
           className={classes.rowContainer}
           style={{marginTop: '2em'}}
         >
          <MauAutocomplete
            error={!!errors.supplier_id}
            label={'Proveedor'}
            placeholder={'Proveedor x'}
            id={'supplierLabel'}
            options={props.suppliers}
            name={'supplier_id'}
            displayName={'name'}
            rules={
              {
                required: "this is required",
                validate: (value) => {
                  return value !== 'null'
                }
              }
            }
            control={control}
            defaultValue={`${props.expense.supplier_id}`}
          />
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauObjectSelect
            error={!!errors.expense_invoice_payment_method_id}
            label={'Metodo de pago'}
            id={'paymentMethodLabel'}
            options={props.paymentMethods}
            name={'expense_invoice_payment_method_id'}
            rules={
              {
                required: "this is required",
                validate: (value) => {
                  return value !== 'null'
                }
              }
            }
            control={control}
            defaultValue={`${props.expense.expense_invoice_payment_method_id}`}
          />
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
              <Toolbar>
                <Typography className={classes.tableTitle} variant="h6" id="tableTitle" component="div">
                  Elementos del gasto
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton aria-label="filter list" onClick={() => {handleAddExpenseItem()}}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{display: 'none'}}>Id</TableCell>
                      <TableCell style={{width: '40%'}}>Rubro</TableCell>
                      <TableCell style={{width: '20%'}}>Sucursal</TableCell>
                      <TableCell style={{width: '15%'}}>Total</TableCell>
                      <TableCell style={{width: '15%'}}>Cantidad</TableCell>
                      <TableCell style={{width: '10%'}}>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseItems.fields.map((expenseItem, index) => (
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

                            <ExpenseSubcategoriesSelect
                              name={`expense_items[${index}].expense_subcategory_id`}
                              label={'Rubro'}
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
                        <TableCell>

                          <MauObjectSelect
                            error={!!errors.branch_id}
                            label={'Sucursal'}
                            id={'branchLabel'}
                            options={props.branches}
                            name={`expense_items[${index}].branch_id`}
                            rules={
                              {
                                required: "this is required",
                                validate: (value) => {
                                  return value !== 'null'
                                }
                              }
                            }
                            control={control}
                            defaultValue={`${expenseItem.branch_id}`}
                          />

                        </TableCell>
                        <TableCell>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_items[${index}].subtotal`}
                            defaultValue={`${expenseItem.subtotal}`}
                            inputRef={register({required: true, max: 10000000})}
                            onChange={(e) => {
                              handleSubtotalChange(e)
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            style={{display: !isQuantityRequired(index) ? 'none' : 'inherit'}}
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_items[${index}].quantity`}
                            defaultValue={`${expenseItem.quantity}`}
                            inputRef={register({required: isQuantityRequired(index), max: 10000000})}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton onClick={() => {handleRemoveExpenseItem(index)}}>
                                <DeleteIcon />
                              </IconButton> : ' '
                          }
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>



        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: !isDifferedPaymentMethod ? 'none' : 'inherit'}}
        >
          <Grid
            container
            direction={'column'}
          >
            <Grid
              item
              xs={12}
            >
              <Toolbar>
                <Typography className={classes.tableTitle} variant="h6" id="tableTitle" component="div">
                  Complementos
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton aria-label="filter list" onClick={() => {handleAddComplement()}}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
              <TableContainer component={Paper}>
                <Table
                  aria-label="complements table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{display: 'none'}}>Id</TableCell>
                      <TableCell style={{width: '10%'}}>Completado</TableCell>
                      <TableCell style={{width: '70%'}}>Nombre</TableCell>
                      <TableCell style={{width: '10%'}}>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {complements.fields.map((complement, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_invoice_complements[${index}].id`}
                            defaultValue={`${complement.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Controller
                              id={`expense_invoice_complements[${index}].delivered`}
                              name={`expense_invoice_complements[${index}].delivered`}
                              control={control}
                              defaultValue={complement.delivered}
                              render={(props) => (
                                <Switch
                                  onChange={(e) => props.onChange(e.target.checked)}
                                  checked={props.value}
                                />
                              )}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align="right">
                          <FormControl fullWidth>
                            <TextField
                              id="standard-number"
                              label="Number"
                              name={`expense_invoice_complements[${index}].name`}
                              defaultValue={`${complement.name}`}
                              inputRef={register()}
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton onClick={() => {handleRemoveComplement(index)}}>
                                <DeleteIcon />
                              </IconButton> : ' '
                          }
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: !isExpenseProductsRequired() ? 'none' : 'inherit'}}
        >
          <Grid
            container
            direction={'column'}
          >
            <Grid
              item
              xs={12}
            >
              <Toolbar>
                <Typography className={classes.tableTitle} variant="h6" id="tableTitle" component="div">
                  Productos
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton aria-label="filter list" onClick={() => {handleAddExpenseProduct()}}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
              <TableContainer component={Paper}>
                <Table
                  aria-label="complements table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{display: 'none'}}>Id</TableCell>
                      <TableCell style={{width: '30%'}}>Producto</TableCell>
                      <TableCell style={{width: '10%'}}>Bultos</TableCell>
                      <TableCell style={{width: '10%'}}>Kilos</TableCell>
                      <TableCell style={{width: '10%'}}>Precio</TableCell>
                      <TableCell style={{width: '10%'}}>Peso</TableCell>
                      <TableCell style={{width: '10%'}}>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseProducts.fields.map((expenseProduct, index) => (
                      <TableRow key={index}>
                         <TableCell style={{display: 'none'}}>
                            <TextField
                              id="standard-number"
                              label="Number"
                              type="number"
                              name={`expense_products[${index}].id`}
                              defaultValue={`${expenseProduct.id}`}
                              inputRef={register()}
                            />
                        </TableCell>
                        <TableCell>
                          <MauObjectSelect
                            error={!!errors.expense_products && !!errors.expense_products[index]}
                            label={'Producto'}
                            id={'productLabel'}
                            options={props.products}
                            displayName={'description'}
                            onChange={(e) => {
                              handleProductSelection(e, index)
                            }}
                            name={`expense_products[${index}].product_id`}
                            rules={
                              {
                                required: "this is required",
                                validate: (value) => {
                                  return value !== 'null'
                                }
                              }
                            }
                            control={control}
                            defaultValue={`${expenseProduct.product_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            id="groups"
                            label="Bultos"
                            type="number"
                            name={`expense_products[${index}].groups`}
                            onChange={(e) => {
                              if(hasGroupWeight(index)) {
                                calculateExpenseProductKilos(e, index)
                              }
                            }}
                            defaultValue={`${expenseProduct.groups}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            id="Kilos"
                            label="Kilos"
                            type="number"
                            disabled={hasGroupWeight(index)}
                            name={`expense_products[${index}].kilos`}
                            defaultValue={`${expenseProduct.kilos}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            id="kilo_price"
                            label="Precio por kilo"
                            type="number"
                            name={`expense_products[${index}].kilo_price`}
                            defaultValue={`${expenseProduct.kilo_price}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            id="group_weight"
                            label="Peso por kilo"
                            disabled
                            type="number"
                            name={`expense_products[${index}].group_weight`}
                            defaultValue={`${expenseProduct.group_weight}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton onClick={() => {handleRemoveExpenseProduct(index)}}>
                                <DeleteIcon />
                              </IconButton> : ' '
                          }
                        </TableCell>
                      </TableRow>

                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>




        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: !isInvoice ? 'none' : 'inherit'}}
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
                  name="invoice_tax_retained"
                  label="IVA retenido"
                />
              </FormControl>
            </Grid> :
            null
        }

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
                  name="invoice_isr_retained"
                  label="IVA retenido"
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
              onClick={handleSubmit(onSubmit, onError)}
            >
              {success ? <CheckIcon /> : <SaveIcon />}
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
    expenseCategories: state.expenses.expenseCategories,
    expenseTypes: state.expenses.expenseTypes,
    branches: state.general.branches,
    paymentMethods: state.expenses.paymentMethods,
    products: state.production.products.filter((product) => product.product_type_id === 4)
  }
}

export default connect(mapStateToProps, null)(ExpenseForm)