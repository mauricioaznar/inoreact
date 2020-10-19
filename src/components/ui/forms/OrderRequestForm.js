import Grid from '@material-ui/core/Grid'
import React from "react";
import {connect} from 'react-redux'

import clsx from 'clsx';
import {useForm} from "react-hook-form";
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
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
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


const OrderRequestForm = (props) => {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const defaultValues = {
    id: props.orderRequest ? props.orderRequest.id : '',
    order_code: props.orderRequest ? props.orderRequest.order_code : '',
    estimated_delivery_date: props.orderRequest ? props.orderRequest.estimated_delivery_date : '',
    date: props.orderRequest ? props.orderRequest.date : ''
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });

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
          <FormControl
            fullWidth
          >
            <TextField
              error={!!errors.order_code}
              inputRef={register({
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
              })}
              name="order_code"
              label="Folio"
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

  }
}

export default connect(mapStateToProps, null)(OrderRequestForm)
