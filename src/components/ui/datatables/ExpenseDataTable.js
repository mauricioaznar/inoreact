import React from 'react'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import {useTheme} from '@material-ui/core/styles'
import axios from 'axios'
import apiUrl from '../../../helpers/apiUrl'
import authHeader from '../../../helpers/authHeader'
import Dialog from '@material-ui/core/Dialog'
import ExpenseForm from '../forms/ExpenseForm'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import {mainEntityPromise, subEntitiesPromises} from './common/common'
import MauMaterialTable from "./common/MauMaterialTable";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}




//Fix call in useEffect that is leaking memory (because is trying to set state in before component mounts?)

function ExpenseDataTable(props) {

  const tableRef = React.createRef();


  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = React.useState(false);
  const [rowData, setRowData] = React.useState(null);

  const entityPath = 'expense'

  const columns = [
    {
      title: 'Fecha de pago',
      field: 'date_paid',
      type: 'date'
    },
    {
      title: 'Fecha de emision',
      field: 'date_emitted',
      type: 'date'
    },
    {
      title: 'Tipo de gasto',
      field: 'expense_type_id',
      type: 'options',
      options: props.expenseTypes,
      optionLabel: 'name'
    },
    {
      title: 'Proveedor',
      field: 'supplier_id',
      type: 'options',
      options: props.suppliers,
      optionLabel: 'name'
    },
    {
      title: 'Codigo de la factura',
      field: 'invoice_code',
      type: 'text'
    },
    {
      title: 'Codigo interno',
      field: 'internal_code',
      type: 'text'
    },
    {
      title: 'Total',
      sorting: false,
      type: 'currency',
      render: (rawData) => {
        let expenseItemsTotal = rawData.expense_items.reduce((a, b) => {
          return a + b.subtotal
        }, 0)
        return <>${formatNumber(expenseItemsTotal)}</>
      }
    },
    {
      title: 'IVA',
      sorting: false,
      field: 'tax',
      filtering: false,
      type: 'currency'
    },
    {
      title: 'Comentarios',
      field: 'comments',
      type: 'text'
    }
  ]

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnSubmit = (expense, callback) => {
    let expensePromise = mainEntityPromise(expense, entityPath)
    expensePromise.then(result => {
      let expenseId = result.data.data.id
      const subEntitiesConfs = [
        {
          initialSubEntities: expense.defaultValues.expense_items,
          subEntities: expense.expense_items,
          path: 'expenseItem'
        },
        {
          initialSubEntities: expense.defaultValues.expense_invoice_complements,
          subEntities: expense.expense_invoice_complements,
          path: 'expenseInvoiceComplement'
        },
        {
          initialSubEntities: expense.defaultValues.expense_products,
          subEntities: expense.expense_products,
          path: 'expenseProduct'
        },
        {
          initialSubEntities: expense.defaultValues.expense_credit_notes,
          subEntities: expense.expense_credit_notes,
          path: 'expenseCreditNote'
        }
      ]
      const mainEntityConf = {
        'expense_id': expenseId
      }
      let expenseSubEntitiesPromises = subEntitiesPromises(subEntitiesConfs, mainEntityConf)
      return Promise.all(expenseSubEntitiesPromises)
    }).then(results => {
      callback(true)
      tableRef.current && tableRef.current.onQueryChange()
      setOpen(false)
    }).finally(() => {
      props.setUpdates(props.updates + 1)
    })
  }

  const handleRowDelete = (oldData) => {
    let promises = []
    promises.push(axios.put(apiUrl + 'expense/' + oldData.id, {active: -1}, {headers: {...authHeader()}}))
    oldData.expense_items.forEach(expenseItem => {
      promises.push(axios.put(apiUrl + 'expenseItem/' + expenseItem.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_credit_notes.forEach(creditNote => {
      promises.push(axios.put(apiUrl + 'expenseCreditNote/' + creditNote.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_products.forEach(expenseProduct => {
      promises.push(axios.put(apiUrl + 'expenseProduct/' + expenseProduct.id, {active: -1}, {headers: {...authHeader()}}))
    })
    oldData.expense_invoice_complements.forEach(complement => {
      promises.push(axios.put(apiUrl + 'expenseInvoiceComplement/' + complement.id, {active: -1}, {headers: {...authHeader()}}))
    })
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
            title="Gastos"
            entityPath={entityPath}
            onRowAdd={(event, rowData) => {
              setRowData(null)
              setOpen(true)
            }}
            onRowDelete={(oldData) => {
              return handleRowDelete(oldData)
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
        maxWidth={!matchesXS ? 'lg' : null}
        fullWidth={!matchesXS || null}
        open={open}
        fullScreen={true}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
         <ExpenseForm expense={rowData} onSubmit={handleOnSubmit} />
      </Dialog>
    </>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    machines: state.production.machines,
    productTypes: state.production.productTypes,
    expenseTypes: state.expenses.expenseTypes,
    suppliers: state.expenses.suppliers,
    paymentMethods: state.expenses.paymentMethods,
    paymentForm: state.expenses.paymentForm,
    moneySources: state.expenses.moneySources
  }
}

export default connect(mapStateToProps, null)(ExpenseDataTable)