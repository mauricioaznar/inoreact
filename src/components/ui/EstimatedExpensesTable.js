import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'
import axios from 'axios'


import {makeStyles} from '@material-ui/core/styles';
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
import apiUrl from '../../helpers/apiUrl'
import authHeader from '../../helpers/authHeader'


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

const dateFormat = 'YYYY-MM-DD'


function compareSubcategories( a, b ) {
  if ( a.estimated_expense < b.estimated_expense ){
    return 1;
  }
  if ( a.estimated_expense > b.estimated_expense ){
    return -1;
  }
  return 0;
}


function compareMaterials( a, b ) {
  if ( a.total_estimated_expense < b.total_estimated_expense ){
    return 1;
  }
  if ( a.total_estimated_expense > b.total_estimated_expense ){
    return -1;
  }
  return 0;
}

function ExpenseCategoryTable(props) {
  const classes = useStyles();

  let expensesEstimation =  props.expensesEstimation

  let rows = []

  if (expensesEstimation) {
    const {
      expenses_estimation_by_material: expensesEstimationByMaterial,
      expenses_estimation_by_expense_subcategory: expensesEstimationByExpenseSubcategory
    } = expensesEstimation

    rows = expensesEstimationByExpenseSubcategory
      .filter(obj => {
        return props.month === obj.month && props.year === obj.year
      })

      .map(expenseSubcategory => {
        return {
          ...expenseSubcategory,
          materials: expensesEstimationByMaterial
            .filter(obj => {
              return props.month === obj.month && props.year === obj.year
            })
            .filter(material => {
            return material.expense_subcategory_id === expenseSubcategory.expense_subcategory_id
            })
            .sort(compareMaterials)
        }
      })
      .sort(compareSubcategories)


  }


  return (
    <>
      <TableContainer
        component={Paper}
      >
        <Table
          className={classes.table}
          aria-label="spanning table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
              <TableCell style={{width: '20%'}} align="center">Rubro</TableCell>
              <TableCell align="center">Gastos real</TableCell>
              <TableCell align="center">Gastos real sin kilos</TableCell>
              <TableCell align="center">Gastos real con kilos</TableCell>
              <TableCell align="center">Kilos en gastos</TableCell>
              <TableCell align="center">Precio por kilo</TableCell>
              <TableCell align="center">Kilos producidos proprocion</TableCell>
              <TableCell align="center">Costo</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <ExpenseCategoryRow key={row.expense_subcategory_id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


function ExpenseCategoryRow(props) {
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
        <TableCell style={{width: '20%'}} align="center">{row.expense_subcategory_name}</TableCell>
        <TableCell align="right">{formatNumber(row.real_expense)}</TableCell>
        <TableCell align="right">{formatNumber(row.real_expense_without_kilos)}</TableCell>
        <TableCell align="right">{formatNumber(row.real_expense_with_kilos)}</TableCell>
        <TableCell align="right">{formatNumber(row.kilos_bought)}</TableCell>
        <TableCell align="right">{formatNumber(row.kilo_price)}</TableCell>
        <TableCell align="right">{formatNumber(row.kilos_produced_proportion)}</TableCell>
        <TableCell align="right">{formatNumber(row.estimated_kilo_cost)}</TableCell>
        <TableCell align="right">{formatNumber(row.estimated_expense)}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell
          style={{paddingBottom: 0, paddingTop: 0, paddingLeft: 0, paddingRight: 0}}
          colSpan={4}
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
                <TableHead>
                  <TableRow>
                    <TableCell style={{width: '20%'}} align="center">Material</TableCell>
                    <TableCell align="center">Kilos producidos</TableCell>
                    <TableCell align="center">Proporcion de {row.expense_subcategory_name.toLowerCase()} en cada kilo</TableCell>
                    <TableCell align="center">Kilos de {row.expense_subcategory_name.toLowerCase()} en la proporcion</TableCell>
                    <TableCell align="center">Costo estimado de {row.expense_subcategory_name.toLowerCase()}</TableCell>
                    <TableCell align="center">Gastos estimados</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.materials.map((material, index) => (
                    <TableRow key={material.material_id}>
                      <TableCell style={{width: '20%'}} align={'center'}>{material.material_name}</TableCell>
                      <TableCell align={'right'}>{formatNumber(material.kilos_produced)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(material.kilo_proportion)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(material.kilos_produced_proportion)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(material.estimated_kilo_cost)}</TableCell>
                      <TableCell align={'right'}>{formatNumber(material.total_estimated_expense)}</TableCell>
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

ExpenseCategoryRow.propTypes = {
  row: PropTypes.object.isRequired
}



function compare( a, b ) {
  if ( a.total < b.total ){
    return 1;
  }
  if ( a.total > b.total ){
    return -1;
  }
  return 0;
}


const mapStateToProps = (state, ownProps) => {
  return {

  }
}

export default connect(mapStateToProps, null)(ExpenseCategoryTable)