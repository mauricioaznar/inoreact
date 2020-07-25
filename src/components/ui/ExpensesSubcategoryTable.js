import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const expensesRows = Array(20).fill(null).map((element, i) => {
  return {desc: `Gasto ${i}`, date: '2020-01-01', supplierName: `Proveedor ${i}`, total: (Math.random() * 2000)}
})

const expenseCategories = ['Administrativo', 'Maquinaria y equipo', 'Transporte', 'Materia prima', 'Luz', 'Creditos/Financiamientos', 'Nominas', 'Imss', 'Renta', 'Seguridad']


const rows = expenseCategories.map(expenseCategory => {
  return {desc: expenseCategory, total: formatNumber(Math.trunc(Math.random() * 1000000)), cost: (Math.random() * 10).toFixed(2), history: expensesRows}
})

// const total = rows.reduce((prevValue, currentValue) => {
//   return {total: Number(prevValue.total) + Number(currentValue.total)}
// }).total

const total = 100000

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.desc}</TableCell>
        <TableCell align="right">{row.cost}</TableCell>
        <TableCell align="right">{row.total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Gastos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Descripcion</TableCell>
                    <TableCell>Proveedor</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">{historyRow.date}</TableCell>
                      <TableCell>{historyRow.desc}</TableCell>
                      <TableCell>{historyRow.supplierName}</TableCell>
                      <TableCell align="right">{historyRow.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.array.isRequired
}


export default function SpanningTable() {
  const classes = useStyles();

  return (
    <>
      <Typography variant={'h3'} style={{marginTop: '1em', marginBottom: '1em'}}>
        Punto de equilibrio
      </Typography>
      <TableContainer component={Paper} style={{maxHeight: 500}}>
        <Table className={classes.table} stickyHeader aria-label="spanning table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="left">Rubro</TableCell>
              <TableCell align="right">Costo</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row row={row} />
            ))}
            <TableRow />
            <TableRow>
              <TableCell colSpan={4} > &nbsp; </TableCell>
            </TableRow>
            <TableRow>
              <TableCell rowSpan={5} colSpan={2}/>
              <TableCell colSpan={1} >Gastos</TableCell>
              <TableCell align="right">{total}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ventas</TableCell>
              <TableCell align="right">100,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IVA</TableCell>
              <TableCell align="right">20,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Comisiones</TableCell>
              <TableCell align="right">30,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Utilidad</TableCell>
              <TableCell align="right">+ 110,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}