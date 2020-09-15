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


function ProductionsByMatMacTable(props) {
  const [product, setProduct] = React.useState(null)
  const [rows, setRows] = React.useState([])

  const {productions} = props

  const classes = useStyles();

  let loading = !props.machineProductions && !props.employeeProductions

  React.useEffect(() => {
    if (props.machineProductions && props.employeeProductions && product) {

      console.log(props.machineProductions)

      let machines = props.machines
        .map(machine => {

          let machineData = props.machineProductions
            .filter((production, index) => {
              return production.machine_id === machine.id &&
                product.id === production.product_id &&
                production.production_events === 0
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

          let preEmployeeProductions = props.employeeProductions
            .filter((production, index) => {
              return production.machine_id === machine.id &&
                product.id === production.product_id &&
                production.production_events === 0
            })

          let employees = props.employees
            .map(employee => {
              let employeeData = preEmployeeProductions
                .filter((production, index) => {
                  return production.employee_id === employee.id
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
              return {
                employee_id: employee.id,
                employee_fullname: employee.fullname,
                employeeData: employeeData
              }
            })
            .filter(employee => {
              return employee.employeeData.length > 2
            })
            .map(employee => {
              let mean = ss.mean(employee.employeeData)
              let standardDeviation = ss.sampleStandardDeviation(employee.employeeData)
              return {
                ...employee,
                mean: mean.toFixed(2),
                sampleStandardDeviation: standardDeviation.toFixed(2),
                n: employee.employeeData.length,
                eightHours: (mean * 8).toFixed(2)
              }
            })
            .sort((a, b) => {
              return Number(a.eightHours) > Number(b.eightHours) ? -1
                : Number(a.eightHours) === Number(b.eightHours) ? 0
                  : 1
            })

          return {
            machine_id: machine.id,
            machine_name: machine.name,
            machine_type_id: machine.machine_type_id,
            employees: employees,
            machineData: machineData
          }
        })
        .filter(machine => {
          return machine.machineData.length > 2
        })
        .map(machine => {
          let mean = ss.mean(machine.machineData)
          let standardDeviation = ss.sampleStandardDeviation(machine.machineData)
          return {
            ...machine,
            mean: mean.toFixed(2),
            sampleStandardDeviation: standardDeviation.toFixed(2),
            n: machine.machineData.length,
            eightHours: (mean * 8).toFixed(2)
          }
        })
        .sort((a, b) => {
          return Number(a.eightHours) > Number(b.eightHours) ? -1
            : Number(a.eightHours) === Number(b.eightHours) ? 0
              : 1
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