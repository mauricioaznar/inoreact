import React from 'react'
import GridColumnContainer from "../../ui/layout/GridColumnContainer";
import GridRowItem from "../../ui/layout/GridRowItem";
import OrderSalesDataTable from "../../ui/datatables/OrderSalesDataTable";

export default function OrderSalesTable (props) {
  return (
    <GridColumnContainer>
      <GridRowItem>
        <OrderSalesDataTable />
      </GridRowItem>
    </GridColumnContainer>
  )
}