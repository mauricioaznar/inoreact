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
import Grid from '@material-ui/core/Grid'
import Autocomplete from '../ui/inputs/Autocomplete'
import moment from 'moment'
import * as ss from 'simple-statistics'


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


function ProductionsByMatMacTable(props) {
  const [product, setProduct] = React.useState(null)
  const [rows, setRows] = React.useState([])

  const {productions} = props

  const classes = useStyles();

  React.useEffect(() => {
    if (props.productions && product) {
      let machines = props.machines
        .map(machine => {
          return {
          machine_id: machine.id,
          machine_name: machine.name,
          machine_type_id: machine.machine_type_id,
          data: props.productions
            .filter((production, index) => {
              if (index === 0) {
                console.log(production)
              }
              return production.machine_id === machine.id && product.id === production.product_id
            })
            .map((production, index) => {
              let startDateTime = moment(production.start_date_time, 'YYYY-MM-DD HH:mm:ss')
              let endDateTime = moment(production.end_date_time, 'YYYY-MM-DD HH:mm:ss')
              let durationAsHours = moment.duration(endDateTime.diff(startDateTime)).asHours()
              return production.kilos / durationAsHours
            })
            .filter(kiloPerHour => {
              return kiloPerHour > 10
            })
          }
        })
        .filter(machine => {
          return machine.data.length > 2
        })
        .map(machine => {
          let mean = ss.mean(machine.data)
          let standardDeviation = ss.sampleStandardDeviation(machine.data)
          return {
            ...machine,
            mean: mean.toFixed(2),
            sampleStandardDeviation: standardDeviation.toFixed(2),
            n: machine.data.length,
            eightHours: (mean * 8).toFixed(2)
          }
        })
      setRows(machines)
    }
  }, [product, productions])

  return (
    <>
      <Grid
        container
        direction={'column'}
      >
        <Grid
          item
          xs={12}
          sm={4}
        >
          <Autocomplete
            options={props.products}
            displayName={'description'}
            value={product}
            onChange={(e, data) => {
              setProduct(data)
            }}
          />
        </Grid>
        <Grid
          item
          xs
          style={{marginTop: '2em'}}
        >
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
                  <TableCell style={{width: '20%'}}>Maquina</TableCell>
                  <TableCell>N</TableCell>
                  <TableCell>Promedio</TableCell>
                  <TableCell>Muestra de la desviacion estandar</TableCell>
                  <TableCell>Produccion en 8 horas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(row => {
                    return (
                      <TableRow key={row.machine_id}>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>{row.machine_name}</TableCell>
                        <TableCell>{row.n}</TableCell>
                        <TableCell>{row.mean}</TableCell>
                        <TableCell>{row.sampleStandardDeviation}</TableCell>
                        <TableCell>{row.eightHours}</TableCell>
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



const mapStateToProps = (state, ownProps) => {
  return {
    branches: state.general.branches,
    products: state.production.products,
    machines: state.production.machines,
    material: state.production.materials
  }
}

export default connect(mapStateToProps, null)(ProductionsByMatMacTable)