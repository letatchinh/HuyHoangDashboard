import { Button, Flex, Modal, Table } from "antd";
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useMemo, useRef } from 'react';
import { contextReport, fomartNumber } from '../reportSalaryPartner.hook';
import ModalDetail from "./ModalDetail";
import { ReportSalaryPartnerSpace } from "../reportSalaryPartner.modal";
import { get } from "lodash";
import SearchAnt from "~/components/Antd/SearchAnt";
import DateForm from "~/components/common/DateForm";
import MonthForm from "~/components/common/MonthForm";
import { pagingTable } from "~/utils/helpers";
import dayjs from "dayjs";
type propsType = {

}

export default function TableReport(props:propsType) : React.JSX.Element {
    const { data,onParamChange,loading ,paging,keyword,setKeyword,query} = contextReport.useContextReportSalaryPartner;


    const [modelDetail,provider]=Modal.useModal();
    const ref= useRef<any>();

    const onDetailId = useCallback((id?:string) =>{
        
        modelDetail.info(
            {
                title:'Chi tiết lương',
                content: <ModalDetail id={id}/> ,
                icon:<></>,
                width:'90vw',
                closable:true,
                maskClosable:true,
                footer:null
            }
        )
    },[])
    const columsMemo = useMemo(()=>{
        return [
            {
                title:'Phiên',
                align:'center',
                dataIndex:'session',
                width:200,
                render:(session:any)=>{
                    return <i>{session.gt}</i>
                }
            },
            {
                title: 'Tên CTV',
                dataIndex:'fullname',
                render:(name,{_id})=>{
                    return <Button type="link" onClick={()=>onDetailId(_id)}>{name}</Button>
                }
                
            },
            {
                title: 'DS cá nhân',
                width: 160,
                align: 'center',
                dataIndex: 'revenue',
                render:(revenue:ReportSalaryPartnerSpace.Revenue[],record)=>{
                   return fomartNumber(revenue.reduce((acc,res)=>acc+= get(res,'revenueSelf',0),0))
                }
            },
            {
                title: 'DS đội nhóm',
                width: 160,
                align: 'center',
                dataIndex: 'revenue',
                render:(revenue:ReportSalaryPartnerSpace.Revenue[],record)=>{
                    return fomartNumber(revenue.reduce((acc,res)=>acc+= get(res,'revenueGroup',0),0))
                }
            },
        ] as ColumnsType
    },[onDetailId])

    return (
        <div ref={ref}>
            <Flex gap={10}>
            <SearchAnt value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange}/>
            <MonthForm initData={{
                month : query?.startDate ? dayjs(query.startDate) : null
            }} onParamChange={onParamChange}/>
            </Flex>
            <Table 
                bordered
                size='small' 
                sticky={{
                    offsetHeader:-10,
                    getContainer: ()=> ref.current,
                }}
                loading={loading}
                columns={columsMemo} 
                dataSource={data}
                pagination={pagingTable(paging,onParamChange)}
            />
            {provider}
        </div>
    )
}