import React from 'react';
import ReportSupplierModule from '~/modules/report/reportSupplier';

type propsType = {

}
export default function ReportSupplier(props:propsType) : React.JSX.Element {
    return (
        <ReportSupplierModule.page.index />
    )
}