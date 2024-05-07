/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Flex, Modal, Popover, Row, Space, Table, Tag, Typography } from "antd";
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useMemo, useRef } from 'react';
import { contextReport, fomartNumber } from '../reportSalaryPartner.hook';
import ModalDetail from "./ModalDetail";
import { ReportSalaryPartnerSpace } from "../reportSalaryPartner.modal";
import { get } from "lodash";
import SearchAnt from "~/components/Antd/SearchAnt";
import MonthForm from "~/components/common/MonthForm";
import { pagingTable } from "~/utils/helpers";
import dayjs from "dayjs";
import { MAP_STATUS_VOUCHERS_VI } from "~/constants/defaultValue";
import { CheckCircleFilled, WarningOutlined, } from "@ant-design/icons";


type propsType = {

}

const RenderVoucher = (props:{vouchers:ReportSalaryPartnerSpace.vouchers,revenue:ReportSalaryPartnerSpace.Revenue[]})=>{
    const { vouchers,revenue }=props;
    const totalVoucher = vouchers.reduce((acc,res)=>{
        if(res.status==='REJECT'){
            return acc
        }
       return acc+=( get(res,'totalAmount',0) * { 'PC': 1, 'PT': -1, }[res.typeVoucher])
    },0);
    const totalSalary = revenue.reduce((acc,res)=>acc+= get(res,'revenueGroup',0)+get(res,'revenueSelf',0),0);
    const content = totalVoucher>totalSalary ?fomartNumber(totalVoucher-totalSalary):null


    const IconRender = ()=>{
        let isComplete = totalVoucher === totalSalary && vouchers.some(({status})=>status==='APPROVED');
        let isWaning = totalVoucher > totalSalary;
        if(isComplete){
            return <Tag bordered={false} color="success"><CheckCircleFilled /></Tag>
        } if(isWaning)
        return <Tag bordered={false} color="warning"><WarningOutlined /></Tag>
        return <></>;
    }
    return <Popover trigger={"hover"} placement="left" content={ totalVoucher===0?null:
        <Flex vertical gap={5}>
            <Flex justify="space-between" style={{borderBottom:'0.4px solid #333'}}>
                <Typography.Title level={5}>Chi tiết</Typography.Title>
                {Boolean(content) && <Typography.Text style={{color:"red"}} italic>( Dư: {content} )</Typography.Text>}
            </Flex>

            <Flex vertical style={{width:260}} gap={2}>
                {vouchers.map((item)=><Row justify="space-between" style={{borderBottom:'0.4px solid #333' ,marginBottom:0}}>
                    <Col span={8}>
                        <Typography.Text strong>{item.codeSequence} :</Typography.Text>
                    </Col>
                    <Col span={8} >
                        <Tag color={ MAP_STATUS_VOUCHERS_VI[item.status].color }>{MAP_STATUS_VOUCHERS_VI[item.status].name}</Tag>
                    </Col>
                    <Col span={8}>
                        <Typography.Text>{fomartNumber(item.totalAmount)}</Typography.Text>
                    </Col>
                    </Row>)}
            </Flex>
        </Flex>
    }>
        <Flex justify="space-between">
            <Typography.Title style={{color:totalSalary<totalVoucher?'red':totalSalary===totalVoucher?'green':'',margin:0}} level={5}>{ fomartNumber(totalVoucher)} </Typography.Title>
            <IconRender/> 
        </Flex>
    </Popover>
}

const renderTypeSaler = {
    partner: {
        style:'green',
        text:'CTV'
    },
    employee: { 
        style:'orange',
        text:'TDV'
    }
} satisfies Record<'partner'|'employee',{style:string,text:'CTV'|'TDV'}>
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
                render:(name,{_id,typeSaler})=>{
                    const cfg = renderTypeSaler[typeSaler as keyof typeof renderTypeSaler];
                    return <Flex gap={0}>
                            <Button type="link" onClick={()=>onDetailId(_id)}>{name}</Button>
                            <Space>
                                <Tag color={cfg.style}>{cfg.text}</Tag>
                            </Space>
                        </Flex>
                }
                
            },
            {
                title: 'DS cá nhân',
                width: 150,
                ellipsis:true,
                align: 'center',
                dataIndex: 'revenue',
                render:(revenue:ReportSalaryPartnerSpace.Revenue[],record)=>{
                   return fomartNumber(revenue.reduce((acc,res)=>acc+= get(res,'revenueSelf',0),0))
                }
            },
            {
                title: 'DS đội nhóm',
                width: 150,
                align: 'center',
                dataIndex: 'revenue',
                render:(revenue:ReportSalaryPartnerSpace.Revenue[],record)=>{
                    return fomartNumber(revenue.reduce((acc,res)=>acc+= get(res,'revenueGroup',0),0))
                }
            },
            {
                title: 'Tổng cộng',
                width: 150,
                align: 'center',
                dataIndex: 'revenue',
                render:(revenue:ReportSalaryPartnerSpace.Revenue[],record)=>{
                    return <Typography.Title style={{margin:0}} level={5}>{fomartNumber(revenue.reduce((acc,res)=>acc+= get(res,'revenueGroup',0)+get(res,'revenueSelf',0),0))}</Typography.Title>
                }
            },
            {
                title: 'Đã chi',
                width: 180,
                align: 'center',
                dataIndex: 'vouchers',
                render:(vouchers:ReportSalaryPartnerSpace.vouchers,{revenue}:{revenue:ReportSalaryPartnerSpace.Revenue[]})=>{
                    return <RenderVoucher vouchers={vouchers} revenue={revenue} />
                }
            }
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
                scroll={{x:'inherit',y:'calc(100vh - 140px - 52px - 90px)'}}
                loading={loading}
                columns={columsMemo} 
                dataSource={data}
                pagination={pagingTable(paging,onParamChange)}
            />
            {provider}
        </div>
    )
}