import React from 'react';
import QuotationModule from "~/modules/sale/quotation";

type propsType = {

}
export default function index(props:propsType) : React.JSX.Element {
    return (
        <QuotationModule.page.index />
    )
}