import React from 'react'

import moment from 'moment'


import LineAreaChart from '../charts/LineAreaChart'

const dateFormat = 'YYYY-MM-DD'

function getWeekRange(week = 0, content) {
  let currentStart = moment().add(week, 'weeks').startOf('week');
  let endWeek = moment().startOf('week')
  let weeks = []
  while (currentStart.isBefore(endWeek, '[]')) {
    weeks.push({
      first_day_of_the_week: currentStart.startOf('week').format(dateFormat),
      last_day_of_the_week: currentStart.endOf('week').format(dateFormat),
      current_week_number: '#' + currentStart.week() + ' ' + currentStart.format('YYYY-MM'),
      week: currentStart.startOf('week').format(dateFormat) + ' ' + currentStart.endOf('week').format(dateFormat),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'week')
  }
  return weeks
}


function getDayRange(day = 0, content) {
  let currentStart = moment().add(day, 'days');
  let endDay = moment()
  let days = []

  while (currentStart.isBefore(endDay, '[]')) {
    days.push({
      day: currentStart.format('MM-DD'),
      date: currentStart.format(dateFormat),
      ...content
    })
    currentStart = currentStart.add(1, 'day')
  }
  return days
}



function ExpensesVsSalesChart (props) {

  let dataKeys = {'Ventas': 0, 'Gastos': 0}
  let dataKeysNames = ['Ventas', 'Gastos']
  let monthRange = Array(12)
    .fill({})
    .map((object, index) => {
      return {
        monthName: moment().month(index).format('MMM'),
        month: index + 1,
        ...dataKeys
      }
    })

  if (props.sales && props.expensesNoEstimates && props.expensesEstimates) {

    props.expensesNoEstimates
      .filter(obj => {
        return props.year === obj.year
      })
      .forEach((expenseNoEstimate) => {
        let monthFound = monthRange.find(monthObj => expenseNoEstimate.month === monthObj.month)
        monthFound['Gastos'] += expenseNoEstimate.total
      })

    props.expensesEstimates.expenses_estimation_by_expense_subcategory
      .filter(obj => {
        return props.year === obj.year
      })
      .forEach((expenseEstimate) => {
        let monthFound = monthRange.find(monthObj => expenseEstimate.month === monthObj.month)
        monthFound['Gastos'] += expenseEstimate.estimated_expense
      })

    props.sales.sales
      .filter(obj => {
        return props.year === obj.year
      })
      .forEach((sale) => {
        let monthFound = monthRange.find(monthObj => sale.month === monthObj.month)
        monthFound['Ventas'] += sale.total_with_tax
      })



  }


  return (
    <LineAreaChart
      dataKeys={dataKeysNames}
      data={monthRange}
      xDataKey={'monthName'}
    />
  )

  // let machineNamesArray = props.machines
  //   .filter(machine => {
  //     return machine.machine_type_id === 1
  //   })
  //   .map(machine => {
  //     return machine.name
  //   })

  // let machinesIdObject = props.machines
  //   .reduce(function (obj, itm) {
  //     obj[itm.name] = 0;
  //     return obj;
  //   }, {})

}

export default ExpensesVsSalesChart