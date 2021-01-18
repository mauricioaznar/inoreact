import React from 'react'
import GridColumnContainer from "../../ui/layout/GridColumnContainer";
import GridRowItem from "../../ui/layout/GridRowItem";
import OrderRequestsDataTable from "../../ui/datatables/OrderRequestsDataTable";

export default function OrderRequestsTable (props) {
  return (
    <GridColumnContainer>
      <GridRowItem>
        <OrderRequestsDataTable />
      </GridRowItem>
    </GridColumnContainer>
  )
}