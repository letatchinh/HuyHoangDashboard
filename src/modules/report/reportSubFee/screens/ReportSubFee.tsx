import { Checkbox, Col, DatePicker, Flex, Row, Select, Spin, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table/InternalTable';
import dayjs from 'dayjs';
import { get } from 'lodash';
import React, { useState } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import Breadcrumb from '~/components/common/Breadcrumb';
import DateForm from '~/components/common/DateForm';
import DropdownAction from '~/components/common/Layout/List/Header/DropdownAction';
import WhiteBox from '~/components/common/WhiteBox';
import WithPermission from '~/components/common/WithPermission';
import ExportExcelButton from '~/modules/export/component/index';
import useCheckBoxExport from '~/modules/export/export.hook';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { PATH_APP } from '~/routes/allPath';
import { formatter } from '~/utils/helpers';
import { useGetReportSubFees, useGetReportSummarySubFees, useReportSubFeePaging, useReportSubFeeQueryParams, useUpdateReportSubFeeParams } from '../reportSubFee.hook';
type propsType = {

}
export default function ReportSubFee(props:propsType) : React.JSX.Element {
    const [modeDate,setModeDate] = useState<"date"| "month" |"year">("date");
    const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
    const [query] = useReportSubFeeQueryParams();
    const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_REPORTFEE);
    
    const [dataSource, isLoading] = useGetReportSubFees(query);
    const [summary, isLoadingSummary] = useGetReportSummarySubFees(query);
    const [ ,{ onParamChange }] = useUpdateReportSubFeeParams(query);
    const paging = useReportSubFeePaging();
    const onChangeDate = (date: any, dateString: string | string[]) => {
      console.log(date,'date');
      
        // Apply For Mode Month And year
        const endDate = date ? dayjs(date).endOf(modeDate).format("YYYY-MM-DD") : null;
        const startDate = date ? dayjs(date).startOf(modeDate).format("YYYY-MM-DD") : null;
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
            render : (code) => <Typography.Link onClick={() => window.open(PATH_APP.bill.root + "?page=1&limit=10&keyword=" + code)} strong>
                {code}
                </Typography.Link>
        },
        {
            title : "Phụ phí",
            dataIndex: "totalFee",
            key : "totalFee",
            align : 'center',
            render : (totalFee) => formatter(totalFee)
        },
        {
            title : "Khách hàng",
            dataIndex: "customer",
            key : "customer",
        },
        {
            title : "Ngày hoàn thành",
            dataIndex: "timestamp",
            key : "timestamp",
            align : 'center',
            render : (timestamp) => dayjs(timestamp)?.format("DD-MM-YYYY")
        },
    ];
    if(canDownload){
        columns.push(  {
            title: "Lựa chọn",
            key: "_id",
            width: 80,
            align: "center" as any,
            render: (item: any, record: any) => {
              const id = record._id;
              return (
                <Checkbox
                  checked={arrCheckBox.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />
              );
            },
          },)
    }
    return (
        <div>
      <Breadcrumb title="Báo cáo phụ phí" 
      {...canDownload && {right : <DropdownAction
        items={[
            <ExportExcelButton
              api="report-fee"
              exportOption="report-fee"
              query={query}
              fileName="Danh sách báo cáo phí vận chuyển"
              ids={arrCheckBox}
              useLayout="v2"
            />
        ]}
      />}}
      />
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
            <Flex gap={10}>
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
                {modeDate === "month" && <DatePicker value={query?.startDate} onChange={onChangeDate} picker='month'/>}
                {modeDate === "year" && <DatePicker value={query?.startDate} onChange={onChangeDate} picker='year'/>}
                
                
            </Flex>
        </Col>
        <Col>
        
        </Col>
        
      </Row>
      <WhiteBox>
          <TableAnt
          title={() => <Typography.Text strong>Tổng phụ phí: {isLoadingSummary ? <Spin spinning/> : formatter(get(summary,'total',0))}</Typography.Text>}
          dataSource={dataSource || []}
          loading={isLoading}
          columns={columns}
          scroll={{ x: 'max-content' }}
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