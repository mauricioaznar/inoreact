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
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import ImportExport from '@material-ui/icons/ImportExport'


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

const dateFormat = 'YYYY-MM-DD'

const filterProductions = (production, machine, product) => {
  return production.machine_id === machine.id &&
    product.id === production.product_id &&
    production.production_events === 0
}

const processProductionsForSD = (production, index) => {
  let startDateTime = moment(production.start_date_time, 'YYYY-MM-DD HH:mm:ss')
  let endDateTime = moment(production.end_date_time, 'YYYY-MM-DD HH:mm:ss')
  let durationAsHours = moment.duration(endDateTime.diff(startDateTime)).asHours()
  return production.kilos / durationAsHours
}

const cleanSDData = kiloPerHour => {
  return kiloPerHour > 10
}


const filterForStandardDeviation = entity => {
  return entity.data.length > 2
}

const calculateStandardDeviation = (entity) => {
  let mean = ss.mean(entity.data)
  let standardDeviation = ss.sampleStandardDeviation(entity.data)
  return {
    ...entity,
    mean: mean.toFixed(2),
    sampleStandardDeviation: standardDeviation.toFixed(2),
    n: entity.data.length,
    eightHours: (mean * 8).toFixed(2)
  }
}


const sortStandardDeviation = (a, b) => {
  return Number(a.eightHours) > Number(b.eightHours) ? -1
    : Number(a.eightHours) === Number(b.eightHours) ? 0
      : 1
}

function ProductionsByMatMacTable(props) {
  const [product, setProduct] = React.useState(null)
  const [rows, setRows] = React.useState([])

  const classes = useStyles();

  let loading = !props.machineProductions && !props.employeeProductions

  React.useEffect(() => {
    if (props.machineProductions && props.employeeProductions && product) {


      let machines = props.machines
        .map(machine => {

          let machineData = props.machineProductions
            .filter(productions => filterProductions(productions, machine, product))
            .map(processProductionsForSD)
            .filter(cleanSDData)

          let preEmployeeProductions = props.employeeProductions
            .filter(productions => filterProductions(productions, machine, product))

          let employees = props.employees
            .map(employee => {

              let employeeData = preEmployeeProductions
                .filter((production, index) => {
                  return production.employee_id === employee.id
                })
                .map(processProductionsForSD)
                .filter(cleanSDData)

              return {
                employee_id: employee.id,
                employee_fullname: employee.fullname,
                data: employeeData
              }
            })
            .filter(filterForStandardDeviation)
            .map(calculateStandardDeviation)
            .sort(sortStandardDeviation)

          return {
            machine_id: machine.id,
            machine_name: machine.name,
            machine_type_id: machine.machine_type_id,
            employees: employees,
            data: machineData
          }
        })
        .filter(filterForStandardDeviation)
        .map(calculateStandardDeviation)
        .sort(sortStandardDeviation)
      setRows(machines)
    }
  }, [product, props.employeeProductions, props.machineProductions])

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
          {
            loading
              ? <CircularProgress size={40} style={{marginLeft: '.5em'}}/>
              : <Autocomplete
                  options={props.products}
                  displayName={'description'}
                  value={product}
                  onChange={(e, data) => {
                    setProduct(data)
                  }}
                />
          }
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
                  <TableCell style={{width: '20%'}}>Maquina/Empleado</TableCell>
                  <TableCell style={{width: '15%'}}>n</TableCell>
                  <TableCell style={{width: '15%'}}>Promedio</TableCell>
                  <TableCell style={{width: '15%'}}>Desviacion estandar de la muestra</TableCell>
                  <TableCell style={{width: '15%'}}>Produccion en 8 horas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  rows.map(row => {
                    return (
                      <React.Fragment>
                        <TableRow>
                          <TableCell>&nbsp;</TableCell>
                          <TableCell>{row.machine_name}</TableCell>
                          <TableCell>{row.n}</TableCell>
                          <TableCell>{row.mean}</TableCell>
                          <TableCell>{row.sampleStandardDeviation}</TableCell>
                          <TableCell>{row.eightHours}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={6}
                          >
                            <Table size={'small'}>
                              <Box>
                                <Table
                                  aria-label="purchases"
                                >
                                  <TableBody>
                                    {row.employees.map((employee, index) => (
                                      <TableRow key={employee.employee_id}>
                                        <TableCell style={{width: '5%'}}>&nbsp;</TableCell>
                                        <TableCell style={{width: '20%'}}>{employee.employee_fullname}</TableCell>
                                        <TableCell style={{width: '15%'}}>{employee.n}</TableCell>
                                        <TableCell style={{width: '15%'}}>{employee.mean}</TableCell>
                                        <TableCell style={{width: '15%'}}>{employee.sampleStandardDeviation}</TableCell>
                                        <TableCell style={{width: '15%'}}>{employee.eightHours}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Table>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
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
    employees: state.general.employees,
    material: state.production.materials
  }
}

export default connect(mapStateToProps, null)(ProductionsByMatMacTable)