import React from 'react'
import {connect} from 'react-redux'
import formatNumber from '../../../../helpers/formatNumber'
import {makeStyles} from '@material-ui/core/styles'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%'
  },
  secondaryClass: {
    width: '100%'
  }
}));


const InventoryTable = (props) => {


  let type = props.type === 'material' ? 'material' : 'product'


  let materials = []

  let products = []

  console.log(props.inventory)

  if (props.inventory && props.inventory.length > 0) {
    materials = props.bagsMaterials
      .map(material => {

        const {kilosBalance, groupsBalance} = props.inventory.reduce((acc, product) => {

          return product.material_id === material.id ?
            {
              kilosBalance: acc.kilosBalance + product.kilos_balance,
              groupsBalance: acc.groupsBalance + product.groups_balance
            } :
            acc
        }, {kilosBalance: 0, groupsBalance: 0})

        return {
          ...material,
          kilos_balance: kilosBalance,
          groups_balance: groupsBalance
        }
      })
      .filter(material => {
        return material.kilos_balance > 1 || material.kilos_balance < -1
      })

    products = props.inventory
      .filter(product => {
        return product.kilos_balance > 1 || product.kilos_balance < -1
      })
      .sort((a, b) => {
        return a.material_id > b.material_id ? 1 : a.material_id < b.material_id ? -1 : 0
      })
  }

  const MaterialsTable = (
    <Grid container direction={'column'}>
      <Grid item  style={{marginBottom: '1em'}}>
        <Typography variant={'h4'}>
          Inventario por subtipos
        </Typography>
      </Grid>
      <Grid item>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Subtipo</TableCell>
                <TableCell>Kilos</TableCell>
                <TableCell>Bultos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.name}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell align="right">{formatNumber(material.kilos_balance)}</TableCell>
                  <TableCell align="right">{formatNumber(material.groups_balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )

  const ProductsTable = (
    <Grid container direction={'column'}>
      <Grid item  style={{marginBottom: '1em'}}>
        <Typography variant={'h4'}>
          Inventario por productos
        </Typography>
      </Grid>
      <Grid item>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Kilos</TableCell>
                <TableCell>Bultos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.description}>
                  <TableCell>{product.description}</TableCell>
                  <TableCell align="right">{formatNumber(product.kilos_balance)}</TableCell>
                  <TableCell align="right">{formatNumber(product.groups_balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )

  return type === 'material' ? MaterialsTable : ProductsTable
}

const mapStateToProps = (state, ownProps) => {
  return {
    bagsMaterials: state.production.materials
      .filter(material => {
        return material.product_type_id === 1 || material.product_type_id === 4
      })
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InventoryTable)