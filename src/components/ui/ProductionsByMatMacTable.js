import React from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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



function ExpensesByCatSubBraTable(props) {
  const classes = useStyles();

  let rows = []

  if (props.productions) {

  }


  return (
    <>
      <TableContainer
        component={Paper}
        style={{maxHeight: 550}}
      >
        <Table
          className={classes.table}
          aria-label="spanning table"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
              <TableCell style={{width: '20%'}}>Rubro</TableCell>
              <TableCell>Costo</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <ExpenseByCatSubBraRow key={row.expense_category_id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


function ExpenseByCatSubBraRow(props) {
  const {row} = props;
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow>

      </TableRow>
    </React.Fragment>
  );
}

ExpenseByCatSubBraRow.propTypes = {
  row: PropTypes.object.isRequired
}




const mapStateToProps = (state, ownProps) => {
  return {
    branches: state.general.branches,
    products: state.production.products,
    machines: state.production.machines,
    material: state.production.materials
  }
}

export default connect(mapStateToProps, null)(ExpensesByCatSubBraTable)