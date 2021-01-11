import Grid from '@material-ui/core/Grid'
import React from "react";
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
import MauNumber from './inputs/MauNumber'
import DeleteIcon from '@material-ui/icons/Delete'
import MauDatePicker from './inputs/MauDatePicker'


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


const EquipmentForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });


  const defaultValues = {
    id: props.equipmentTransaction ? props.equipmentTransaction.id : '',
    description: props.equipmentTransaction ? props.equipmentTransaction.description : '',
    date_emitted: props.equipmentTransaction ? props.equipmentTransaction.date_emitted : '',
    date_estimated_delivery: props.equipmentTransaction ? props.equipmentTransaction.date_estimated_delivery : '',
    equipment_transaction_type_id: props.equipmentTransaction ? props.equipmentTransaction.equipment_transaction_type_id : '',
    equipment_transaction_status_id: props.equipmentTransaction ? props.equipmentTransaction.equipment_transaction_status_id : '',
    equipment_transaction_items: props.equipmentTransaction && props.equipmentTransaction.equipment_transaction_items.length > 0 ?
      props.equipmentTransaction.equipment_transaction_items : []
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });


  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);


    let finalSubmitted = {
      ...data,
      equipment_transaction_items: data.equipment_transaction_items && data.equipment_transaction_items.length > 0
        ? data.equipment_transaction_items : [],
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

  const equipmentTransactionItems = useFieldArray(
    {
      control,
      name: "equipment_transaction_items"
    }
  );

  const defaultEquipmentTransactionItem = {
    machine_id: '',
    equipment_id: '',
    quantity: '',
    unit_price: ''
  }

  const handleAddEquipmentTransactionItem = () => {
    equipmentTransactionItems.append(defaultEquipmentTransactionItem)
  }

  const handleRemoveEquipmentTransactionItem = (index) => {
    equipmentTransactionItems.remove(index)
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
              name="description"
              label="Descripción"
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
          <MauDatePicker
            name="date_emitted"
            control={control}
            rules={{required: true}}
            error={!!errors.date_emitted}
            helperText={errors.date_emitted && errors.date_emitted.message}
            defaultValue={defaultValues.date_emitted}
            label="Fecha de emision"
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauDatePicker
            name="date_estimated_delivery"
            control={control}
            rules={{required: true}}
            error={!!errors.date_estimated_delivery}
            helperText={errors.date_estimated_delivery && errors.date_estimated_delivery}
            defaultValue={defaultValues.date_estimated_delivery}
            label="Fecha estimada de entrega"
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.equipment_transaction_type_id}
            label={'Tipo de transaccion'}
            options={props.equipmentTransactionTypes}
            name={'equipment_transaction_type_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.equipment_transaction_type_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.equipment_transaction_status_id}
            label={'Estado de la transaccion'}
            options={props.equipmentTransactionStatuses}
            name={'equipment_transaction_status_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.equipment_transaction_status_id}`}
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
                <Typography
                  className={classes.tableTitle}
                  variant="h6"
                  id="tableTitle"
                  component="div"
                >
                  Refacciones
                </Typography>
                <Tooltip title="Filter list">
                  <IconButton
                    aria-label="filter list"
                    onClick={() => {
                      handleAddEquipmentTransactionItem()
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
                      <TableCell style={{width: '30%'}}>Refaccion</TableCell>
                      <TableCell style={{width: '30%'}}>Maquina</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {equipmentTransactionItems.fields.map((equipmentTransactionItem, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`equipment_transaction_items[${index}].id`}
                            defaultValue={`${equipmentTransactionItem.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={!!errors.equipment_transaction_items
                            && !!errors.equipment_transaction_items[index]
                            && !!errors.equipment_transaction_items[index].equipment_id
                            }
                            label={'Refaccion'}
                            options={props.equipments}
                            displayName={'description'}
                            name={`equipment_transaction_items[${index}].equipment_id`}
                            rules={
                              {
                                required: true,
                              }
                            }
                            control={control}
                            defaultValue={`${equipmentTransactionItem.equipment_id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={!!errors.equipment_transaction_items
                            && !!errors.equipment_transaction_items[index]
                            && !!errors.equipment_transaction_items[index].machine_id
                            }
                            label={'Maquina'}
                            options={props.machines}
                            displayName={'name'}
                            name={`equipment_transaction_items[${index}].machine_id`}
                            control={control}
                            defaultValue={`${equipmentTransactionItem.machine_id}`}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MauNumber
                            label="Cantidad"
                            error={!!errors.equipment_transaction_items
                            && !!errors.equipment_transaction_items[index]
                            && !!errors.equipment_transaction_items[index].quantity
                            }
                            name={`equipment_transaction_items[${index}].quantity`}
                            defaultValue={`${equipmentTransactionItem.quantity}`}
                            control={control}
                            rules={
                              {
                                required: true
                              }
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MauNumber
                            label="Precio"
                            error={!!errors.equipment_transaction_items
                            && !!errors.equipment_transaction_items[index]
                            && !!errors.equipment_transaction_items[index].unit_price
                            }
                            name={`equipment_transaction_items[${index}].unit_price`}
                            defaultValue={`${equipmentTransactionItem.unit_price}`}
                            control={control}
                            rules={
                              {
                                required: true
                              }
                            }
                          />
                        </TableCell>
                        <TableCell align={'right'}>
                          {
                            index !== 0 ?
                              <IconButton
                                onClick={() => {
                                  handleRemoveEquipmentTransactionItem(index)
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
    equipmentTransactionStatuses: state.maintenance.equipmentTransactionStatuses,
    equipmentTransactionTypes: state.maintenance.equipmentTransactionTypes,
    machines: state.production.machines,
    equipments: state.maintenance.equipments
  }
}

export default connect(mapStateToProps, null)(EquipmentForm)

