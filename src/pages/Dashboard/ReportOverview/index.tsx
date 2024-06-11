import React from 'react';
import ReportOverViewModule from '~/modules/reportOverview';

type propsType = {

}
export default function ReportOverview(props:propsType) : React.JSX.Element {
    return (
        <ReportOverViewModule.page.index />
    )
}