import { Col, DatePicker, Divider, Flex, Row, Select, Spin, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table/InternalTable';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import DateForm from '~/components/common/DateForm';
import WhiteBox from '~/components/common/WhiteBox';
import { PAYER_OPTIONS, PAYER_VI, transportUnit, transportUnit_VI } from '~/modules/logistic/constants';
import { PATH_APP } from '~/routes/allPath';
import { formatter } from '~/utils/helpers';
import {
  useGetReportShips,
  useGetReportSummaryShips,
  useReportShipPaging,
  useReportShipQueryParams,
  useUpdateReportShipParams,
} from "../reportShip.hook";
import { serviceViettelPost } from '~/modules/logistic/constants';
const CLONE_PAYER_VI : any = PAYER_VI;
const CLONE_transportUnit_VI : any = transportUnit_VI;
type propsType = {

}
export default function ReportShip(props:propsType) : React.JSX.Element {
    const [modeDate,setModeDate] = useState<"date"| "month" |"year">("date");

    const [query] = useReportShipQueryParams();
    
    const [dataSource, isLoading] = useGetReportShips(query);
    const [summary, isLoadingSummary] = useGetReportSummaryShips(query);
    const [ ,{ onParamChange }] = useUpdateReportShipParams(query);
    const paging = useReportShipPaging();
    const onChangeDate = (date: any, dateString: string | string[]) => {
        // Apply For Mode Month And year
        const endDate = date && dayjs(date).endOf(modeDate).format("YYYY-MM-DD");
        const startDate = date && dayjs(date).startOf(modeDate).format("YYYY-MM-DD");
        onParamChange({
            startDate,
            endDate,
        })
    }
    const columns : ColumnsType = [
        {
            title : "Mã đơn hàng",
            dataIndex: "code",
            key : "code",
            width : 150,
            render : (code) => <Typography.Link onClick={() => window.open(PATH_APP.bill.root + "?page=1&limit=10&keyword=" + code)} strong>
                {code}
                </Typography.Link>
        },
        {
            title : "Phụ phí",
            dataIndex: "totalFee",
            key : "totalFee",
            align : 'center',
            width : 150,
            render : (totalFee) => formatter(totalFee)
        },
        {
            title : "Người trả",
            dataIndex: "payer",
            key : "payer",
            align : 'center',
            width : 130,
            render : (payer : any) => CLONE_PAYER_VI[payer]
        },
        {
            title : "Khách hàng",
            dataIndex: "customer",
            key : "customer",
            render : (customer,rc) => <span>{get(rc,'customerDivision')} - {customer}</span>
        },
        {
            title : "Dịch vụ",
            dataIndex: "serviceName",
            key : "serviceName",
        },
        {
            title : "Đơn vị vận chuyển",
            dataIndex: "transportUnit",
            key : "transportUnit",
            render : (value) =>  CLONE_transportUnit_VI?.[value]
        },
        {
            title : "Ngày hoàn thành",
            dataIndex: "timestamp",
            key : "timestamp",
            align : 'center',
            render : (timestamp) => dayjs(timestamp)?.format("DD-MM-YYYY")
        },
    ]
    return (
        <div>
      <Breadcrumb title="Báo cáo phí vận chuyển" />
      <Row style={{ marginBottom: 10 }} gutter={8}>
        <Col span={6}>
          <Search
            placeholder="Nhập mã đơn hàng để tìm..."
            allowClear
            onSearch={(value) => onParamChange({keyword: value})}
            enterButton
          />
        </Col>
        <Col >
            <Flex vertical gap={10}>
                <Select
                onChange={(value) => setModeDate(value)}
                value={modeDate}
                options={[
                    {
                        value : "date",
                        label : "Ngày"
                    },
                    {
                        value : "month",
                        label : "Tháng"
                    },
                    {
                        value : "year",
                        label : "Năm"
                    },
                ]}/>
                {modeDate === "date" && <DateForm value={{
                    startDate : query?.startDate,
                    endDate : query?.endDate,
                }} onParamChange={onParamChange}/>}
                {modeDate === "month" && <DatePicker onChange={onChangeDate} picker='month'/>}
                {modeDate === "year" && <DatePicker onChange={onChangeDate} picker='year'/>}
                
                
            </Flex>
        </Col>
        <Divider type='vertical'/>
        <Col>
        <Flex gap={20} vertical>
        <span>Đơn vị vận chuyển</span>
        <Select value={query?.transportUnit} onChange={(value) => onParamChange({transportUnit : value})} placeholder="Đơn vị vận chuyển" options={transportUnit} allowClear style={{width : 170}}/>
        </Flex>
        </Col>
        <Divider type='vertical'/>
        <Col>
        <Flex gap={20} vertical>
        <span>Người trả</span>
        <Select value={query?.payer} onChange={(value) => onParamChange({payer : value})} placeholder="Người trả" options={PAYER_OPTIONS} allowClear style={{width : 120}}/>
        </Flex>
        </Col>
        <Divider type='vertical'/>
        <Col>
        <Flex gap={20} vertical>
        <span>Dịch vụ</span>
        <Select value={query?.serviceName} onChange={(value) => onParamChange({serviceName : value})} placeholder="Dịch vụ" options={serviceViettelPost.map(({label}) => ({label,value :label}))} allowClear style={{width : 250}}/>
        </Flex>
        </Col>
      </Row>
      <WhiteBox>
          <TableAnt
          title={() => <Typography.Text strong>Tổng phí vận chuyển: {isLoadingSummary ? <Spin spinning/> : (get(summary,'total',0))}</Typography.Text>}
          dataSource={dataSource || []}
          loading={isLoading}
          columns={columns}
          stickyTop
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
            size: "small",
          }}
        />
      </WhiteBox>
      
    </div>
    )
}