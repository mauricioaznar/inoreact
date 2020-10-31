import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import {green} from '@material-ui/core/colors'
import {useForm} from 'react-hook-form'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import CheckIcon from '@material-ui/icons/Check'
import SaveIcon from '@material-ui/icons/Save'
import CircularProgress from '@material-ui/core/CircularProgress'
import MauAutocomplete from './inputs/MauAutocomplete'
import {connect} from 'react-redux'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
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

function ProductForm(props) {


  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [isGroupWeight, setIsGroupWeight] = React.useState(props.product ?
    props.product.current_group_weight !== 0 && props.product.current_group_weight > 0: false);

  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  const defaultValues = {
    id: props.product ? props.product.id : '',
    product_type_id: props.product ? String(props.product.product_type_id) : '',
    code: props.product ? props.product.code : '',
    description: props.product ? props.product.description : '',
    material_id: props.product ? String(props.product.material_id) : '',
    packing_id: props.product ? String(props.product.packing_id) : '',
    width: props.product ? props.product.width : '',
    calibre: props.product ? props.product.calibre : '',
    length: props.product ? props.product.length : '',
    current_kilo_price: props.product ? props.product.current_kilo_price : '',
    current_group_weight: props.product ? props.product.current_group_weight : '',
    group_weight_strict: props.product ? props.product.group_weight_strict : ''
  }

  const {register, unregister, handleSubmit, reset, watch, control, setValue, getValues, errors} = useForm({
    defaultValues
  });

  const productTypeId = watch('product_type_id')

  let isBag = productTypeId === '1'
  let isRoll = productTypeId === '2'
  let isPellet = productTypeId === '3'
  let isOthers = productTypeId === '4'

  const bagMaterials = props.materials.filter(material => material.product_type_id === 1)
  const rollMaterials = props.materials.filter(material => material.product_type_id === 2)
  const pelletMaterials = props.materials.filter(material => material.product_type_id === 3)
  const othersMaterials = props.materials.filter(material => material.product_type_id === 4)

  let typeMaterials = []
  if (isBag) {
    typeMaterials = bagMaterials
  } else if (isRoll) {
    typeMaterials = rollMaterials
  } else if (isPellet) {
    typeMaterials = pelletMaterials
  } else if (isOthers) {
    typeMaterials = othersMaterials
  } else {
    typeMaterials = []
  }

  const onSubmit = data => {
    setSuccess(false);
    setLoading(true);

    console.log(data)

    let finalSubmitted = {
      ...data,
      packing_id: (isRoll || isBag) ? data.packing_id : 'null',
      calibre: (isBag || isRoll || isOthers) ? data.calibre : '0',
      current_group_weight:  isGroupWeight && (isBag || isOthers) ? data.current_group_weight : '0',
      width: (isBag || isRoll || isOthers) ? data.width : '0',
      length: (isBag || isOthers) ? data.length : '0',
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
          <MauAutocomplete
            error={!!errors.product_type_id}
            label={'Tipo de producto'}
            options={props.productTypes}
            name={'product_type_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.product_type_id}`}
          />
        </Grid>


        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em'}}
        >
          <MauAutocomplete
            error={!!errors.material_id}
            label={'Subtipo'}
            options={typeMaterials}
            name={'material_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.material_id}`}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: (isBag) ? 'inherit' : 'none' }}
        >
          <MauAutocomplete
            error={!!errors.packing_id}
            label={'Empaque'}
            options={props.packings}
            name={'packing_id'}
            displayName={'name'}
            rules={
              {
                required: true
              }
            }
            control={control}
            defaultValue={`${defaultValues.packing_id}`}
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
            <TextField
              inputRef={register({
                required: true
              })}
              name="code"
              label="Codigo"
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
          style={{marginTop: '2em', display: (isBag || isRoll || isOthers) ? 'inherit' : 'none'}}
        >
          <MauNumber
            rules={{
              required: (isBag || isRoll || isOthers)
            }}
            name="width"
            label="Ancho"
            defaultValue={defaultValues.width}
            control={control}
            decimal={false}
            error={!!errors.width}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: (isBag || isOthers) ? 'inherit' : 'none'}}
        >
          <MauNumber
            rules={{
              required: (isBag || isOthers)
            }}
            control={control}
            defaultValue={defaultValues.length}
            error={!!errors.length}
            name="length"
            label="Largo"
            decimal={false}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: (isBag || isRoll || isOthers) ? 'inherit' : 'none'}}
        >
          <MauNumber
            rules={{
              required: (isBag || isRoll || isOthers)
            }}
            name="calibre"
            label="Calibre"
            type="number"
            control={control}
            defaultValue={defaultValues.calibre}
            error={!!errors.calibre}
          />
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isBag || isOthers ? 'inherit' : 'none'}}
        >
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={isGroupWeight}
                  onChange={() => {
                    setIsGroupWeight(!isGroupWeight)
                  }}
                  name="isGroupWeight"
                  color="primary"
                />
              }
              label="¿Requiere peso por bulto?"
            />
          </FormGroup>
        </Grid>

        <Grid
          item
          xs={12}
          className={classes.rowContainer}
          style={{marginTop: '2em', display: isGroupWeight && (isBag || isOthers) ? 'inherit' : 'none'}}
        >
          <FormControl
            fullWidth
          >
            <MauNumber
              rules={{
                required: isGroupWeight && (isBag || isOthers)
              }}
              name="current_group_weight"
              label="Kilos en grupo"
              control={control}
              defaultValue={defaultValues.current_group_weight}
              error={!!errors.current_group_weight}
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
            rules={{
              required: true
            }}
            name="current_kilo_price"
            label="Precio"
            control={control}
            defaultValue={defaultValues.current_kilo_price}
            error={!!errors.current_kilo_price}
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

const mapStateToProps = (state, ownProps) => {
  return {
    productTypes: state.production.productTypes,
    materials: state.production.materials,
    packings: state.production.packings
  }
}

export default connect(mapStateToProps, null)(ProductForm)