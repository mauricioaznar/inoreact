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
import Grid from '@material-ui/core/Grid'
import {getDayRange, getMonthRange} from '../../../../helpers/dateObjects'
import {dateFormat} from '../../../../helpers/dateFormat'


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
  const classes = useStyles();

  let productions = props.productions

  if (!props.monthsBack && !props.daysBack) {
    return null
  }

  let productTypeLookup = props.materials
    .reduce((acc, productType) => {
      return {
        ...acc,
        [productType.id]: 0
      }
    }, {total: 0})

  let weekProperty
  let productTypeWeekRange

  if (props.monthsBack) {
    weekProperty = 'month'
    productTypeWeekRange = getMonthRange(props.monthsBack, productTypeLookup)
      .reverse()
    console.log(productTypeWeekRange)
  } else if (props.daysBack) {
    weekProperty = 'date'
    productTypeWeekRange = getDayRange(props.daysBack, productTypeLookup)
      .reverse()
  }

  if (productions) {
    productions
      .filter(production => {
        return props.branchId ? props.branchId === production.branch_id : true
      })
      .forEach(production => {
        let productTypeWRItem = productTypeWeekRange
          .find(item => {
            if (props.daysBack) {
              return moment(item.date, dateFormat).isSame(moment(production.start_date, dateFormat))
            } else if (props.monthsBack) {
              return Number(item.month) === production.month && Number(item.year) === production.year
            }
          })
        if (productTypeWRItem && production.product_type_id === props.productTypeId) {
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
        <Grid
          item
          xs={12}
        >
          <TableContainer>
            <Table
              className={classes.table}
              size="small"
              stickyHeader

            >
              <TableHead>
                <TableRow>
                  <TableCell>Dia</TableCell>
                  <TableCell>Total</TableCell>
                  {
                    props.materials.map(productType => {
                      return (
                        <TableCell key={productType.id}>
                          {productType.name}
                        </TableCell>
                      )
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody stripedRows>
                {
                  productTypeWeekRange.map(item => {
                    return (
                      <TableRow key={item.date}>
                        <TableCell>{props.daysBack ? item.date : item.month + '-' +  item.year}</TableCell>
                        <TableCell>{formatNumber(item.total)}</TableCell>
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
      .filter(material => material.product_type_id === ownProps.productTypeId)
      .sort((a, b) => {
        return a.product_type_id > b.product_type_id ? -1
          : a.product_type_id < b.product_type_id ? 1
            : 0
      })
  }
}

export default connect(mapStateToProps, null)(ProductionByProductTypeTable)