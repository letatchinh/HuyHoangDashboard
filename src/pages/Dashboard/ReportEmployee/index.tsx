import React from 'react';
import ReportEmployeeModule from '~/modules/report/reportEmployee';

type propsType = {

}
export default function ReportEmployee(props:propsType) : React.JSX.Element {
    return (
        <ReportEmployeeModule.page.index />
    )
}