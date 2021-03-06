import Grid from '@material-ui/core/Grid'
import React from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {useFieldArray, useForm} from "react-hook-form";
import {green} from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField'
import axios from 'axios'
import authHeader from '../../../helpers/authHeader'
import apiUrl from '../../../helpers/apiUrl'
import MauDatePicker from './inputs/MauDatePicker'
import MauAutocomplete from './inputs/MauAutocomplete'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import TableContainer from '@material-ui/core/TableContainer'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import DeleteIcon from '@material-ui/icons/Delete'
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


const OrderSaleForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  let defaultSaleProduct = {
    id: '',
    product_id: '',
    kilos: '0',
    groups: '0',
    tax: '0',
    total: '0',
    kilo_price: '0',
    group_weight: '0',
    type: ''
  }

  let defaultOrderSalePayment = {
    id: '',
    date_paid: '',
    order_sale_collection_status_id: '',
    amount: ''
  }

  let soldSaleProducts = []

  if (props.orderRequest) {

    soldSaleProducts = props.orderRequest.order_request_products
      .map(requestProduct => {
        return {
          ...requestProduct,
          kilos_sold: 0,
          kilos_remaining: requestProduct.kilos,
          groups_sold: 0,
          groups_remaining: requestProduct.groups
        }
      })

    props.orderRequest.order_sales.forEach(orderSale => {
      if (!(props.orderSale && props.orderSale.id && props.orderSale.id === orderSale.id)) {
        orderSale.order_sale_products.forEach(saleProduct => {
          let soldSaleProduct = soldSaleProducts.find(soldSaleProduct => {
            return String(soldSaleProduct.product_id) === String(saleProduct.product_id)
          })
          if (soldSaleProduct) {
            soldSaleProduct.kilos_remaining = soldSaleProduct.kilos_remaining - saleProduct.kilos
            soldSaleProduct.groups_remaining = soldSaleProduct.groups_remaining - saleProduct.groups
          }
        })
      }
    })
  }

  const defaultValues = {
    id: props.orderSale ? props.orderSale.id : '',
    order_code: props.orderSale ? props.orderSale.order_code : '',
    date: props.orderSale ? props.orderSale.date : '',
    order_sale_receipt_type_id: props.orderSale ? String(props.orderSale.order_sale_receipt_type_id) : '',
    client_id: props.orderSale ? String(props.orderSale.order_request.client_id) : props.orderRequest ? String(props.orderRequest.client_id) : '',
    order_sale_status_id: props.orderSale ? String(props.orderSale.order_sale_status_id) : '',
    order_sale_payments: props.orderSale ? props.orderSale.order_sale_payments : [{...defaultOrderSalePayment}],
    order_sale_products: props.orderSale ? props.orderSale.order_sale_products
        .map(saleProduct => {
          return {
            ...saleProduct,
            kilos: String(saleProduct.kilos),
            groups: String(saleProduct.groups),
            group_weight: String(saleProduct.group_weight),
            kilo_price: String(saleProduct.kilo_price),
            total: String(saleProduct.kilos * saleProduct.kilo_price),
            tax: String(Math.trunc(saleProduct.kilos * saleProduct.kilo_price * 0.16))
          }
        })
      : props.orderRequest ? props.orderRequest.order_request_products
        .map(requestProduct => {
          let soldSaleProduct = soldSaleProducts.find(soldSaleProduct => {
            return String(requestProduct.product_id) === String(soldSaleProduct.product_id)
          })
          return {
            product_id: String(requestProduct.product_id),
            kilos: soldSaleProduct ? soldSaleProduct.kilos_remaining : String(requestProduct.kilos),
            groups:soldSaleProduct ? soldSaleProduct.groups_remaining : String(requestProduct.groups),
            group_weight: String(requestProduct.group_weight),
            kilo_price: String(requestProduct.kilo_price),
            total: String(requestProduct.kilos * requestProduct.kilo_price),
            tax: String(Math.trunc(requestProduct.kilos * requestProduct.kilo_price * 0.16))
          }
        })
        .filter(requestProduct => {
          return Number(requestProduct.kilos) > 0 && Number(requestProduct.groups) > 0
        }) : []
  }

  let requestedProducts = props.products.filter(product => {
    let orderRequestProductsIds = props.orderRequest && props.orderRequest.order_request_products ?
      props.orderRequest.order_request_products
        .map(requestProduct => {
          return requestProduct.product_id
        }) : [{...defaultOrderSalePayment}]
    return orderRequestProductsIds.includes(product.id)
  })

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues,
    mode: 'onChange'
  });

  const saleProducts = useFieldArray(
    {
      control,
      name: "order_sale_products"
    }
  );

  const salePayments = useFieldArray(
    {
      control,
      name: "order_sale_payments"
    }
  );

  const handleAddOrderSalePayment = () => {
    salePayments.append(defaultOrderSalePayment)
  }

  const handleRemoveOrderSalePayment = (index) => {
    salePayments.remove(index)
  }


  React.useEffect(() => {
    if (!props.orderSale) {
      axios
        .get(
          apiUrl + 'orderSale/max?column=order_code',
          {headers: {...authHeader()}}
        )
        .then(result => {
          setValue('order_code', result.data.data + 1)
        })
    }
  }, [])

  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);


    let finalSubmitted = {
      ...data,
      defaultValues
    }

    props.onSubmit(finalSubmitted, onSubmitCallback)
  };

  const onError = data => {
    console.log(errors)
    console.log(data)
  }

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
  }

  const watchSaleProducts = watch('order_sale_products')

  const watchSalePayments = watch('order_sale_payments')

  const watchSaleReceiptType = watch('order_sale_receipt_type_id')

  let total = 0

  if (watchSaleProducts.length > 0) {
    watchSaleProducts.forEach(saleProduct => {
      if(watchSaleReceiptType === '2') {
        total += Number(saleProduct.total) + Number(saleProduct.tax)
      } else {
        total += Number(saleProduct.total)
      }
    })
  }

  React.useEffect(() => {
    if(watchSalePayments.length === 1) {
      setValue(`order_sale_payments[0].amount`, String(total))
    }
  }, [total])

  const handleProductSelection = (productId, productionProductId, index) => {
    let groupWeight = '0'
    let kilos = "0"
    let groups = "0"
    if (productId) {

      let initialProductionProduct = defaultValues.order_sale_products
        .find(saleProduct => {
          return String(productionProductId) === String(saleProduct.id)
        })

      let isSameInitialProduct =
        initialProductionProduct
        && String(initialProductionProduct.product_id) === productId

      let product = props.products.find(product => {
        return String(product.id) === String(productId)
      })

      if (!isSameInitialProduct) {
        groupWeight = product.current_group_weight ? product.current_group_weight : "0"
      } else {
        groupWeight = initialProductionProduct.group_weight
        kilos = initialProductionProduct.kilos
        groups = initialProductionProduct.groups
      }

    }
    setValue(`order_sale_products[${index}].group_weight`, String(groupWeight), { shouldValidate: true })
    setValue(`order_sale_products[${index}].kilos`, String(kilos), { shouldValidate: true })
    setValue(`order_sale_products[${index}].groups`, String(groups), { shouldValidate: true })
  }

  const calculateSaleProductWithGroups = (groups, index) => {
    let kilos = Number(groups) * Number(watchSaleProducts[index].group_weight)
    setValue(`order_sale_products[${index}].kilos`, String(kilos), { shouldValidate: true })
    let _total = Number(kilos) * Number(watchSaleProducts[index].kilo_price)
    setValue(`order_sale_products[${index}].total`, String(Math.trunc(_total)), { shouldValidate: true })
    setValue(`order_sale_products[${index}].tax`, String(Math.trunc(_total * 0.16)), { shouldValidate: true })
  }

  const hasGroupWeight = (index) => {
    let saleProduct = watchSaleProducts[index]
    if (saleProduct) {
      let isValid = saleProduct.group_weight !== "0" &&
        saleProduct.group_weight !== "null" &&
        saleProduct.group_weight !== "" &&
        !isNaN(saleProduct.group_weight) &&
        Number(saleProduct.group_weight) > 0
      return saleProduct && isValid
    } else {
      return true
    }
  }

  const calculateSaleProductWithKilos = (kilos, index) => {
    let _total = Number(kilos) * Number(watchSaleProducts[index].kilo_price)
    setValue(`order_sale_products[${index}].total`, String(Math.trunc(_total)), { shouldValidate: true })
    setValue(`order_sale_products[${index}].tax`, String(Math.trunc(_total * 0.16)), { shouldValidate: true })
  }

  const calculateSaleProductWithKiloPrice = (kiloPrice, index) => {
    let _total = Number(kiloPrice) * Number(watchSaleProducts[index].kilos)
    setValue(`order_sale_products[${index}].total`, String(Math.trunc(_total)), { shouldValidate: true })
    setValue(`order_sale_products[${index}].tax`, String(Math.trunc(_total * 0.16)), { shouldValidate: true })
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
            <MauDatePicker
              name="date"
              control={control}
              rules={{required: true}}
              error={!!errors.date}
              helperText={errors.date && errors.date.message}
              defaultValue={defaultValues.date}
              label="Fecha de solicitud"
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.client_id}
            label={'Cliente'}
            options={props.clients}
            name={'client_id'}
            displayName={'name'}
            disabled
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.client_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.order_sale_receipt_type_id}
            label={'Tipo'}
            options={props.saleReceiptTypes}
            name={'order_sale_receipt_type_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.order_sale_receipt_type_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.order_sale_status_id}
            label={'Estado'}
            options={props.saleStatuses}
            name={'order_sale_status_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.order_sale_status_id}`}
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
            <MauNumber
              error={!!errors.order_code}
              rules={{
                required: true,
                validate: async (value) => {
                  const filterExact = 'filter_exact_1=order_code'
                  const filterExactValue = 'filter_exact_value_1=' + value
                  const params = filterExact + '&' + filterExactValue
                  const result = await axios
                    .get
                    (
                      apiUrl + 'orderSale/list?' + params,
                      {headers: {...authHeader()}}
                    )
                  let isSameAsInitial = false
                  if (props.orderSale && props.orderSale.order_code) {
                    isSameAsInitial = String(value) === String(props.orderSale.order_code)
                  }
                  return isSameAsInitial || (result && result.data && result.data.data.length === 0)
                }
              }}
              name="order_code"
              label="Folio"
              control={control}
              defaultValue={defaultValues.order_code}
              decimal={false}
              thousand={false}
            />
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{
            marginTop: '2em',
            display: 'inherit'
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
                      <TableCell>Bultos/rollos</TableCell>
                      <TableCell>Kilos</TableCell>
                      <TableCell>Peso</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell style={{display: watchSaleReceiptType !== '2' ? 'none' : undefined}}>IVA</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleProducts.fields.map((saleProduct, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`order_sale_products[${index}].id`}
                            defaultValue={`${saleProduct.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].product_id}
                            label={'Producto'}
                            options={requestedProducts}
                            displayName={'description'}
                            onChange={(e, productId) => {
                              let saleProductId = `${saleProduct.id}`
                              handleProductSelection(productId, saleProductId, index)
                            }}
                            name={`order_sale_products[${index}].product_id`}
                            rules={
                              {
                                required: true,
                                validate: (value) => {
                                  let count = 0
                                  watchSaleProducts.forEach(saleProduct => {
                                    if (String(value) === String(saleProduct.product_id)) {
                                     count = count + 1
                                    }
                                  })
                                  return count === 1
                                }
                              }
                            }
                            control={control}
                            defaultValue={`${saleProduct.product_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].groups}
                            label="Bultos"
                            name={`order_sale_products[${index}].groups`}
                            onChange={(groups) => {
                              if (hasGroupWeight(index)) {
                                calculateSaleProductWithGroups(groups, index)
                              }
                            }}
                            defaultValue={`${saleProduct.groups}`}
                            control={control}
                            rules={{
                                required: true,
                                max: 10000000,
                                validate: (value) => {
                                  let productId = watchSaleProducts[index].product_id
                                  if (productId) {
                                    let soldSaleProduct = soldSaleProducts.find(soldSaleProduct => {
                                      return String(soldSaleProduct.product_id) === String(productId)
                                    })
                                    if (soldSaleProduct && Number(value) >= 0) {
                                      return Number(value) <= Number(soldSaleProduct.groups_remaining)
                                    } else {
                                      return false
                                    }
                                  } else {
                                    return false
                                  }
                                }
                              }}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].kilos}
                            label="Kilos"
                            type="number"
                            onChange={(kilos) => {
                              calculateSaleProductWithKilos(kilos, index)
                            }}
                            // disabled={hasGroupWeight(index)}
                            name={`order_sale_products[${index}].kilos`}
                            defaultValue={`${saleProduct.kilos}`}
                            control={control}
                            rules={{
                              required: true,
                              max: 10000000,
                              min: 1,
                              validate: (value) => {
                                let productId = watchSaleProducts[index].product_id
                                if (productId) {
                                  let soldSaleProduct = soldSaleProducts.find(soldSaleProduct => {
                                    return String(soldSaleProduct.product_id) === String(productId)
                                  })
                                  if (soldSaleProduct && Number(value) >= 0) {
                                    return Number(value) <= Number(soldSaleProduct.kilos_remaining)
                                  } else {
                                    return false
                                  }
                                } else {
                                  return false
                                }
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].group_weight}
                            label="Peso por kilo"
                            disabled
                            type="number"
                            name={`order_sale_products[${index}].group_weight`}
                            defaultValue={`${saleProduct.group_weight}`}
                            control={control}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].kilo_price}
                            label="Precio"
                            type="number"
                            onChange={(kiloPrice) => {
                              calculateSaleProductWithKiloPrice(kiloPrice, index)
                            }}
                            name={`order_sale_products[${index}].kilo_price`}
                            defaultValue={`${saleProduct.kilo_price}`}
                            control={control}
                            rules={{
                                required: true,
                                maxValue: 1000000
                              }}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].total}
                            label="Total"
                            disabled
                            type="number"
                            name={`order_sale_products[${index}].total`}
                            control={control}
                            defaultValue={`${saleProduct.total}`}
                          />
                        </TableCell>
                        <TableCell
                          style={{display: watchSaleReceiptType !== '2' ? 'none' : undefined}}
                        >
                          <MauNumber
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].tax}
                            label="IVA"
                            disabled
                            type="number"
                            name={`order_sale_products[${index}].tax`}
                            control={control}
                            defaultValue={`${saleProduct.tax}`}
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

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <Grid container direction={'row'} justify={'flex-end'}>
            <Grid item style={{marginRight: '2em'}}>
              <Typography variant={'body1'}>

                Total &nbsp;
                {
                  formatNumber(total)
                }
              </Typography>
            </Grid>
          </Grid>
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
                <Typography
                  className={classes.tableTitle}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Cobranza
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddOrderSalePayment()
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
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salePayments.fields.map((salePayment, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`order_sale_payments[${index}].id`}
                            defaultValue={`${salePayment.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauDatePicker
                            error={!!errors.order_sale_payments && !!errors.order_sale_payments[index] && !!errors.order_sale_payments[index].date_paid}
                            name={`order_sale_payments[${index}].date_paid`}
                            control={control}
                            rules={{required: true}}
                            defaultValue={`${salePayment.date_paid}`}
                            label="Fecha de pago"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MauNumber
                            label="Cantidad"
                            error={!!errors.order_sale_payments && !!errors.order_sale_payments[index] && !!errors.order_sale_payments[index].amount}
                            name={`order_sale_payments[${index}].amount`}
                            defaultValue={`${salePayment.amount}`}
                            control={control}
                            rules={
                              {
                                required: true,
                                validate: (value) => {
                                  let salePaymentsTotal = 0
                                  watchSalePayments.forEach((salePayment, salePaymentIndex) => {
                                    if (index !== salePaymentIndex) {
                                      salePaymentsTotal += Number(watchSalePayments[salePaymentIndex].amount)
                                    }
                                  })
                                  salePaymentsTotal += Number(value)
                                  return salePaymentsTotal === total
                                }
                              }
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={errors[`order_sale_products`] && errors[`order_sale_products`][index] && errors[`order_sale_products`][index].order_sale_collection_status_id}
                            label={'Estado'}
                            options={props.collectionStatuses}
                            displayName={'name'}
                            name={`order_sale_payments[${index}].order_sale_collection_status_id`}
                            rules={
                              {
                                required: true,
                              }
                            }
                            control={control}
                            defaultValue={`${salePayment.order_sale_collection_status_id}`}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveOrderSalePayment(index)
                                }}
                              >
                                <DeleteIcon/>
                              </IconButton> : null
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
              disabled={watchSaleProducts.length === 0}
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
    clients: state.sales.clients,
    products: state.production.products,
    saleStatuses: state.sales.saleStatuses,
    collectionStatuses: state.sales.collectionStatuses,
    saleReceiptTypes: state.sales.saleReceiptTypes
  }
}

export default connect(mapStateToProps, null)(OrderSaleForm)
