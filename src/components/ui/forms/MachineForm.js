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
import MauDatePicker from './inputs/MauDatePicker'
import MauNumber from './inputs/MauNumber'
import MauAutocomplete from './inputs/MauAutocomplete'
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


const MachineForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  console.log(props.machine)

  const defaultValues = {
    id: props.machine ? props.machine.id : '',
    name: props.machine ? props.machine.name : '',
    machine_type_id: props.machine ? props.machine.machine_type_id : '',
    machine_equipments: props.machine ? props.machine.machine_equipments : []
  }

  console.log(defaultValues)

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });


  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);


    let finalSubmitted = {
      ...data,
      machine_equipments: data.machine_equipments && data.machine_equipments.length > 0
        ? data.machine_equipments : [],
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


  const machineEquipments = useFieldArray(
    {
      control,
      name: "machine_equipments"
    }
  );

  const defaultMachineEquipment = {
    machine_id: '',
    equipment_id: '',
    min_quantity: '',
    max_quantity: ''
  }

  const handleAddMachineEquipment = () => {
    machineEquipments.append(defaultMachineEquipment)
  }

  const handleRemoveMachineEquipment = (index) => {
    machineEquipments.remove(index)
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
              name="name"
              label="Nombre"
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
            error={!!errors.machine_type_id}
            label={'Tipo de maquina'}
            options={props.machineTypes}
            name={'machine_type_id'}
            displayName={'name'}
            disabled={!!props.machine}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.machine_type_id}`}
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
                      handleAddMachineEquipment()
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
                      <TableCell style={{width: '50%'}}>Refaccion</TableCell>
                      <TableCell>Cantidad Maxima</TableCell>
                      <TableCell>Cantidad Minima</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {machineEquipments.fields.map((machineEquipment, index) => (
                      <TableRow key={index}>
                        <TableCell style={{display: 'none'}}>
                          <TextField
                            id="standard-number"
                            label="Number"
                            type="number"
                            name={`machine_equipments[${index}].id`}
                            defaultValue={`${machineEquipment.id}`}
                            inputRef={register()}
                          />
                        </TableCell>
                        <TableCell>
                          <MauAutocomplete
                            error={!!errors.machine_equipments
                              && !!errors.machine_equipments[index]
                              && !!errors.machine_equipments[index].equipment_id
                            }
                            label={'Refaccion'}
                            options={props.equipments}
                            displayName={'description'}
                            name={`machine_equipments[${index}].equipment_id`}
                            rules={
                              {
                                required: true,
                              }
                            }
                            control={control}
                            defaultValue={`${machineEquipment.equipment_id}`}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <MauNumber
                            label="Cantidad minima"
                            error={!!errors.machine_equipments
                              && !!errors.machine_equipments[index]
                              && !!errors.machine_equipments[index].min_quantity
                            }
                            name={`machine_equipments[${index}].min_quantity`}
                            defaultValue={`${machineEquipment.min_quantity}`}
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
                            label="Cantidad maxima"
                            error={!!errors.machine_equipments
                              && !!errors.machine_equipments[index]
                              && !!errors.machine_equipments[index].max_quantity
                            }
                            name={`machine_equipments[${index}].max_quantity`}
                            defaultValue={`${machineEquipment.max_quantity}`}
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
                                  handleRemoveMachineEquipment(index)
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
    equipments: state.maintenance.equipments,
    machineTypes: state.production.machineTypes
  }
}

export default connect(mapStateToProps, null)(MachineForm)

