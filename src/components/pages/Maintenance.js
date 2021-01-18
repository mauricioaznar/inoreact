import React from 'react'
import ProductionEventsDataTable from '../ui/datatables/ProductionEventsDataTable'
import MachineDataTable from '../ui/datatables/MachineDataTable'
import EquipmentDataTable from '../ui/datatables/EquipmentDataTable'
import EquipmentTransactionDataTable from '../ui/datatables/EquipmentTransactionDataTable'
import EquipmentInventory from './maintenance/EquipmentInventory'
import {connect} from 'react-redux'
import Subheader from "../ui/nav/Subheader";

function Maintenance (props) {


  const routes = [
    {
      name: 'Inventario',
      path: '/maintenance',
      authed: true,
      component: () => {
        return (
          <EquipmentInventory />
        )
      }
    },
    {
      name: 'Reportes de mantenimiento',
      path: '/maintenance/productionEvent',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <ProductionEventsDataTable />
        )
      }
    },
    {
      name: 'Transacciones',
      path: '/maintenance/equipmentTransaction',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <EquipmentTransactionDataTable />
        )
      }
    },
    {
      name: 'Maquinas',
      path: '/maintenance/machine',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <MachineDataTable />
        )
      }
    },
    {
      name: 'Refacciones',
      path: '/maintenance/equipment',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <EquipmentDataTable />
        )
      }
    }
  ]


  return (
    <Subheader
      routes={routes}
    />
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    isAdmin: state.auth.isAdmin,
    isSuperAdmin: state.auth.isSuperAdmin,
    isProduction: state.auth.isProduction,
    isExpenses: state.auth.isExpenses,
    isSales: state.auth.isSales
  }
}

export default connect(mapStateToProps, null)(Maintenance)