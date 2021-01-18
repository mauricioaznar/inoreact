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
import MauDateTimePicker from './inputs/MauDateTimePicker'
import MauAutocomplete from './inputs/MauAutocomplete'
import MauMultipleAutocomplete from './inputs/MauMultipleAutocomplete'


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


const ProductionForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const defaultValues = {
    start_date_time: props.productionEvent ? props.productionEvent.start_date_time : null,
    end_date_time: props.productionEvent ? props.productionEvent.end_date_time : null,
    maintenance_employee_id: props.productionEvent ? props.productionEvent.maintenance_employee_id : '',
    report_employee_id: props.productionEvent ? props.productionEvent.report_employee_id : '',
    machine_id: props.productionEvent ? props.productionEvent.machine_id : '',
    maintenance_employee_description: props.productionEvent ? props.productionEvent.maintenance_employee_description : '',
    report_employee_description: props.productionEvent ? props.productionEvent.report_employee_description : '',
    production_e_production_ets: props.productionEvent ? props.productionEvent.production_e_production_ets : [],
    id: props.productionEvent ? props.productionEvent.id : ''
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });

  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);

    let finalSubmitted = {
      ...data,
      defaultValues
    }

    console.log(finalSubmitted)
    props.onSubmit(finalSubmitted, onSubmitCallback)
  };


  const productionEProductionEts = useFieldArray(
    {
      control,
      name: "production_e_production_ets"
    }
  );

  const onError = data => {
    console.log(data)
  }

  const onSubmitCallback = (isValid) => {
    setSuccess(true);
    setLoading(false);
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
            style={{
              marginTop: '0.5em',
              display: 'inherit'
            }}
          >
            <MauDateTimePicker
              name="start_date_time"
              control={control}
              rules={{required: true}}
              error={!!errors.start_date_time}
              helperText={errors.start_date_time && errors.start_date_time.message}
              defaultValue={defaultValues.start_date_time}
              label="Fecha de inicio"
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
            style={{
              marginTop: '0.5em',
              display: 'inherit'
            }}
          >
            <MauDateTimePicker
              name="end_date_time"
              control={control}
              rules={{required: true}}
              error={!!errors.end_date_time}
              helperText={errors.end_date_time && errors.end_date_time.message}
              defaultValue={defaultValues.end_date_time}
              label="Fecha de fin"
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
            error={!!errors.report_employee_id}
            label={'Maquina'}
            placeholder={'Maquina'}
            id={'machineLabel'}
            options={props.machines}
            name={'machine_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.machine_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.report_employee_id}
            label={'Empleado que reporto'}
            placeholder={'Empleado'}
            id={'reportEmployeeLabel'}
            options={props.employees}
            name={'report_employee_id'}
            displayName={'fullname'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.report_employee_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: 'inherit'}}
        >
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register()}
              type="text"
              name="report_employee_description"
              label="Descripcion del empleado que reporto"
              placeholder=""
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
            error={!!errors.maintenance_employee_id}
            label={'Empleado que reparo'}
            placeholder={'Operador  x'}
            id={'maintenanceEmployeeLabel'}
            options={props.employees}
            name={'maintenance_employee_id'}
            displayName={'fullname'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.maintenance_employee_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: 'inherit'}}
        >
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register()}
              type="text"
              name="maintenance_employee_description"
              label="Descripcion del empleado que reparo"
              placeholder=""
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
          <MauMultipleAutocomplete
            error={!!errors.production_e_production_ets}
            label={'Eventos'}
            placeholder={''}
            id={'productionEventTypesLabel'}
            fieldArray={productionEProductionEts}
            relationshipId={'production_event_type_id'}
            options={props.productionEventTypes}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            register={register}
            name={'production_e_production_ets'}
            defaultValue={defaultValues.production_e_production_ets}
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
    productTypes: state.production.productTypes,
    employees: state.general.employees,
    productionEventTypes: state.maintenance.productionEventTypes
  }
}

export default connect(mapStateToProps, null)(ProductionForm)

