import React from 'react';
import {connect} from 'react-redux'
import moment from 'moment'
import xlsx from 'xlsx'
import fileSaver from 'file-saver'

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import ImportExport from '@material-ui/icons/ImportExport';
import IconButton from '@material-ui/core/IconButton'


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatCompletion= (x, y) => {
  if (y === 0) {
    return '0'
  }
  return x + ' / ' + y
}

// const dateFormat = 'YYYY-MM-DD'



function InvoicesBySupTable(props) {
  const classes = useStyles();

  let invoices =  props.invoices

  let tableRef = React.useRef()

  let rows = []

  if (invoices) {

    rows = invoices
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })

  }

  const handleImportExportButton = (e) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    let workbook = xlsx.utils.book_new()
    let invoicesExcel = xlsx.utils.table_to_sheet(tableRef.current)
    xlsx.utils.book_append_sheet(workbook, invoicesExcel, 'Facturas')
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {type: fileType})
    fileSaver.saveAs(data, 'Facturas de ' + moment().month(props.month - 1).year(props.year).format('MMMM - YYYY') + fileExtension)
  }

  return (
    <>
      <Grid
        item
        xs={12}
      >
          <Typography
            variant={'h5'}
            style={{marginBottom: '0.5em'}}
          >
            Facturas por proveedor
            <IconButton onClick={(e) => {
                handleImportExportButton(e)
            }}>
              <ImportExport />
            </IconButton>
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TableContainer
            component={Paper}
            style={{maxHeight: 550}}
          >
            <Table
              className={classes.table}
              aria-label="spanning table"
              size="small"
              stickyHeader
              ref={tableRef}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{width: '20%'}}>Proveedor</TableCell>
                  <TableCell style={{width: '10%'}}>Codigos internos</TableCell>
                  <TableCell style={{width: '10%'}}>Bancos</TableCell>
                  <TableCell style={{width: '10%'}}>Fecha</TableCell>
                  <TableCell># Facturas</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>ISR</TableCell>
                  <TableCell>IVA</TableCell>
                  <TableCell>ISR ret.</TableCell>
                  <TableCell>IVA ret.</TableCell>
                  <TableCell>Complementos</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(invoice => {
                    return (
                      <TableRow key={invoice.supplier_id + '-' + invoice.start_date}>
                        <TableCell align={'left'}>{invoice.supplier_name}</TableCell>
                        <TableCell align={'right'}>{invoice.internal_codes}</TableCell>
                        <TableCell align={'right'}>{invoice.money_sources}</TableCell>
                        <TableCell align={'right'}>{invoice.start_date}</TableCell>
                        <TableCell align={'right'}>{invoice.invoices}</TableCell>
                        <TableCell align={'right'}>{formatNumber(invoice.total)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(invoice.isr)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(invoice.tax)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(invoice.isr_retained)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(invoice.tax_retained)}</TableCell>
                        <TableCell align={'right'}>{formatCompletion(invoice.complements_delivered, invoice.complements)}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
    </>
  );
}


export default connect(null, null)(InvoicesBySupTable)