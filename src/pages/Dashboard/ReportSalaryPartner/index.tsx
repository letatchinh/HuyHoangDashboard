import React from 'react';
import ReportSalaryPartner from '~/modules/reportSalaryPartner';

type propsType = {

};
const Page = ReportSalaryPartner.page.index;
export default function ReportSalaryPartnerPage(props:propsType) : React.JSX.Element {
    return <Page />
}