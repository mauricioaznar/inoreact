import React from "react";
import TextField from "@material-ui/core/TextField";
import {
  DateRangePicker,
  DateRangeDelimiter
} from "@material-ui/pickers";
import Grid from '@material-ui/core/Grid'
import {connect} from 'react-redux'
import dateFormat from '../../helpers/dateFormat'
import moment from 'moment'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableBody from '@material-ui/core/TableBody'

function EmployeePerformanceTable(props) {
  const [selectedDate, handleDateChange] = React.useState([null, null]);
  const [rows, setRows] = React.useState([])
  const [datesObj, setDatesObj] = React.useState({})

  React.useEffect(() => {
    if (props.employeeProductions && selectedDate[0] !== null && selectedDate[1] !== null) {
      let aMoment = selectedDate[0]
      let bMoment = selectedDate[1]
      let employees = []
      let dates = {}
      for (let currentMomentDate = aMoment.clone(); currentMomentDate.isSameOrBefore(bMoment); currentMomentDate.add(1, 'days')) {
        dates[currentMomentDate.format(dateFormat)] = {avg: 0, count: 0, sum: 0}
      }
      employees = props.employees.map(employee => {
        return {
          ...employee,
          count: 0,
          sum: 0,
          ...JSON.parse(JSON.stringify(dates))
        }
      })
      props.employeeProductions
        .filter(empProduction => {
          let startDateTimeMoment = moment(empProduction.start_date_time)
          return startDateTimeMoment.isBetween(aMoment, bMoment, null, '[]')
        })
        .map(empProduction => {
          let startDateTimeMoment = moment(empProduction.start_date_time).format(dateFormat)
          let employee = employees
            .find(employee => {
              return employee.id === empProduction.employee_id
            })
          if (employee) {
            employee[startDateTimeMoment].sum += empProduction.performance
            employee[startDateTimeMoment].count += 1
            employee[startDateTimeMoment].avg = Math.trunc(employee[startDateTimeMoment].sum / employee[startDateTimeMoment].count)
            employee.count += 1
            employee.sum += empProduction.performance
            employee.avg = Math.trunc(employee.sum / employee.count)
          }
        })
      setRows(employees
        .filter(employee => {
          return employee.count > 0
        }))
      setDatesObj(dates)
    }
  }, [props.employeeProductions, selectedDate])


  console.log(rows)

  return (
    <Grid container direction={'column'}>
      <Grid item>
        <DateRangePicker
          startText="Inicio"
          endText="Fin"
          value={selectedDate}
          inputFormat={'YYYY-MM-DD'}
          onChange={date => handleDateChange(date)}
          renderInput={(startProps, endProps) => (
            <>
          <TextField {...startProps} helperText={null} />
          <DateRangeDelimiter> a </DateRangeDelimiter>
          <TextField {...endProps} helperText={null} />
        </>
          )}
        />
      </Grid>
      <Grid item>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Empleado</TableCell>
                {
                  Object.keys(datesObj).map((date, i) => {
                    return (
                      <TableCell>
                        {date}
                      </TableCell>
                    )
                  })
                }
                <TableCell>Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell >
                    {employee.fullname}
                  </TableCell>
                  {
                    Object.keys(datesObj).map((date, i) => {
                      return (
                        <TableCell>
                          {employee[date].avg}
                        </TableCell>
                      )
                    })
                  }
                  <TableCell>{employee.avg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state, ownProps) => {
  return {
    employees: state.general.employees
  }
}

export default connect(mapStateToProps, null)(EmployeePerformanceTable)