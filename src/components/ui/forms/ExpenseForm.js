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
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import MauDatePicker from './inputs/MauDatePicker'
import InputLabel from '@material-ui/core/InputLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

import ExpenseSubcategoriesSelect from './inputs/ExpenseSubcategoriesSelect'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import moment from 'moment'
import FormLabel from '@material-ui/core/FormLabel'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import MauAutocomplete from './inputs/MauAutocomplete'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import formatNumber from '../../../helpers/formatNumber'
import MauNumber from './inputs/MauNumber'


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
  const [isDatePaidRequired, setIsDatePaidRequired] = React.useState(
    props.expense ? moment(props.expense.date_paid).isValid() : true
  );
  const [isDateEmittedRequired, setIsDateEmittedRequired] = React.useState(
    props.expense ? moment(props.expense.date_emitted).isValid() : true
  );
  const [isDateRefundedRequired, setIsDateRefundedRequired] = React.useState(
    props.expense ? moment(props.expense.date_refunded).isValid() : true
  );
  // const [isProvisionDateRequired, setIsProvisionDateRequired] = React.useState(
  //   props.expense ? moment(props.expense.invoice_provision_date).isValid() : false
  // );

  const [isSupplierTableVisible, setIsSupplierTableVisible] = React.useState(false)

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

  const defaultExpenseItem = {
    expense_subcategory_id: '',
    subtotal: "0",
    branch_id: '',
    description: ''
  }

  const defaultExpenseProduct = {
    product_id: "null",
    kilos: "0",
    groups: "0",
    group_weight: "0",
    kilo_price: "0",
    _tax: "0",
    _total: "0"
  }

  const defaultValues = {
    id: props.expense ? props.expense.id : '',
    expense_items: props.expense ? props.expense.expense_items : [defaultExpenseItem],
    expense_invoice_complements: props.expense ? props.expense.expense_invoice_complements.map(complement => {
      return {...complement, delivered: complement.delivered === 1}
    }) : [],
    comments: props.expense ? props.expense.comments : '',
    tax: props.expense ? props.expense.tax : '0',
    invoice_isr_retained: props.expense ? props.expense.invoice_isr_retained : '0',
    invoice_tax_retained: props.expense ? props.expense.invoice_tax_retained : '0',
    supplier_id: props.expense ? String(props.expense.supplier_id) : 'null',
    // invoice_provision_date: props.expense ? props.expense.invoice_provision_date : '',
    date_emitted: props.expense ? props.expense.date_emitted : '',
    date_paid: props.expense ? props.expense.date_paid : '',
    date_refunded: props.expense ? props.expense.date_refunded: '',
    invoice_code: props.expense ? props.expense.invoice_code : '',
    internal_code: props.expense ? props.expense.internal_code : '',
    expense_type_id: props.expense ? String(props.expense.expense_type_id) : '',
    expense_invoice_payment_method_id: props.expense ? String(props.expense.expense_invoice_payment_method_id) : '',
    expense_invoice_payment_form_id: props.expense ? String(props.expense.expense_invoice_payment_form_id) : '',
    // expense_invoice_cdfi_use_id: props.expense ? String(props.expense.expense_invoice_cdfi_use_id) : '',
    expense_money_source_id: props.expense ? String(props.expense.expense_money_source_id) : '',
    expense_products: props.expense ? props.expense.expense_products.map(expenseProduct => {
      return {
        ...expenseProduct,
        _kilos: expenseProduct.kilos,
        _total: expenseProduct ? (expenseProduct.kilos * expenseProduct.kilo_price * 1.16) : 0,
        _tax: expenseProduct ? (expenseProduct.kilos * expenseProduct.kilo_price * 0.16) : 0
      }
    }) : [{...defaultExpenseProduct}],
    expense_credit_notes: props.expense ? props.expense.expense_credit_notes : []
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


  const expenseCreditNotes = useFieldArray(
    {
      control,
      name: "expense_credit_notes"
    }
  );

  const watchExpenseItems = watch('expense_items')
  const watchExpenseType = watch('expense_type_id')
  const watchPaymentMethod = watch('expense_invoice_payment_method_id')
  const watchPaymentForm = watch('expense_invoice_payment_form_id')
  const watchExpenseProducts = watch('expense_products')
  const watchSupplierId = watch('supplier_id')

  const supplierId = isNaN(watchSupplierId) ? 0 : watchSupplierId

  const supplierExpenses = useFetch(apiUrl +
    'expense/list?paginate=false&filter_exact_1=supplier_id&filter_exact_value_1=' +
    supplierId) || []


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

  let isCash = false
  let isTransfer = false

  if (watchPaymentForm === '1') {
    isCash = true
  } else if (watchPaymentForm === '3') {
    isTransfer = true
  }

  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);

    let complements = isDifferedPaymentMethod && isInvoice && data.expense_invoice_complements ? data.expense_invoice_complements
      .map(complement => {
        return {...complement, delivered: (complement.delivered ? '1' : '-1')}
      }) : []

    console.log(data.date_refunded)

    let datePaid =  isDatePaidRequired ? data.date_paid : '0000-00-00'

    let finalSubmitted = {
      ...data,
      tax: isInvoice ? data.tax : '0',
      invoice_tax_retained: isInvoice ? data.invoice_tax_retained : '0',
      invoice_isr_retained: isInvoice ? data.invoice_isr_retained : '0',
      invoice_code: isInvoice ? data.invoice_code : '',
      internal_code: isInvoice ? data.internal_code : '',
      date_paid: datePaid,
      // invoice_provision_date: isProvisionDateRequired && isInvoice ? data.invoice_provision_date : '0000-00-00',
      date_emitted: isDateEmittedRequired && isInvoice && isTransfer ? data.date_emitted : datePaid,
      date_refunded: isDateRefundedRequired && isInvoice && isCash ? data.date_refunded : '0000-00-00',
      expense_invoice_complements: complements,
      expense_products: isExpenseProductsRequired() && data.expense_products && data.expense_products.length > 0
        ? data.expense_products : [],
      expense_credit_notes: isInvoice && data.expense_credit_notes ? data.expense_credit_notes : [],
      expense_invoice_payment_method_id: isInvoice ? String(data.expense_invoice_payment_method_id) : 'null',
      expense_invoice_payment_form_id: isInvoice ? String(data.expense_invoice_payment_form_id) : 'null',
      // expense_invoice_cdfi_use_id: isInvoice ? String(data.expense_invoice_cdfi_use_id) : 'null',
      expense_money_source_id: isInvoice ? String(data.expense_money_source_id) : 'null',
      defaultValues
    }

    props.onSubmit(finalSubmitted, onSubmitCallback)
  };

  const onError = data => {
    console.log(data)
  }

  const onSubmitCallback = (isValid) => {
    console.log('On submit callback')
    console.log(isValid)
    setSuccess(true);
    setLoading(false);
  }

  const handleAddExpenseItem = () => {
    expenseItems.append(defaultExpenseItem)
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
    expenseProducts.append({
      product_id: "null",
      kilos: "0",
      groups: "0",
      group_weight: "0",
      kilo_price: "0",
      _tax: "0",
      _total: "0"
    })
  }

  const handleRemoveExpenseProduct = (index) => {
    expenseProducts.remove(index)
  }


  const handleAddExpenseCreditNotes = () => {
    expenseCreditNotes.append({amount: "0", date: ""})
  }

  const handleRemoveExpenseCreditNotes = (index) => {
    expenseCreditNotes.remove(index)
  }

  const handleProductSelection = (productId, index) => {
    let groupWeight = "0"
    let kiloPrice = "0"
    let kilos = "0"
    let groups = "0"
    let _total = "0"
    let _tax = "0"

    let initialExpenseProduct = defaultValues.expense_products.find(expenseProduct => {
      return String(productId) === String(expenseProduct.product_id)
    })

    let isSameInitialProduct =
      initialExpenseProduct
      && String(initialExpenseProduct.product_id) === productId

    if (!isSameInitialProduct) {
      let product = props.products.find(product => {
        return String(product.id) === productId
      })
      groupWeight = product.current_group_weight ? product.current_group_weight : "0"
      kiloPrice = product.current_kilo_price
      kilos = "0"
      groups = "0"
      _total = "0"
      _tax = "0"
    } else {
      groupWeight = initialExpenseProduct.group_weight
      kiloPrice = initialExpenseProduct.kilo_price
      kilos = initialExpenseProduct.kilos
      groups = initialExpenseProduct.groups
      _total = initialExpenseProduct.kilos * initialExpenseProduct.group_weight * 1.16
      _tax = initialExpenseProduct.kilos * initialExpenseProduct.group_weight * 0.16
    }
    setValue(`expense_products[${index}].group_weight`, String(groupWeight))
    setValue(`expense_products[${index}].kilo_price`, String(kiloPrice))
    setValue(`expense_products[${index}].kilos`, String(kilos))
    setValue(`expense_products[${index}].groups`, String(groups))
    setValue(`expense_products[${index}]._total`, String(_total))
    setValue(`expense_products[${index}]._tax`, String(_tax))
  }

  const calculateExpenseProductWithGroups = (groups, index) => {
    let kilos = Number(groups) * Number(watchExpenseProducts[index].group_weight)
    setValue(`expense_products[${index}].kilos`, String(kilos))
    let _total = Number(kilos) * Number(watchExpenseProducts[index].kilo_price) * 1.16
    let _tax = Number(kilos) * Number(watchExpenseProducts[index].kilo_price) * 0.16
    setValue(`expense_products[${index}]._total`, String(Math.trunc(_total)))
    setValue(`expense_products[${index}]._tax`, String(Math.trunc(_tax)))
  }

  const calculateExpenseProductWithKilos = (kilos, index) => {
    let _total = Number(kilos) * Number(watchExpenseProducts[index].kilo_price)
    let _tax = Number(kilos) * Number(watchExpenseProducts[index].kilo_price) * 0.16
    setValue(`expense_products[${index}]._total`, String(Math.trunc(_total)))
    setValue(`expense_products[${index}]._tax`, String(Math.trunc(_tax)))
  }

  const calculateExpenseProductWithKiloPrice = (kiloPrice, index) => {
    let _total = Number(watchExpenseProducts[index].kilos) * Number(kiloPrice)
    let _tax = Number(watchExpenseProducts[index].kilos) * Number(kiloPrice) * 0.16
    setValue(`expense_products[${index}]._total`, String(Math.trunc(_total)))
    setValue(`expense_products[${index}]._tax`, String(Math.trunc(_tax)))
  }

  const hasGroupWeight = (index) => {
    let expenseProduct = watchExpenseProducts[index]
    return expenseProduct && expenseProduct.group_weight !== "0"
  }

  const handleSubtotalChange = (subtotal, index) => {
    let _total = 0
    if (watchExpenseItems && watchExpenseItems.length > 0) {
      watchExpenseItems.forEach((item, itemIndex) => {
        if (itemIndex === index) {
          _total += Number(subtotal)
        } else {
          _total += Number(watchExpenseItems[itemIndex].subtotal)
        }
      })
    }
    setValue('tax', _total * 0.16)
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
          style={{marginTop: '2em', display: 'none'}}
        >
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register()}
              type="number"
              name="id"
              label="id"
            />
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <InputLabel
            error={errors.expense_type_id}
          >
            Tipo de gasto
          </InputLabel>
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
                      control={<Radio/>}
                      label={expenseType.name}
                    />
                  )
                })}
              </RadioGroup>
            }
            name="expense_type_id"
            control={control}
            rules={{
              required: true
            }}
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

          <Grid
            item
            xs
          >
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
          <Grid
            item
            xs
            style={{
              marginTop: '0.5em',
              display: !isDatePaidRequired ? 'none' : 'inherit'
            }}
          >
            <MauDatePicker
              name="date_paid"
              control={control}
              rules={{required: isDatePaidRequired}}
              error={errors.date_paid}
              helperText={errors.date_paid && errors.date_paid.message}
              defaultValue={defaultValues.date_paid}
              label="Fecha de pago"
            />
          </Grid>
        </Grid>

        {/*<Grid*/}
        {/*  item*/}
        {/*  container*/}
        {/*  xs={12}*/}
        {/*  className={classes.rowContainer}*/}
        {/*  direction={'column'}*/}
        {/*  style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}*/}
        {/*>*/}
        {/*  <Grid*/}
        {/*    item*/}
        {/*    xs*/}
        {/*  >*/}
        {/*    <FormControl>*/}
        {/*      <FormLabel component="legend">*/}
        {/*        ¿Fue provisionada?*/}
        {/*      </FormLabel>*/}
        {/*      <FormControlLabel*/}
        {/*        control={*/}
        {/*          <Switch*/}
        {/*            checked={isProvisionDateRequired}*/}
        {/*            onChange={() => {*/}
        {/*              setIsProvisionDateRequired(!isProvisionDateRequired)*/}
        {/*            }}*/}
        {/*            name="provisionDateRequired"*/}
        {/*            color="primary"*/}
        {/*          />*/}
        {/*        }*/}
        {/*        label={isProvisionDateRequired ? 'Provisionada' : 'No fue provisionada'}*/}
        {/*      />*/}
        {/*    </FormControl>*/}
        {/*  </Grid>*/}
        {/*  <Grid*/}
        {/*    item*/}
        {/*    xs*/}
        {/*    style={{*/}
        {/*      marginTop: '0.5em',*/}
        {/*      display: !isProvisionDateRequired ? 'none' : 'inherit'*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <MauDatePicker*/}
        {/*      name="invoice_provision_date"*/}
        {/*      control={control}*/}
        {/*      rules={{required: isProvisionDateRequired && isInvoice}}*/}
        {/*      error={!!errors.invoice_provision_date}*/}
        {/*      helperText={errors.invoice_provision_date && errors.invoice_provision_date.message}*/}
        {/*      defaultValue={defaultValues.invoice_provision_date}*/}
        {/*      label="Fecha de provisión"*/}
        {/*    />*/}
        {/*  </Grid>*/}
        {/*</Grid>*/}

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                required: isInvoice
              })}
              name="internal_code"
              label="Codigo interno"
              InputLabelProps={{
                shrink: true
              }}
              placeholder="14 o 35A o 15 y 16 "
            />
          </FormControl>
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                required: isInvoice
              })}
              name="invoice_code"
              label="Codigo de la factura"
              placeholder="CON 770707 "
              InputLabelProps={{
                shrink: true
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
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.supplier_id}`}
          />
        </Grid>

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
                <Grid
                  container
                  justify={'space-between'}
                >
                  <Grid item>
                    <Typography
                      className={classes.tableTitle}
                      variant="h6"
                      id="tableTitle"
                      component="div"
                    >
                      Gastos previos del proveedor
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Filter list">
                      <IconButton
                        aria-label="filter list"
                        onClick={() => {
                          setIsSupplierTableVisible(!isSupplierTableVisible)
                        }}
                      >
                        {
                          isSupplierTableVisible ?
                            <VisibilityOffIcon/> :
                            <VisibilityIcon/>
                        }
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
            </Grid>
            <Grid
              item
              xs={12}
              style={{display: isSupplierTableVisible ? 'inherit' : 'none'}}
            >
              <TableContainer component={Paper}>
                <Table
                  aria-label="simple table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha de pago</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Rubros</TableCell>
                      <TableCell>Importe (total)</TableCell>
                      <TableCell>Descripciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplierExpenses.map((expense, index) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.date_paid}</TableCell>
                        <TableCell>{expense.expense_type.name}</TableCell>
                        <TableCell>
                          {
                            expense.expense_items
                            .reduce((acc, expenseItem, index) => {
                              return acc + (index === 0 ?
                                expenseItem.expense_subcategory.name :
                                ', ' + expenseItem.expense_subcategory.name)
                            }, '')
                          }
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            formatNumber(expense.expense_items
                              .reduce((acc, expenseItem, index) => {
                                return acc + expenseItem.subtotal
                              }, 0))
                          }
                        </TableCell>
                        <TableCell>
                          {
                            expense.expense_items
                              .reduce((acc, expenseItem, index) => {
                                return acc + (index === 0 ?
                                  expenseItem.description :
                                  ', ' + expenseItem.description)
                              }, '')
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
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauAutocomplete
            error={!!errors.expense_invoice_payment_method_id}
            label={'Metodo de pago'}
            id={'paymentMethodLabel'}
            options={props.paymentMethods}
            name={'expense_invoice_payment_method_id'}
            displayName={'name'}
            rules={
              {
                required: isInvoice
              }
            }
            control={control}
            defaultValue={`${defaultValues.expense_invoice_payment_method_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauAutocomplete
            error={!!errors.expense_invoice_payment_form_id}
            label={'Forma de pago'}
            id={'paymentFrom'}
            options={props.paymentForms}
            name={'expense_invoice_payment_form_id'}
            displayName={'name'}
            rules={
              {
                required: isInvoice
              }
            }
            control={control}
            defaultValue={`${defaultValues.expense_invoice_payment_form_id}`}
          />
        </Grid>

        <Grid
          item
          container
          xs={12}
          className={classes.rowContainer}
          direction={'column'}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <Grid
            item
            xs
          >
            <FormControl>
              <FormLabel component="legend">
                ¿Ya se emitió?
              </FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDateEmittedRequired}
                    onChange={() => {
                      setIsDateEmittedRequired(!isDateEmittedRequired)
                    }}
                    name="dateEmittedRequired"
                    color="primary"
                  />
                }
                label={isDateEmittedRequired ? 'Emitida' : 'Pendiente'}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs
            style={{
              marginTop: '0.5em',
              display: !isDateEmittedRequired ? 'none' : 'inherit'
            }}
          >
            <MauDatePicker
              name="date_emitted"
              control={control}
              rules={{required: isDateEmittedRequired && isInvoice}}
              error={!!errors.date_emitted}
              helperText={errors.date_emitted && errors.date_emitted.message}
              defaultValue={defaultValues.date_emitted}
              label="Fecha de emisión"
            />
          </Grid>
        </Grid>


        <Grid
          item
          container
          xs={12}
          className={classes.rowContainer}
          direction={'column'}
          style={{marginTop: '2em', display: isInvoice && isCash? 'inherit' : 'none'}}
        >
          <Grid
            item
            xs
          >
            <FormControl>
              <FormLabel component="legend">
                ¿Ya se reembolso?
              </FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDateRefundedRequired}
                    onChange={() => {
                      setIsDateRefundedRequired(!isDateRefundedRequired)
                    }}
                    name="dateRefundedRequired"
                    color="primary"
                  />
                }
                label={isDateRefundedRequired ? 'Rembolsada' : 'Pendiente'}
              />
            </FormControl>
          </Grid>
          <Grid
            item
            xs
            style={{
              marginTop: '0.5em',
              display: !isDateRefundedRequired ? 'none' : 'inherit'
            }}
          >
            <MauDatePicker
              name="date_refunded"
              control={control}
              rules={{required: isDateRefundedRequired && isInvoice && isCash}}
              error={!!errors.date_refunded}
              helperText={errors.date_refunded && errors.date_refunded.message}
              defaultValue={defaultValues.date_refunded}
              label="Fecha de reembolso"
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauAutocomplete
            error={!!errors.expense_money_source_id}
            label={'Banco'}
            id={'moneySource'}
            options={props.moneySources}
            name={'expense_money_source_id'}
            displayName={'name'}
            rules={
              {
                required: isInvoice
              }
            }
            control={control}
            defaultValue={`${defaultValues.expense_money_source_id}`}
          />
        </Grid>

        {/*<Grid*/}
        {/*  item*/}
        {/*  xs={12}*/}
        {/*  className={classes.rowContainer}*/}
        {/*  style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}*/}
        {/*>*/}
        {/*  <MauAutocomplete*/}
        {/*    error={!!errors.expense_invoice_cdfi_use_id}*/}
        {/*    label={'Usos del cdfi'}*/}
        {/*    id={'cdfiUses'}*/}
        {/*    options={props.cdfiUses}*/}
        {/*    name={'expense_invoice_cdfi_use_id'}*/}
        {/*    displayName={'name'}*/}
        {/*    rules={*/}
        {/*      {*/}
        {/*        required: isInvoice*/}
        {/*      }*/}
        {/*    }*/}
        {/*    control={control}*/}
        {/*    defaultValue={`${defaultValues.expense_invoice_cdfi_use_id}`}*/}
        {/*  />*/}
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
                <Grid
                  container
                  justify={'space-between'}
                >
                  <Grid item>
                    <Typography
                      className={classes.tableTitle}
                      variant="h6"
                      id="tableTitle"
                      component="div"
                    >
                      Elementos del gasto
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Tooltip title="Filter list">
                      <IconButton
                        aria-label="filter list"
                        onClick={() => {
                          handleAddExpenseItem()
                        }}
                      >
                        <AddIcon/>
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>
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
                      <TableCell style={{width: '40%'}}>Rubro</TableCell>
                      <TableCell style={{width: '12%'}}>Sucursal</TableCell>
                      <TableCell style={{width: '12%'}}>Descripción</TableCell>
                      <TableCell style={{width: '12%'}}>Importe (neto)</TableCell>
                      <TableCell style={{width: '12%'}}>Cantidad</TableCell>
                      <TableCell style={{width: '12%'}}>&nbsp;</TableCell>
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
                        </TableCell>

                        <TableCell>
                          <MauAutocomplete
                            error={
                              errors.expense_items
                              && errors.expense_items[index]
                              && errors.expense_items[index].branch_id
                              ? errors.expense_items[index].branch_id : false}
                            label={'Sucursal'}
                            id={'branchLabel'}
                            options={props.branches}
                            name={`expense_items[${index}].branch_id`}
                            rules={
                              {
                                required: "this is required"
                              }
                            }
                            control={control}
                            defaultValue={`${expenseItem.branch_id}`}
                          />
                        </TableCell>

                        <TableCell>
                          <TextField
                            id="standard-description"
                            label="Descripcion"
                            type="text"
                            name={`expense_items[${index}].description`}
                            defaultValue={`${expenseItem.description}`}
                            inputRef={register({required: true})}
                          />
                        </TableCell>

                        <TableCell>
                          <MauNumber
                            label="Importe"
                            error={
                              errors.expense_items
                              && errors.expense_items[index]
                              && errors.expense_items[index].subtotal
                            }
                            name={`expense_items[${index}].subtotal`}
                            control={control}
                            defaultValue={`${expenseItem.subtotal}`}
                            rules={{required: true, max: 10000000}}
                            onChange={(subtotal) => {
                              handleSubtotalChange(subtotal, index)
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <MauNumber
                            style={{display: isQuantityRequired(index) ? 'inherit' : 'none'}}
                            label="Cantidad"
                            error={
                              errors.expense_items
                              && errors.expense_items[index]
                              && errors.expense_items[index].quantity
                            }
                            name={`expense_items[${index}].quantity`}
                            control={control}
                            defaultValue={`${expenseItem.quantity}`}
                            rules={{
                              required: isQuantityRequired(index),
                              max: 10000000
                            }}
                          />
                        </TableCell>

                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveExpenseItem(index)
                                }}
                              >
                                <DeleteIcon/>
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
          style={{
            marginTop: '2em',
            display: isDifferedPaymentMethod && isInvoice ? 'inherit' : 'none'
          }}
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
                <Typography
                  className={classes.tableTitle}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Complementos
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddComplement()
                    }}
                  >
                    <AddIcon/>
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
                              <IconButton
                                onClick={() => {
                                  handleRemoveComplement(index)
                                }}
                              >
                                <DeleteIcon/>
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
          style={{
            marginTop: '2em',
            display: isExpenseProductsRequired() ? 'inherit' : 'none'
          }}
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
                <Typography
                  className={classes.tableTitle}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Productos
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddExpenseProduct()
                    }}
                  >
                    <AddIcon/>
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
                      <TableCell style={{width: '10%'}}>Iva</TableCell>
                      <TableCell style={{width: '10%'}}>Total</TableCell>
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
                          <MauAutocomplete
                            error={!!errors.expense_products && !!errors.expense_products[index].product_id}
                            label={'Producto'}
                            id={'productLabel'}
                            options={props.products}
                            displayName={'description'}
                            onChange={(e, productId) => {
                              handleProductSelection(productId, index)
                            }}
                            name={`expense_products[${index}].product_id`}
                            rules={
                              {
                                required: "this is required",
                              }
                            }
                            control={control}
                            defaultValue={`${expenseProduct.product_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.expense_products && !!errors.expense_products[index] && !!errors.expense_products[index].groups}
                            label="Bultos"
                            name={`expense_products[${index}].groups`}
                            onChange={(groups) => {
                              if (hasGroupWeight(index)) {
                                calculateExpenseProductWithGroups(groups, index)
                              }
                            }}
                            control={control}
                            defaultValue={`${expenseProduct.groups}`}
                            rules={{required: true, max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            label="Kilos"
                            onChange={(kilos) => {
                              calculateExpenseProductWithKilos(kilos, index)
                            }}
                            disabled={hasGroupWeight(index)}
                            name={`expense_products[${index}].kilos`}
                            control={control}
                            defaultValue={`${expenseProduct.kilos}`}
                            rules={{required: true, max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            label="Precio por kilo"
                            type="number"
                            name={`expense_products[${index}].kilo_price`}
                            onChange={(kilos) => {
                              calculateExpenseProductWithKiloPrice(kilos, index)
                            }}
                            control={control}
                            defaultValue={`${expenseProduct.kilo_price}`}
                            rules={{required: true, max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            label="Peso por kilo"
                            disabled
                            type="number"
                            name={`expense_products[${index}].group_weight`}
                            control={control}
                            defaultValue={`${expenseProduct.group_weight}`}
                            rules={{max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            id="tax"
                            label="IVA"
                            disabled
                            name={`expense_products[${index}]._tax`}
                            control={control}
                            defaultValue={`${expenseProduct._tax}`}
                            rules={{max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            label="Total"
                            disabled
                            type="number"
                            name={`expense_products[${index}]._total`}
                            control={control}
                            defaultValue={`${expenseProduct._total}`}
                            rules={{max: 10000000}}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveExpenseProduct(index)
                                }}
                              >
                                <DeleteIcon/>
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
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
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
                <Typography
                  className={classes.tableTitle}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Notas de credito
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddExpenseCreditNotes()
                    }}
                  >
                    <AddIcon/>
                  </IconButton>
                </Tooltip>
              </Toolbar>
              <TableContainer component={Paper}>
                <Table
                  aria-label="credit notes table"
                  className={classes.table}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{display: 'none'}}>Id</TableCell>
                      <TableCell style={{width: '40%'}}>Fecha</TableCell>
                      <TableCell style={{width: '40%'}}>Nombre</TableCell>
                      <TableCell style={{width: '10%'}}>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenseCreditNotes.fields.map((creditNote, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`expense_credit_notes[${index}].id`}
                            defaultValue={`${creditNote.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauDatePicker
                            error={!!errors.expense_credit_notes && !!errors.expense_credit_notes[index] && !!errors.expense_credit_notes[index].date}
                            name={`expense_credit_notes[${index}].date`}
                            control={control}
                            rules={{required: true}}
                            defaultValue={`${creditNote.date}`}
                            label="Fecha del complemento"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MauNumber
                            label="Monto"
                            error={!!errors.expense_credit_notes && !!errors.expense_credit_notes[index] && !!errors.expense_credit_notes[index].amount}
                            name={`expense_credit_notes[${index}].amount`}
                            defaultValue={`${creditNote.amount}`}
                            control={control}
                            rules={{required: true}}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          <IconButton
                            onClick={() => {
                              handleRemoveExpenseCreditNotes(index)
                            }}
                          >
                            <DeleteIcon/>
                          </IconButton>
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
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauNumber
            label="IVA"
            error={!!errors.tax}
            name={'tax'}
            control={control}
            defaultValue={defaultValues.tax}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauNumber
            label="IVA"
            error={!!errors.invoice_tax_retained}
            name={'invoice_tax_retained'}
            control={control}
            defaultValue={defaultValues.invoice_tax_retained}
            rules={{
              required: isInvoice
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isInvoice ? 'inherit' : 'none'}}
        >
          <MauNumber
            label="IVA"
            error={!!errors.invoice_isr_retained}
            name={'invoice_isr_retained'}
            control={control}
            defaultValue={defaultValues.invoice_isr_retained}
            rules={{
              required: isInvoice
            }}
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
            <TextField
              inputRef={register()}
              name="comments"
              label="Comentarios"
              placeholder=""
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
        </Grid>

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
    expenseCategories: state.expenses.expenseCategories,
    expenseTypes: state.expenses.expenseTypes,
    branches: state.general.branches,
    paymentMethods: state.expenses.paymentMethods,
    paymentForms: state.expenses.paymentForms,
    moneySources: state.expenses.moneySources,
    cdfiUses: state.expenses.cdfiUses,
    products: state.production.products.filter((product) => product.product_type_id === 4)
  }
}

export default connect(mapStateToProps, null)(ExpenseForm)

