import React, { FC, useMemo } from 'react';
import module from "../";
import { contextReport } from '../reportSalaryPartner.hook';

type propsType = {
    children:any
}
const Provider = contextReport.provider;

export default function Context(props:propsType) : React.JSX.Element {
    const query = useMemo(() => ({}), []);
    const [data, fetchDataLoading] = module.hook.useGetReportSalaryPartners(query);
    return (
        <Provider.Provider value={{data}}>{props.children}</Provider.Provider>
    )
}