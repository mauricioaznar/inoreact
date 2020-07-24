import React from 'react'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'


const useStyles = makeStyles({
  table: {
    display: 'block',
    overflowX: 'auto',
  }
});


export default function RequestsTable(props) {
  const classes = useStyles();

  return (
      <div style={{display: 'table', tableLayout:'fixed', width:'100%'}}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {props.headers.map(header => {
                return (<TableCell>{header}</TableCell>)
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows.map((row, rowIndex) => (
              <TableRow key={'row' + rowIndex}>
                {row.map((item, rowItemIndex) => {
                  return (<TableCell key={'rowItem' + rowIndex + '' + rowItemIndex}>{item}</TableCell>)
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
}

RequestsTable.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired
}