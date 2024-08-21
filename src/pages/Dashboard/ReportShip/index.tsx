import React from 'react';
import ReportShip from '~/modules/report/reportShip';

type propsType = {

};
const Page = ReportShip.page.index;
export default function ReportShipPage(props:propsType) : React.JSX.Element {
    return <Page />
}