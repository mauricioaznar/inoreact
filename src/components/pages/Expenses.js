import React from 'react';
import {connect} from 'react-redux'
import SuppliersTable from "./expenses/SuppliersTable";
import ExpensesTable from "./expenses/ExpensesTable";
import Subheader from "../ui/nav/Subheader";


function Expenses(props) {


  const routes = [
    {
      name: 'Gastos',
      path: '/expenses',
      authed: props.isAdmin,
      component: () => {
        return (<ExpensesTable/>)
      }
    },
    {
      name: 'Provedores',
      path: '/expenses/suppliers',
      authed: props.isAdmin || props.isExpenses,
      component: () => {
        return (<SuppliersTable />)
      }
    }
  ]

  return (
    <Subheader
      routes={routes}
    />
  );
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

export default connect(mapStateToProps, null)(Expenses)