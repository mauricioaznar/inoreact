import React from 'react'
import './LoginForm.css'
import validateFormElement from '../utility/validateFormElement'
import {connect} from 'react-redux'
import {loginUser} from '../store/authActions'
import {Grid, FormControl, Paper, FormControlLabel, Checkbox, TextField, Button, Typography} from '@material-ui/core'
import Box from '@material-ui/core/Box'

const LoginForm = (props) => {
  const {email, password} = window.localStorage.getItem('loginForm') ? JSON.parse(window.localStorage.getItem('loginForm')) : {}
  const initialEmail = email || ''
  const initialPassword = password || ''
  const initialRemember = !!(email && password)
  const [formControl, setFormControl] = React.useState({
    email: {
      name: 'email',
      value: initialEmail,
      label: 'Email',
      valid: initialRemember,
      touched: initialRemember,
      validationRules: {
        required: true,
        email: true
      },
      errors: []
    },
    password: {
      name: 'password',
      value: initialPassword,
      label: 'Contraseña',
      valid: initialRemember,
      touched: initialRemember,
      validationRules: {
        required: true
      },
      errors: []
    },
    remember: {
      name: 'remember',
      checked: initialRemember,
      label: 'Recordar',
      valid: true,
      touched: false,
      validationRules: {},
      errors: []
    }
  })

  function handleOnChange(e) {
    const value = e.target.value
    const checked = e.target.checked
    const name = e.target.name
    const type = e.target.type
    console.log(type)

    const updatedFormControl = {...formControl}
    const updatedFormControlElement = {...updatedFormControl[name]}

    let updatedFormControlElementErrors = []
    if (type !== 'checkbox') {
      updatedFormControlElementErrors = validateFormElement(updatedFormControlElement.validationRules, value)
    }

    updatedFormControlElement.valid = updatedFormControlElementErrors.length === 0
    updatedFormControlElement.touched = true
    updatedFormControlElement.errors = updatedFormControlElementErrors

    if (type === 'checkbox') {
      console.log('Checkbox!')
      updatedFormControlElement.checked = !!checked
    } else {
      updatedFormControlElement.value = value
    }

    updatedFormControl[name] = updatedFormControlElement

    setFormControl(updatedFormControl)
  }

  function handleSubmit (e) {
    e.preventDefault()
    let isFormValid = true
    Object.keys(formControl).forEach(key => {
      if (formControl.hasOwnProperty(key)) {
        isFormValid = isFormValid && formControl[key].valid
      }
    })
    if (isFormValid) {
      const loginForm = {email: formControl.email.value, password: formControl.password.value}
      if (formControl.remember.checked === true) {
        window.localStorage.setItem('loginForm', JSON.stringify(loginForm))
      } else {
        window.localStorage.removeItem('loginForm')
      }
      props.loginUser(loginForm.email, loginForm.password)
    }
  }

  return (
    <div>
      <Grid
        container
        justify={"center"}
        alignItems="center"
        alignContent={"center"}
        style={{ minHeight: '100vh' }}
      >
        <Grid
          item
          component={Box}
          xs={10}
          sm={8}
          md={4}
        >
          <Grid
            container
            component={Paper}
            elevation={24}
            direction={"row"}
            spacing={8}
          >
            <Grid
              item
              xs={12}
            >
              <Typography
                variant={"h2"}
              >
                Login
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
            >

              <FormControl
                fullWidth
              >
                <TextField
                  type={"text"}
                  name={formControl.email.name}
                  placeholder={"example@example.com"}
                  value={formControl.email.value}
                  error={formControl.email.touched && !formControl.email.valid}
                  label={formControl.email.label}
                  onChange={(e) => {handleOnChange(e)}}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <FormControl
                fullWidth
              >
                <TextField
                  type={"password"}
                  name={formControl.password.name}
                  value={formControl.password.value}
                  placeholder={"somepassword"}
                  label={formControl.password.label}
                  onChange={(e) => {handleOnChange(e)}}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
            >
              <Grid
                container
                justify={"space-between"}
              >
                <FormControl>
                  <FormControlLabel
                    control={<Checkbox
                      checked={formControl.remember.checked}
                      name={formControl.remember.name}
                      onChange={(e) => {handleOnChange(e)}}
                    />}
                    label={formControl.remember.label}
                  />
                </FormControl>
                <FormControl>
                  <Button
                    onClick={(e) => {handleSubmit(e)}}
                    variant={"contained"}
                  >
                    Ingresar
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div >
  )

}


const mapDispatchToProps = (dispatch, getState) => {
  return {
    loginUser: (email, password) => {dispatch(loginUser(email, password))}
  }
}


export default connect(null, mapDispatchToProps)(LoginForm)