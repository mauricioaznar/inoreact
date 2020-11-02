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
import formatNumber from '../../../helpers/formatNumber'


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


const formatCompletion= (x, y) => {
  if (y === 0) {
    return '0'
  }
  return x + ' / ' + y
}

// const dateFormat = 'YYYY-MM-DD'



function EquipmentInventory(props) {
  const classes = useStyles();

  let equipmentInventory =  props.equipmentInventory


  let rows = []

  if (equipmentInventory) {

    rows = equipmentInventory

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
            Inventario de refacciones
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TableContainer>
            <Table
              className={classes.table}
              aria-label="spanning table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Refaccion</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Subcategoria</TableCell>
                  <TableCell>Cantidad en pedidos pendientes</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Minimo requerido</TableCell>
                  <TableCell>Maximo requerido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(equipment => {
                    return (
                      <TableRow key={equipment.equipment_id}>
                        <TableCell align={'left'}>{equipment.equipment_description}</TableCell>
                        <TableCell align={'left'}>{equipment.equipment_category_name}</TableCell>
                        <TableCell align={'left'}>{equipment.equipment_subcategory_name}</TableCell>
                        <TableCell align={'left'}>{formatNumber(equipment.requested_equipments, 0)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(equipment.equipment_balance, 0)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(equipment.min_quantity, 0)}</TableCell>
                        <TableCell align={'right'}>{formatNumber(equipment.max_quantity, 0)}</TableCell>
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


export default connect(null, null)(EquipmentInventory)