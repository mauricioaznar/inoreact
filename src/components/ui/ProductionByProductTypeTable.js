import React from 'react';
import {connect} from 'react-redux'
import moment from 'moment'

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'
import {getDayRange} from '../../helpers/dateObjects'
import {dateFormat} from '../../helpers/dateFormat'
import MauMonthYear from './inputs/MauMonthYear'


const useStyles = makeStyles({
  table: {
    minWidth: 400,
    overflow: 'auto'
  }
});


const formatNumber = (x, digits = 2) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(digits).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// const dateFormat = 'YYYY-MM-DD'


function ProductionByProductTypeTable(props) {
  const [year, setYear] = React.useState(moment().year())
  const [month, setMonth] = React.useState(moment().month() + 1)

  const classes = useStyles();

  let productions = props.productions

  let productTypeLookup = props.materials
    .reduce((acc, productType) => {
      return {
        ...acc,
        [productType.id]: 0
      }
    }, {total: 0})

  let productTypeWeekRange = getDayRange(props.daysBack, productTypeLookup)
    .reverse()

  if (productions) {
    productions
      .filter(production => {
        return props.branchId ? props.branchId === production.branch_id : true
      })
      .forEach(production => {
        let productTypeWRItem = productTypeWeekRange
          .find(item => {
            return moment(item.date, dateFormat).isSame(moment(production.start_date, dateFormat))
          })
        if (productTypeWRItem && production.product_type_id === 1) {
          productTypeWRItem[production.material_id] += production.kilos
          productTypeWRItem.total += production.kilos

        }
      })
  }

  return (
    <>
      <Grid
        container
        direction={'column'}
      >
        <Grid item xs={12}>
          <MauMonthYear
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
          />
        </Grid>
        <Grid
          item
          xs={12}
        >
          <TableContainer
            component={Paper}
          >
            <Table
              className={classes.table}
              size="small"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell>Dia</TableCell>
                  {
                    props.materials.map(productType => {
                      return (
                        <TableCell key={productType.id}>
                          {productType.name}
                        </TableCell>
                      )
                    })
                  }
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  productTypeWeekRange.map(item => {
                    return (
                      <TableRow key={item.date}>
                        <TableCell>{item.date}</TableCell>
                        {
                          props.materials.map(productType => {
                            return (
                              <TableCell
                                align={'right'}
                                key={productType.id}
                              >
                                {formatNumber(item[productType.id])}
                              </TableCell>
                            )
                          })
                        }
                        <TableCell>{formatNumber(item.total)}</TableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}


function compare(a, b) {
  if (a.total < b.total) {
    return 1;
  }
  if (a.total > b.total) {
    return -1;
  }
  return 0;
}


const mapStateToProps = (state, ownProps) => {
  return {
    productTypes: state.production.productTypes,
    materials: state.production.materials
      .filter(material => material.product_type_id === 1)
      .sort((a, b) => {
        return a.product_type_id > b.product_type_id ? -1
          : a.product_type_id < b.product_type_id ? 1
            : 0
      })
  }
}

export default connect(mapStateToProps, null)(ProductionByProductTypeTable)