import React from 'react'
import SupplierDataTable from "../../ui/datatables/SupplierDataTable";
import GridColumnContainer from "../../ui/layout/GridColumnContainer";
import GridRowItem from "../../ui/layout/GridRowItem";


export default function SuppliersTable () {


    return (<GridColumnContainer>
        <GridRowItem>
            <SupplierDataTable />
        </GridRowItem>
    </GridColumnContainer>)
}