import React from 'react';
import ReportProductSupplierModule from '~/modules/reportProductSupplier';

type propsType = {

}
export default function ReportProductSupplier(props:propsType) : React.JSX.Element {
    return (
        <ReportProductSupplierModule.page.index />
    )
}