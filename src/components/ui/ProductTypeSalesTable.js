import React from 'react'
import {connect} from 'react-redux'
import moment from 'moment'


import {makeStyles, useTheme} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types'
import {Paper} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import Collapse from '@material-ui/core/Collapse'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Grid from '@material-ui/core/Grid'


const useStyles = makeStyles({
  table: {
    overflow: 'auto',
  }
});

const dateFormat = 'YYYY-MM-DD'

const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const headers = [
  'Subtipo',
  'Kilos en venta',
  'Notas',
  'Facturas',
  'Iva',
  'Total sin iva',
  'Total con iva',
  'Precio sin iva',
  'Precio con iva'
]



function ProductTypeSalesRow(props) {
  const classes = useStyles()
  const {row} = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell style={{width: '5%'}}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{width: '15%'}} align={'center'}>{row.name}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.kilos}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.notes}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.invoices}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.tax}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.totalWithoutTax}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.totalWithTax}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.priceWithoutTax}</TableCell>
        <TableCell style={{width: '10%'}} align={'right'}>{row.priceWithTax}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0}}
          colSpan={10}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box>
              <Table
                aria-label="purchases"
              >
                <TableBody>
                  {row.materialRows.map((materialRow) => (
                    <TableRow key={materialRow.id}>
                      <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                      <TableCell style={{width: '15%'}} align={'center'}>{materialRow.name}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.kilos}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.notes}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.invoices}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.tax}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.totalWithoutTax}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.totalWithTax}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.priceWithoutTax}</TableCell>
                      <TableCell style={{width: '10%'}} align={'right'}>{materialRow.priceWithTax}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}



function ProductTypeSalesTable(props) {
  const classes = useStyles();
  const theme = useTheme()

  const [rows, setRows] = React.useState([])
  const [age, setAge] = React.useState('Notas');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  React.useEffect(() => {

    let initialMomentDate = moment(props.initialDate, dateFormat)
    let endMomentDate = moment(props.endDate, dateFormat)


    let productTypeRows = props.productTypes
      .map(productType => {
        return {
          id: productType.id,
          name: productType.name,
          kilos: 0,
          kilosNotes: 0,
          kilosInvoices: 0,
          notes: 0,
          invoices: 0,
          tax: 0
        }
      })

    let materialRows = props.materials
      .map(material => {
        return {
          id: material.id,
          name: material.name,
          kilos: 0,
          kilosNotes: 0,
          kilosInvoices: 0,
          notes: 0,
          invoices: 0,
          tax: 0,
          productTypeId: material.product_type_id
        }
      })

    props.salesProducts.forEach(saleProduct => {
      let dateMoment = moment(saleProduct.date, dateFormat)
      if (dateMoment.isBetween(initialMomentDate, endMomentDate, 'days', '[]')) {
        let materialRowFound = materialRows.find(materialRow => {
          return materialRow.id === saleProduct.material_id
        })
        let productTypeRowFound = productTypeRows.find(productTypeRow => {
          return productTypeRow.id === saleProduct.product_type_id
        })
        materialRowFound.kilos += saleProduct.kilos
        productTypeRowFound.kilos += saleProduct.kilos
        if (saleProduct.order_sale_receipt_type_id === 1) {
          materialRowFound.notes += (saleProduct.kilos * saleProduct.kilo_price)
          materialRowFound.kilosNotes += saleProduct.kilos
          productTypeRowFound.notes += (saleProduct.kilos * saleProduct.kilo_price)
          productTypeRowFound.kilosNotes += saleProduct.kilos
        }
        if (saleProduct.order_sale_receipt_type_id === 2) {
          materialRowFound.invoices += (saleProduct.kilos * saleProduct.kilo_price * 1.16)
          materialRowFound.kilosInvoices += saleProduct.kilos
          productTypeRowFound.invoices += (saleProduct.kilos * saleProduct.kilo_price * 1.16)
          productTypeRowFound.kilosInvoices += saleProduct.kilos
          materialRowFound.tax += (saleProduct.kilos * saleProduct.kilo_price * 0.16)
          productTypeRowFound.tax += (saleProduct.kilos * saleProduct.kilo_price * 0.16)
        }
      }
    })

    materialRows = materialRows.map(materialRow => {

      let totalWithTax = materialRow.invoices + materialRow.notes
      let totalWithoutTax = materialRow.invoices + materialRow.notes - materialRow.tax
      let priceWithTax = !isNaN(totalWithTax / materialRow.kilos) ? (totalWithTax / materialRow.kilos) : 0
      let priceWithoutTax = !isNaN(totalWithoutTax / materialRow.kilos) ? (totalWithoutTax / materialRow.kilos) : 0

      return {
        ...materialRow,
        kilos: formatNumber(materialRow.kilos, 0),
        notes: formatNumber(materialRow.notes),
        invoices: formatNumber(materialRow.invoices),
        tax: formatNumber(materialRow.tax),
        totalWithoutTax: formatNumber(totalWithoutTax),
        totalWithTax: formatNumber(totalWithTax),
        priceWithoutTax: formatNumber(priceWithoutTax),
        priceWithTax: formatNumber(priceWithTax)
      }
    })


    productTypeRows = productTypeRows.map(productTypeRow => {

      let totalWithTax = productTypeRow.invoices + productTypeRow.notes
      let totalWithoutTax = productTypeRow.invoices + productTypeRow.notes - productTypeRow.tax
      let priceWithTax = !isNaN(totalWithTax / productTypeRow.kilos) ? (totalWithTax / productTypeRow.kilos) : 0
      let priceWithoutTax = !isNaN(totalWithoutTax / productTypeRow.kilos) ? (totalWithoutTax / productTypeRow.kilos) : 0

      return {
        ...productTypeRow,
        kilos: formatNumber(productTypeRow.kilos, 0),
        notes: formatNumber(productTypeRow.notes),
        invoices: formatNumber(productTypeRow.invoices),
        tax: formatNumber(productTypeRow.tax),
        totalWithoutTax: formatNumber(totalWithoutTax),
        totalWithTax: formatNumber(totalWithTax),
        priceWithoutTax: formatNumber(priceWithoutTax),
        priceWithTax: formatNumber(priceWithTax),
        materialRows: materialRows.filter(materialRow => materialRow.productTypeId === productTypeRow.id)
      }
    })

    setRows(productTypeRows)
  }, [props.materials, props.sales])


  return (
    <>
      <Grid container direction={'row'} style={{marginBottom: '1em'}}>
        <Grid item xs={2}>
          <FormControl className={classes.formControl} fullWidth>
            <InputLabel id="demo-simple-select-label">Tipo de venta</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={'Notas'}>Notas</MenuItem>
              <MenuItem value={'Facturas'}>Facturas</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
      >
        <Table
          className={classes.table}
          stickyHeader
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}} />
              {headers.map((header, index) => {
                return (
                  <TableCell style={{width: index === 0 ? '15%' : '10%'}} align={'center'} key={header}>
                    {header}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (<ProductTypeSalesRow row={row} key={row.id}/>)
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

ProductTypeSalesTable.propTypes = {}

const mapStateToProps = (state, ownProps) => {
  return {
    salesProducts: state.sales.salesProducts,
    materials: state.production.materials,
    productTypes: state.production.productTypes,
    initialDate: '2020-07-01',
    endDate: '2020-07-31'
  }
}
export default connect(mapStateToProps, null)(ProductTypeSalesTable)