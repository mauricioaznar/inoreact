import React from 'react'
import {connect} from 'react-redux'
import OrderRequestsDataTable from '../ui/datatables/OrderRequestsDataTable'
import Subheader from "../ui/nav/Subheader";
import OrderSalesTable from "./sales/OrderSalesTable";
import OrderRequestsTable from "./sales/OrderRequestsTable";



const Sales = (props) => {

  const routes = [
    {
      name: 'Ventas',
      path: '/sales',
      authed: props.isAdmin || props.isSales,
      component: () => {
        return (<OrderSalesTable />)
      }
    },
    {
      name: 'Pedidos',
      path: '/sales/requests',
      authed: props.isAdmin || props.isSales,
      component: () => {
        return (<OrderRequestsTable/>)
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

export default connect(mapStateToProps, null)(Sales)