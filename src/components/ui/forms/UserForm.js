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
import MauAutocomplete from './inputs/MauAutocomplete'


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


  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);


    let finalSubmitted = {
      ...data,
      password: data.password1,
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
              inputRef={register({
                required: true
              })}
              name="first_name"
              label="Nombre"
              placeholder="'Juan'"
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
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                required: true
              })}
              name="last_name"
              label="Apellidos"
              placeholder="'Perez Chan'"
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
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address"
                }
              })}
              name="email"
              label="E-mail"
              placeholder="'juanperez@example.com'"
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
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                  required: !props.user
                })}
              type={'password'}
              name="password1"
              label="Contraseña"
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
          <FormControl
            fullWidth
          >
            <TextField
              inputRef={register({
                required: !props.user,
                validate: (value) => {
                  return value === watch('password1');
                }
              })}
              type={'password'}
              name="password2"
              label="Contraseña"
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
            error={!!errors.role_id}
            label={'Rol'}
            placeholder={'Rol x'}
            id={'rolLabel'}
            options={props.roles}
            name={'role_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.role_id}`}
          />
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.branch_id}
            label={'Sucursal'}
            placeholder={'Sucursal x'}
            id={'branchLabel'}
            options={props.branches}
            name={'branch_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.branch_id}`}
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
    roles: state.general.roles,
    branches: state.general.branches
  }
}

export default connect(mapStateToProps, null)(UserForm)

