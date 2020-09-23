import React from 'react'
import Grid from '@material-ui/core/Grid'
import ExpenseDataTable from '../ui/datatables/ExpenseDataTable'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'
import CircularProgress from '@material-ui/core/CircularProgress'
import ImportExport from '@material-ui/icons/ImportExport'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'
import axios from 'axios'
import {DatePicker} from '@material-ui/pickers'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles((theme) => {
  return {
    rowContainer: {
      paddingLeft: '2em',
      paddingRight: '2em'
    }
  }
})


const mapExpenseToInvoice = expense => {
  let total = 0
  expense.expense_items.forEach(expenseItem => {
    total += expenseItem.subtotal
  })
  let expenseMoneySource = expense.expense_money_source ? expense.expense_money_source.name : ''
  let expenseInternalCode = expense.internal_code
  let expenseInvoicePaymentForm = expense.expense_invoice_payment_form ? expense.expense_invoice_payment_form.name : ''
  let expenseInvoicePaymentFormAbb = expense.expense_invoice_payment_form ? expense.expense_invoice_payment_form.name.substring(0, 6) : ''
  let abbreviation = expenseMoneySource + ' ' + expenseInvoicePaymentFormAbb + ' ' + expenseInternalCode
  return {
    '#': abbreviation,
    'Proveedor': expense.supplier.name,
    'Fecha de pago': expense.date_paid,
    'Fecha de emision': expense.date_emitted,
    'Banco': expenseMoneySource,
    'Forma de pago': expenseInvoicePaymentForm,
    'Estado de la factura': expense.expense_invoice_status.name,
    'Total': total,
    'Iva': expense.tax,
    'Isr': +(total - expense.tax).toFixed(2),
    'Codigo interno': expenseInternalCode,
    'Codigo de la factura': expense.invoice_code,
    'ISR retenido': expense.invoice_isr_retained,
    'IVA retenido': expense.invoice_tax_retained,
    'Complementos': expense.expense_invoice_complements.map(complement => {
      return (complement.delivered === 1 ? 'E' : 'P') + ' ' + complement.name
    }).join(', ')
  }
}

const dateFormat = 'YYYY-MM-DD'

const sortInvoices = (a, b) => {
  let aMomentDate = moment(a.date_paid, 'YYYY-MM-DD')
  let bMomentDate = moment(b.date_paid, 'YYYY-MM-DD')
  let aExpenseMoneySourceId = a.expense_money_source_id
  let bExpenseMoneySourceId = b.expense_money_source_id
  let aExpensePaymentFormId = a.expense_invoice_payment_form_id
  let bExpensePaymentFormId = b.expense_invoice_payment_form_id
  let aInternalCode = ''
  let bInternalCode = ''
  const isCharNumber = (c) => {
    return c >= '0' && c <= '9';
  }
  for (let i = 0; i < a.internal_code.length; i++) {
    if (isCharNumber(a.internal_code.charAt(i))) {
      aInternalCode += a.internal_code.charAt(i)
    } else {
      break
    }
  }
  for (let i = 0; i < b.internal_code.length; i++) {
    if (isCharNumber(b.internal_code.charAt(i))) {
      bInternalCode += b.internal_code.charAt(i)
    } else {
      break
    }
  }
  return aExpenseMoneySourceId > bExpenseMoneySourceId ? 1
    : aExpenseMoneySourceId < bExpenseMoneySourceId ? -1
      : aExpensePaymentFormId > bExpensePaymentFormId ? 1
        : aExpensePaymentFormId < bExpensePaymentFormId ? -1
          : aMomentDate.isAfter(bMomentDate) ? 1
            : aMomentDate.isBefore(bMomentDate) ? -1
              : aInternalCode === '' && Number(bInternalCode) > 0 ? -1
                : Number(aInternalCode) > 0 && bInternalCode === '' ? 1
                  : Number(aInternalCode) > Number(bInternalCode) ? 1
                    : Number(aInternalCode) < Number(bInternalCode) ? -1
                      : 0
}

