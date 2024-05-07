import React, { FC, useMemo } from 'react';
import { WH_VOUCHER_STATUS } from '~/constants/defaultValue';
import module from "../";
import { contextReport, useReportSalaryPartnerPaging, useReportSalaryPartnerQueryParams, useUpdateReportSalaryPartnerParams } from '../reportSalaryPartner.hook';

type propsType = {
    children:any
}
const Provider = contextReport.provider;
export type ItemVoucher = {
    codeSequence: string;
    status: keyof typeof WH_VOUCHER_STATUS;
    totalAmount: number;
    typeVoucher: "PC" | "PT";
    _id: string;
  };
export default function Context(props:propsType) : React.JSX.Element {
    const [query,mutate] : any = useReportSalaryPartnerQueryParams();
    const [keyword, { setKeyword, onParamChange }] = useUpdateReportSalaryPartnerParams(query);
    const [data, fetchDataLoading] = module.hook.useGetReportSalaryPartners(query);
    const paging = useReportSalaryPartnerPaging();
    
    return (
        <Provider.Provider value={{
            data,
            mutate,
            keyword,
            setKeyword,
            onParamChange,
            loading : fetchDataLoading,
            paging,
            query,
        }}>{props.children}</Provider.Provider>
    )
}