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
    id: props.user ? props.user.id : '',
    email: props.user ? props.user.email : '',
    first_name: props.user ? props.user.first_name : '',
    last_name: props.user ? props.user.last_name : '',
    role_id: props.user ? String(props.user.role_id) : 'null',
    branch_id: props.user ? String(props.user.branch_id) : 'null'
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
                  return result && result.data && result.data.data.length === 0
                }
              })}
              name="order_code"
              label="Codigo"
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
    roles: state.general.roles,
    branches: state.general.branches
  }
}

export default connect(mapStateToProps, null)(OrderRequestForm)
