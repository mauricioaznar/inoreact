import React from 'react';
import {connect} from 'react-redux'
import ProductionDataCapture from './production/ProductionDataCapture'
import ProductionInventory from './production/ProductionInventory'
import ProductionSummary from './production/ProductionSummary'
import ProductionCalculations from './production/ProductionCalculations'
import ProductionToProduce from './production/ProductionToProduce'
import Subheader from "../ui/nav/Subheader";


function Production(props) {

  const routes = [
    {
      name: 'Inventario',
      path: '/production',
      authed: true,
      component: () => {
        return (
          <ProductionInventory />
        )
      }
    },
    {
      name: 'Captura de datos',
      path: '/production/dataCapture',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <ProductionDataCapture />
        )
      }
    },
    {
      name: 'Resumen',
      path: '/production/summary',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <ProductionSummary />
        )
      }
    },
    {
      name: 'Por producir',
      path: '/production/toProduce',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <ProductionToProduce />
        )
      }
    },
    {
      name: 'Calculos',
      path: '/production/calculations',
      authed: props.isAdmin || props.isProduction,
      component: () => {
        return (
          <ProductionCalculations />
        )
      }
    }
  ]

  return (
   <Subheader routes={routes} />
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

export default connect(mapStateToProps, null)(Production)