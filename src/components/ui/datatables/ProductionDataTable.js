import React from 'react'
import {connect} from 'react-redux'


import Grid from '@material-ui/core/Grid'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {tableIcons, mainEntityPromise, subEntitiesPromises} from './common/common'
import ProductionForm from '../forms/ProductionForm'
import MauMaterialTable from './common/MauMaterialTable'
import formatNumber from '../../../helpers/formatNumber'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});





//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ProductionDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const entityPath = 'orderProduction'

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const columns = [
    {
      title: 'Fecha de inicio',
      field: 'start_date_time',
      type: 'date_time'
    },
    {
      title: 'Fecha de fin',
      field: 'end_date_time',
      type: 'date_time'
    },
    {
      title: 'Desperdicio',
      field: 'waste',
      type: 'text'
    },
    {
      title: 'Desempeño',
      field: 'performance',
      type: 'text'
    },
    {
      title: 'Tipo de produccion',
      field: 'order_production_type_id',
      type: 'options',
      options: props.orderProductionTypes,
      optionLabel: 'name'
    },
    {
      title: 'Sucursal',
      field: 'branch_id',
      type: 'options',
      options: props.branches,
      optionLabel: 'name'
    },
    {
      title: 'Maquinas',
      type: 'entity',
      field: 'machine_id',
      entity: 'orderProductionProducts',
      table: 'order_production_products',
      options: props.machines,
      optionLabel: 'name'
    },
    {
      title: 'Productos',
      type: 'entity',
      field: 'product_id',
      entity: 'orderProductionProducts',
      table: 'order_production_products',
      options: props.products,
      optionLabel: 'description'
    },
    {
      title: 'Kilos',
      sorting: false,
      render: (rowData) => {
        return (
          <ul>
            {
              rowData.order_production_products.map(productionProduct => {
                return (
                  <li style={{whiteSpace: 'nowrap', textAlign: 'right'}}>
                    {formatNumber(productionProduct.kilos)}
                  </li>
                )
              })
            }
          </ul>
        )
      },

    }
  ]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (production, callback) => {
    let productionPromise = mainEntityPromise(production, entityPath)
    productionPromise
      .then(result => {
        let productionId = result.data.data.id
        const subEntitiesConfs = [
          {
            initialSubEntities: production.defaultValues.order_production_products,
            subEntities: production.order_production_products,
            path: 'orderProductionProduct'
          },
          {
            initialSubEntities: production.defaultValues.order_production_employees,
            subEntities: production.order_production_employees,
            path: 'orderProductionEmployee'
          }
        ]
        const mainEntityConf = {
          'order_production_id': productionId
        }
        let productionSubEntitiesPromises = subEntitiesPromises(subEntitiesConfs, mainEntityConf)
        return Promise.all(productionSubEntitiesPromises)
      })
      .then(results => {
        callback(true)
        tableRef.current && tableRef.current.onQueryChange()
        setOpen(false)
      })
      .finally(() => {
        if (props.setUpdates) {
          props.setUpdates(props.updates + 1)
        }
      })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + entityPath + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    return Promise.all(promises).then(results => {
      return new Promise((resolve, reject) => {
        props.setUpdates(props.updates + 1)
        resolve()
      })
    })
  }


  return (
    <>
      <Grid
        container
        direction={'column'}
      >
        <Grid
          item
          xs={12}
          style={{marginTop: '2em'}}
        >
          <MauMaterialTable
            tableRef={tableRef}
            icons={tableIcons}
            entityPath={entityPath}
            title="Produccion"
            onRowDelete={(oldData) => {
              return handleRowDelete(oldData)
            }}
            onRowAdd={(event, rowData) => {
              setRowData(null)
              setOpen(true)
            }}
            onRowEdit={(event, rowData) => {
              setRowData(rowData)
              setOpen(true)
            }}
            columns={columns}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        open={open}
        fullScreen
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <ProductionForm production={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    products: state.production.products,
    productTypes: state.production.productTypes,
    branches: state.general.branches,
    orderProductionTypes: state.production.orderProductionTypes
  }
}

export default connect(mapStateToProps, null)(ProductionDataTable)