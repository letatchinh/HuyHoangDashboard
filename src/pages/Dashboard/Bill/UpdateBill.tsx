import React from 'react';
import BillModule from "~/modules/bill";
type propsType = {

}
export default function UpdateBill(props:propsType) : React.JSX.Element {
    
    return (
        <BillModule.storeProvider.UpdateBillProvider>
            <BillModule.page.update/>
        </BillModule.storeProvider.UpdateBillProvider>
    )
}