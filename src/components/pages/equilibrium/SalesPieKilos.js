import React from 'react'

import CustomPieChart from "../../ui/charts/PieChart";


function SalePieKilos (props) {

  let data = []

  if (props.sales && props.clients) {

    const propertySummed = props.propertySummed || 'kilos_sold'

    data = props.clients.map(client => {
      return {
        name: client.name,
        value: props.sales.sales.reduce((acc, sale) => {
          if (sale.client_id === client.id
          && sale.month === props.month
          && sale.year === props.year) {
            return acc + sale[propertySummed]
          }
          return acc
        }, 0)
      }
    }).sort((a,b) => {
      return a.value > b.value ? -1 : a.value < b.value ? 1 : 0
    })

  }


  return (
    <CustomPieChart
      data={data}
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

export default SalePieKilos