import { Button, Modal, Table } from "antd";
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useMemo, useRef } from 'react';
import { contextReport, fomartNumber } from '../reportSalaryPartner.hook';
import ModalDetail from "./ModalDetail";
import { ReportSalaryPartnerSpace } from "../reportSalaryPartner.modal";
import { get } from "lodash";
type propsType = {

}

export default function TableReport(props:propsType) : React.JSX.Element {
    const { data } = contextReport.useContextReportSalaryPartner;


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
            <Table 
                bordered
                // size='small' 
                sticky={{
                    offsetHeader:-10,
                    getContainer: ()=> ref.current,
                }} 
                columns={columsMemo} 
                dataSource={data}
            />
            {provider}
        </div>
    )
}