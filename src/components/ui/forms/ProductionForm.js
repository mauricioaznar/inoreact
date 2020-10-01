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
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
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


const UserForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const bagProducts = props.products.filter(product => product.product_type_id === 1)
  const rollProducts = props.products.filter(product => product.product_type_id === 2)
  const pelletProducts = props.products.filter(product => product.product_type_id === 3)

  const defaultValues = {
    id: props.production ? props.production.id : '',
    waste: props.production ? String(props.production.waste) : '',
    order_production_type_id: props.production ? String(props.production.order_production_type_id) : '',
    order_production_products: props.production ?
      props.production.order_production_products
        .map(productionProduct => {
          return {
            ...productionProduct,
            kilos: String(productionProduct.kilos),
            groups: String(productionProduct.groups),
            group_weight: String(productionProduct.group_weight)
          }
        })
      : []
  }
  

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });

  const watchProductionProducts = watch('order_production_products')


  const productionProducts = useFieldArray(
    {
      control,
      name: "order_production_products"
    }
  );

  console.log(productionProducts)

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


  const handleAddProductionProduct = () => {
    productionProducts.append({
      id: '',
      product_id: "null",
      machine_id: "null",
      kilos: "0",
      groups: "0",
      group_weight: "0",
    })
  }

  const handleRemoveProductionProducts = (index) => {
    productionProducts.remove(index)
  }


  const handleProductSelection = (productId, productionProductId, index) => {
    let groupWeight = "0"
    let kilos = "0"
    let groups = "0"
    let initialProductionProduct = defaultValues.order_production_products
      .find(productionProduct => {
        return productionProductId === String(productionProduct.id)
      })
    if (!initialProductionProduct) {
      let product = props.products.find(product => {
        return String(product.id) === productId
      })
      groupWeight = product.current_group_weight ? product.current_group_weight : "0"
      kilos = "0"
      groups = "0"
    } else {
      groupWeight = initialProductionProduct.group_weight
      kilos = initialProductionProduct.kilos
      groups = initialProductionProduct.groups
    }
    setValue(`order_production_products[${index}].group_weight`, String(groupWeight))
    setValue(`order_production_products[${index}].kilos`, String(kilos))
    setValue(`order_production_products[${index}].groups`, String(groups))
  }
  

  const calculateProductKilos = (e, index) => {
    let kilos = Number(watchProductionProducts[index].groups) * Number(watchProductionProducts[index].group_weight)
    setValue(`order_production_products[${index}].kilos`, String(kilos))
  }

  const hasGroupWeight = (index) => {
    let productionProduct = watchProductionProducts[index]
    console.log(productionProduct)
    return productionProduct &&
      (
        productionProduct.group_weight !== "0" &&
        productionProduct.group_weight !== "null" &&
        productionProduct.group_weight !== "" &&
        !isNaN(productionProduct.group_weight) &&
        Number(productionProduct.group_weight) > 0
      )
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
              name="waste"
              label="Desperdicio"
              type="number"
              placeholder="'0'"
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
                      handleAddProductionProduct()
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
                      <TableCell>Bultos</TableCell>
                      <TableCell>Kilos</TableCell>
                      <TableCell>Peso</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productionProducts.fields.map((productionProduct, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`order_production_products[${index}].id`}
                            defaultValue={`${productionProduct.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={!!errors.order_production_products && !!errors.order_production_products[index].product_id}
                            label={'Producto'}
                            id={'productLabel'}
                            options={props.products}
                            displayName={'description'}
                            onChange={(e) => {
                              let productionProductId = `${productionProduct.id}`
                              let productId = e.target.value
                              handleProductSelection(productId, productionProductId, index)
                            }}
                            name={`order_production_products[${index}].product_id`}
                            rules={
                              {
                                required: "this is required",
                                validate: (value) => {
                                  return value !== 'null'
                                }
                              }
                            }
                            control={control}
                            defaultValue={`${productionProduct.product_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            error={!!errors.order_production_products && !!errors.order_production_products[index].groups}
                            id="groups"
                            label="Bultos"
                            type="number"
                            name={`order_production_products[${index}].groups`}
                            onChange={(e) => {
                              if (hasGroupWeight(index)) {
                                calculateProductKilos(e, index)
                              }
                            }}
                            defaultValue={`${productionProduct.groups}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            error={!!errors.order_production_products && !!errors.order_production_products[index].kilos}
                            id="Kilos"
                            label="Kilos"
                            type="number"
                            disabled={hasGroupWeight(index)}
                            name={`order_production_products[${index}].kilos`}
                            defaultValue={`${productionProduct.kilos}`}
                            inputRef={register({required: true, max: 10000000})}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            error={!!errors.order_production_products && !!errors.order_production_products[index].group_weight}
                            id="group_weight"
                            label="Peso por kilo"
                            disabled
                            type="number"
                            name={`order_production_products[${index}].group_weight`}
                            defaultValue={`${productionProduct.group_weight}`}
                            inputRef={register({max: 10000000})}
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveProductionProducts(index)
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
          style={{marginTop: '2em'}}
        >
          <InputLabel
            error={errors.order_production_type_id}
          >
            Tipo de produccion
          </InputLabel>
          <Controller
            as={
              <RadioGroup
                aria-label="gender"
              >
                {props.orderProductionTypes.map(productionType => {
                  return (
                    <FormControlLabel
                      key={productionType.id}
                      value={String(productionType.id)}
                      control={<Radio/>}
                      label={productionType.name}
                    />
                  )
                })}
              </RadioGroup>
            }
            name="order_production_type_id"
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
    orderProductionTypes: state.production.orderProductionTypes,
    products: state.production.products,
    machines: state.production.machines,
    productTypes: state.production.productTypes
  }
}

export default connect(mapStateToProps, null)(UserForm)

