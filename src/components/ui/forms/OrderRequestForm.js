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


const OrderRequestForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  let defaultRequestProduct = {
    id: '',
    product_id: '',
    kilos: '0',
    groups: '0',
    total: '0',
    kilo_price: '0',
    group_weight: '0',
    type: ''
  }


  const defaultValues = {
    id: props.orderRequest ? props.orderRequest.id : '',
    order_code: props.orderRequest ? props.orderRequest.order_code : '',
    estimated_delivery_date: props.orderRequest ? props.orderRequest.estimated_delivery_date : '',
    date: props.orderRequest ? props.orderRequest.date : '',
    priority: props.orderRequest ? props.orderRequest.priority : '',
    client_id: props.orderRequest ? props.orderRequest.client_id : '',
    order_request_status_id: props.orderRequest ? props.orderRequest.order_request_status_id : '',
    order_request_products: props.orderRequest ? props.orderRequest.order_request_products
      .map(requestProduct => {
        return {
          ...requestProduct,
          kilos: String(requestProduct.kilos),
          groups: String(requestProduct.groups),
          group_weight: String(requestProduct.group_weight),
          kilo_price: String(requestProduct.kilo_price),
          total: String(requestProduct.kilos * requestProduct.kilo_price)
        }
      }) : []
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });

  const requestProducts = useFieldArray(
    {
      control,
      name: "order_request_products"
    }
  );

  React.useEffect(() => {
    if (!props.orderRequest) {
      axios
        .get(
          apiUrl + 'orderRequest/max?column=order_code',
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
    console.log(data)
  }

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
  }

  const handleAddRequestProduct = () => {
    requestProducts.append(defaultRequestProduct)
  }

  const handleRemoveRequestProducts = (index) => {
    requestProducts.remove(index)
  }

  const watchRequestProducts = watch('order_request_products')

  const handleProductSelection = (productId, productionProductId, index) => {
    let groupWeight = '0'
    let kilos = "0"
    let groups = "0"
    if (productId) {

      let initialProductionProduct = defaultValues.order_request_products
        .find(requestProduct => {
          return String(productionProductId) === String(requestProduct.id)
        })

      let isSameInitialProduct =
        initialProductionProduct
        && String(initialProductionProduct.product_id) === productId

      console.log('is same initial product')
      console.log(isSameInitialProduct)

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
    console.log(`order_request_products[${index}].kilos`, String(kilos), {shouldValidate: true, shouldDirty: true})
    setValue(`order_request_products[${index}].group_weight`, String(groupWeight),{shouldValidate: true, shouldDirty: true})
    setValue(`order_request_products[${index}].kilos`, String(kilos), {shouldValidate: true, shouldDirty: true})
    setValue(`order_request_products[${index}].groups`, String(groups), {shouldValidate: true, shouldDirty: true})
  }

  const calculateProductKilos = (groups, index) => {
    let kilos = Number(groups) * Number(watchRequestProducts[index].group_weight)
    console.log(`order_request_products[${index}].kilos`, String(kilos), {shouldValidate: true, shouldDirty: true})
    setValue(`order_request_products[${index}].kilos`, String(kilos), {shouldValidate: true, shouldDirty: true})
    let _total = Number(kilos) * Number(watchRequestProducts[index].kilo_price)
    setValue(`order_request_products[${index}].total`, String(Math.trunc(_total)), {shouldValidate: true, shouldDirty: true})
  }

  const hasGroupWeight = (index) => {
    let requestProduct = watchRequestProducts[index]
    let isValid = requestProduct &&
      requestProduct.group_weight !== "0" &&
      requestProduct.group_weight !== "null" &&
      requestProduct.group_weight !== "" &&
      !isNaN(requestProduct.group_weight) &&
      Number(requestProduct.group_weight) > 0
    return requestProduct && isValid
  }

  const calculateRequestProductWithKilos = (kilos, index) => {
    let _total = Number(kilos) * Number(watchRequestProducts[index].kilo_price)
    setValue(`order_request_products[${index}].total`, String(Math.trunc(_total)), {shouldValidate: true, shouldDirty: true})
  }

  const calculateRequestProductWithKiloPrice = (kiloPrice, index) => {
    let _total = Number(watchRequestProducts[index].kilos) * Number(kiloPrice)
    setValue(`order_request_products[${index}].total`, String(Math.trunc(_total)), {shouldValidate: true, shouldDirty: true})
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
              name="estimated_delivery_date"
              control={control}
              rules={{required: true}}
              error={!!errors.estimated_delivery_date}
              helperText={errors.estimated_delivery_date && errors.estimated_delivery_date.message}
              defaultValue={defaultValues.estimated_delivery_date}
              label="Fecha de entrega estimada"
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
            error={!!errors.order_request_status_id}
            label={'Estado'}
            options={props.requestStatuses}
            name={'order_request_status_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.order_request_status_id}`}
          />
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
                      apiUrl + 'orderRequest/list?' + params,
                      {headers: {...authHeader()}}
                    )
                  let isSameAsInitial = false
                  if (props.orderRequest && props.orderRequest.order_code) {
                    isSameAsInitial = String(value) === String(props.orderRequest.order_code)
                  }
                  return isSameAsInitial || (result && result.data && result.data.data.length === 0)
                }
              }}
              name="order_code"
              defaultValue={defaultValues.order_code}
              label="Folio"
              control={control}
            />
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauNumber
            label="Prioridad"
            error={errors.priority}
            name={`priority`}
            control={control}
            thousand={false}
            decimal={false}
            defaultValue={defaultValues.priority}
            rules={{required: true, max: 10000000}}
          />
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
                <Tooltip title="Agregar">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddRequestProduct()
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
                      <TableCell>Bultos/rollos</TableCell>
                      <TableCell>Kilos</TableCell>
                      <TableCell>Peso</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {requestProducts.fields.map((requestProduct, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`order_request_products[${index}].id`}
                            defaultValue={`${requestProduct.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={!!errors.order_request_products &&  !!errors.order_request_products[index] && !!errors.order_request_products[index].product_id}
                            label={'Producto'}
                            options={props.products}
                            displayName={'description'}
                            onChange={(e, productId) => {
                              let requestProductId = `${requestProduct.id}`
                              handleProductSelection(productId, requestProductId, index)
                            }}
                            name={`order_request_products[${index}].product_id`}
                            rules={
                              {
                                required: true
                              }
                            }
                            control={control}
                            defaultValue={`${requestProduct.product_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.order_request_products && !!errors.order_request_products[index] && !!errors.order_request_products[index].groups}
                            label="Bultos"
                            name={`order_request_products[${index}].groups`}
                            onChange={(groups) => {
                              if (hasGroupWeight(index)) {
                                calculateProductKilos(groups, index)
                              }
                            }}
                            defaultValue={`${requestProduct.groups}`}
                            control={control}
                            rules={{required: true, max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.order_request_products && !!errors.order_request_products[index] && !!errors.order_request_products[index].kilos}
                            label="Kilos"
                            onChange={(kilos) => {
                              calculateRequestProductWithKilos(kilos, index)
                            }}
                            disabled={hasGroupWeight(index)}
                            name={`order_request_products[${index}].kilos`}
                            defaultValue={`${requestProduct.kilos}`}
                            control={control}
                            rules={{required: true, max: 10000000, min: 1}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.order_request_products && !!errors.order_request_products[index] && !!errors.order_request_products[index].group_weight}
                            label="Peso por kilo"
                            disabled
                            type="number"
                            name={`order_request_products[${index}].group_weight`}
                            defaultValue={`${requestProduct.group_weight}`}
                            control={control}
                            rules={{max: 10000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.order_request_products && !!errors.order_request_products[index] && !!errors.order_request_products[index].kilo_price}
                            label="Precio"
                            onChange={(kiloPrice) => {
                              calculateRequestProductWithKiloPrice(kiloPrice, index)
                            }}
                            name={`order_request_products[${index}].kilo_price`}
                            defaultValue={`${requestProduct.kilo_price}`}
                            control={control}
                            rules={{required: true, maxValue: 1000000}}
                          />
                        </TableCell>
                        <TableCell>
                          <MauNumber
                            error={!!errors.order_request_products && !!errors.order_request_products[index] && !!errors.order_request_products[index].total}
                            label="Total"
                            disabled
                            name={`order_request_products[${index}].total`}
                            defaultValue={`${requestProduct.total}`}
                            control={control}
                            inputRef={register({})}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveRequestProducts(index)
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
    clients: state.sales.clients,
    products: state.production.products,
    requestStatuses: state.sales.requestStatuses
  }
}

export default connect(mapStateToProps, null)(OrderRequestForm)
