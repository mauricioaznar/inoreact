import React from 'react';
import {connect} from 'react-redux'

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import formatNumber from '../../../helpers/formatNumber'
import useFetch from '../../../helpers/useFetch'
import apiUrl from '../../../helpers/apiUrl'
import MauAutocomplete from '../../ui/inputs/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  },
});


const formatCompletion = (x, y) => {
  if (y === 0) {
    return '0'
  }
  return x + ' / ' + y
}

// const dateFormat = 'YYYY-MM-DD'


function EquipmentInventory(props) {
  const classes = useStyles();

  let equipmentInventory = useFetch(apiUrl + 'stats/equipmentInventory')

  const [equipmentSubcategory, setEquipmentSubcategory] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  let rows = []

  if (equipmentInventory) {
    if (loading) {
      setLoading(false)
    }
    rows = equipmentInventory
      .filter(equipment => {
        return equipmentSubcategory ? equipment.equipment_subcategory_id === equipmentSubcategory.id : true
      })
      .sort((a, b) => {
        return a.equipment_category_name > b.equipment_category_name ? 1
          : a.equipment_category_name < b.equipment_category_name ? -1
          : a.equipment_subcategory_name > b.equipment_subcategory_name ? 1
          : a.equipment_subcategory_name < b.equipment_subcategory_name ? -1
            : 0
      })
  }


  return (
    <>
      {
        loading ?
          <CircularProgress
            size={40}
            style={{marginLeft: '2em', marginTop: '2em'}}
          />
          : <Grid
            container
            direction={'column'}
            style={{marginBottom: '2em'}}
          >
            <Grid
              item
              xs
              style={{marginBottom: '2em'}}
            >
              <Typography
                variant={'h5'}
              >
                Inventario
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction={'column'}
            >
              <Grid
                item
                xs={12}
                sm={4}
                style={{marginBottom: '2em'}}
              >
                <MauAutocomplete
                  options={props.equipmentSubcategories}
                  value={equipmentSubcategory}
                  label={'Subcategoria'}
                  onChange={(e, option) => {
                    setEquipmentSubcategory(option)
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
              >
                <TableContainer>
                  <Table
                    className={classes.table}
                    aria-label="spanning table"
                    stickyHeader
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{width: '20%'}}>Refaccion</TableCell>
                        <TableCell style={{width: '20%'}}>Categoria</TableCell>
                        <TableCell style={{width: '20%'}}>Subcategoria</TableCell>
                        <TableCell style={{width: '10%'}}>Cantidad en pedidos pendientes</TableCell>
                        <TableCell style={{width: '10%'}}>Balance</TableCell>
                        <TableCell style={{width: '10%'}}>Minimo requerido</TableCell>
                        <TableCell style={{width: '10%'}}>Maximo requerido</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        rows
                          .map(equipment => {
                            return (
                              <TableRow key={equipment.equipment_id}>
                                <TableCell align={'left'}>{equipment.equipment_description}</TableCell>
                                <TableCell align={'left'}>{equipment.equipment_category_name}</TableCell>
                                <TableCell align={'left'}>{equipment.equipment_subcategory_name}</TableCell>
                                <TableCell align={'right'}>{formatNumber(equipment.requested_equipments, 0)}</TableCell>
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
            </Grid>
         </Grid>
      }
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    equipmentSubcategories: state.maintenance.equipmentSubcategories
  }
}


export default connect(mapStateToProps, null)(EquipmentInventory)