export default function Expenses(props) {
  const [date, setDate] = React.useState(moment().format('YYYY-MM-DD'))
  const [loading, setLoading] = React.useState(false)
  const [updates, setUpdates] = React.useState(0)
  const [exportedExpenses, setExportedExpenses] = React.useState(null)

  const theme = useTheme()

  const matchesXS = useMediaQuery(theme.breakpoints.down('md'))

  const classes = useStyles()


  const exportExcel = () => {
    if (!loading) {
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';
      let workbook = xlsx.utils.book_new()
      let paidInvoicedExcel = xlsx.utils.json_to_sheet(exportedExpenses.paidInvoices)
      xlsx.utils.book_append_sheet(workbook, paidInvoicedExcel, 'Egresos pagadas')
      let provisionedInvoicedExcel = xlsx.utils.json_to_sheet(exportedExpenses.provisionedInvoices)
      xlsx.utils.book_append_sheet(workbook, provisionedInvoicedExcel, 'Facturas provisionadas')
      let pendingPaidInvoicesExcel = xlsx.utils.json_to_sheet(exportedExpenses.pendingPaidInvoices)
      xlsx.utils.book_append_sheet(workbook, pendingPaidInvoicesExcel, 'Facturas pendientes de pagar')
      let pendingEmittedInvoicesExcel = xlsx.utils.json_to_sheet(exportedExpenses.pendingEmittedInvoices)
      xlsx.utils.book_append_sheet(workbook, pendingEmittedInvoicesExcel, 'Facturas pendientes de emitir')
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })
      const data = new Blob([excelBuffer], {type: fileType})
      fileSaver.saveAs(data, 'Facturas de ' + fileExtension)
    }
  }

  React.useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      let startDate = moment(date).startOf('month').format(dateFormat)
      let endDate = moment(date).add(1, 'month').startOf('month').format(dateFormat)
      const paidInvoicesResponse = await axios.get(apiUrl + 'expense/list?' +
        'paginate=false' +
        '&filter_exact_1=expense_type_id' +
        '&filter_exact_value_1=2' +
        '&start_date_1=date_paid' +
        '&start_date_value_1=' + startDate +
        '&end_date_1=date_paid' +
        '&end_date_value_1=' + endDate,
        {headers: {...authHeader()}})
      const provisionedInvoicesResponse = await axios.get(apiUrl + 'expense/list?' +
        'paginate=false' +
        '&filter_exact_1=expense_type_id' +
        '&filter_exact_value_1=2' +
        '&start_date_1=invoice_provision_date' +
        '&start_date_value_1=' + startDate +
        '&end_date_1=invoice_provision_date' +
        '&end_date_value_1=' + endDate,
        {headers: {...authHeader()}})
      const pendingPaidInvoicesResponse = await axios.get(apiUrl + 'expense/list?' +
        'paginate=false' +
        '&filter_exact_1=expense_type_id' +
        '&filter_exact_value_1=2' +
        '&filter_exact_2=date_paid' +
        '&filter_exact_value_2=0000-00-00',
        {headers: {...authHeader()}})
      const pendingEmittedInvoicesResponse = await axios.get(apiUrl + 'expense/list?' +
        'paginate=false' +
        '&filter_exact_1=expense_type_id' +
        '&filter_exact_value_1=2' +
        '&filter_exact_2=date_emitted' +
        '&filter_exact_value_2=0000-00-00',
        {headers: {...authHeader()}})
      if (active) {
        setExportedExpenses({
          paidInvoices: paidInvoicesResponse.data.data.sort(sortInvoices).map(mapExpenseToInvoice),
          provisionedInvoices: provisionedInvoicesResponse.data.data.sort(sortInvoices).map(mapExpenseToInvoice),
          pendingPaidInvoices: pendingPaidInvoicesResponse.data.data.sort(sortInvoices).map(mapExpenseToInvoice),
          pendingEmittedInvoices: pendingEmittedInvoicesResponse.data.data.sort(sortInvoices).map(mapExpenseToInvoice)
        })
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [date, updates])

  return (
    <Grid
      container
      direction={'column'}
    >
      <Grid
        item
        container
        className={classes.rowContainer}
        style={{marginTop: '4em'}}
      >
        <Grid item>
          <Typography variant={matchesXS ? 'h2' : 'h1'}>
            Gastos
          </Typography>
        </Grid>
      </Grid>

      <Grid
        item
        container
        direction={matchesXS ? 'column' : 'row'}
        className={classes.rowContainer}
        style={{marginTop: '4em', marginBottom: '2em'}}
      >
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
        >
          <FormControl>
            <DatePicker
              value={date}
              variant={'inline'}
              inputFormat={'yyyy-MM'}
              clearable
              renderInput={(props) => <TextField {...props} helperText={null}/>}
              autoOk={true}
              views={["month"]}
              minDate={new Date("2018-01-01")}
              maxDate={new Date("2021-12-31")}
              onChange={(momentDate) => {
                setDate(momentDate)
              }}
              animateYearScrolling
              PopoverProps={{
                anchorOrigin: {horizontal: "left", vertical: "bottom"},
                transformOrigin: {horizontal: "left", vertical: "top"}
              }}
            />
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          md={2}
          style={{marginLeft: matchesXS ? 0 : '.5em'}}
        >
          {
            loading
              ? <CircularProgress size={40} style={{marginLeft: '.5em'}}/>
              : <IconButton
                onClick={(e) => {
                  exportExcel()
                }}
                color={'action'}
                fontSize={'small'}
                style={{marginLeft: '.5em'}}
              >
                <ImportExport />
              </IconButton>
          }
        </Grid>
      </Grid>
      <Grid
        item
        xs
        className={classes.rowContainer}
        style={{marginBottom: '2em'}}
      >
        <ExpenseDataTable
          updates={updates}
          setUpdates={setUpdates}
        />
      </Grid>
    </Grid>
  )
}