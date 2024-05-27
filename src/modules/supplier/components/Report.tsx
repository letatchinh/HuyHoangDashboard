import React, { useEffect, useMemo, useState } from "react";
import { useFetchState } from "~/utils/hook";
import ProductModule from "~/modules/product";
import { get } from "lodash";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Statistic,
  Tabs,
} from "antd";
import { formatter } from "~/utils/helpers";
import apis from "../supplier.api";
import dayjs from "dayjs";
import { BarChartOutlined, FilterOutlined, TableOutlined } from "@ant-design/icons";
import { FormFieldSearch, SearchByType } from "../supplier.modal";
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table/InternalTable";
import ChartBill from "./ChartBill";
import { TabsProps } from "antd/lib/index";
import SaleReport from "./SaleReport";
import HistoryReport from "./HistoryReport";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
type propsType = {
  id: string | null;
};
const optionsSearchBy = [
  {
    label: "Theo ngày",
    value: "date",
  },
  {
    label: "Theo tháng",
    value: "month",
  },
  {
    label: "Theo quý",
    value: "quarter",
  },
  {
    label: "Theo năm",
    value: "year",
  },
];
const defaultDate = {
  startDate: dayjs().startOf("month"),
  endDate: dayjs().endOf("month"),
};
export default function Report({ id }: propsType): React.JSX.Element {
  const [form] = Form.useForm();
    const [typeShow,setTypeShow] = useState<'chart' | 'table'>('chart');
  const queryGetProduct = useMemo(() => ({ supplierId: id }), [id]);
  const [queryGetBills,setQueryGetBills] = useState<any>();
  
  const searchBy : SearchByType = Form.useWatch('searchBy',form);
  const searchByVi = useMemo(() => get(optionsSearchBy.find((item) => item.value === searchBy),'label'),[searchBy]);
  const [productResponse, loadingProduct] = useFetchState({
    api: ProductModule.api.getAll,
    query: queryGetProduct,
    useDocs: false,
  });

  
  const [debt, loadingDebt] = useFetchState({
    api: apis.getDebt,
    query: queryGetProduct,
    useDocs: false,
  });

  const totalProduct = useMemo(
    () => get(productResponse, "totalDocs", 0),
    [productResponse]
  );
    useEffect(() => {
        setQueryGetBills({supplierId : id})
    },[id])
  const onFinish = (values : FormFieldSearch) => {
      
      const {searchBy,startDate,endDate} = values;
    switch (searchBy) {
        case 'date':
            setQueryGetBills({
                ...queryGetBills,
                startDate : dayjs(startDate).startOf(searchBy).format("YYYY-MM-DD HH:mm:ss"),
                endDate : dayjs(endDate).endOf(searchBy).format("YYYY-MM-DD HH:mm:ss"),
            })
            break;
        case 'month':
        case 'quarter':
        case 'year':
            setQueryGetBills({
                ...queryGetBills,
                startDate : dayjs(startDate).startOf(searchBy).format("YYYY-MM-DD HH:mm:ss"),
                endDate : dayjs(startDate).endOf(searchBy).format("YYYY-MM-DD HH:mm:ss"),
            })
            break;
    
        default:
            break;
    }
  }

  const Items : TabsProps['items'] = [
    {
        label : "Thống kê doanh thu",
        key : '0',
        children : <SaleReport query={queryGetBills} searchBy={searchBy} searchByVi={searchByVi} />,
    },
    // {
    //     label : "Lịch sử bán hàng",
    //     key : '1',
    //     children : <HistoryReport />,
    // },
]
  return (
    <div className="report-supplier">
      <h5 className="mb-3">Tổng quan</h5>
      <Row gutter={16}>
        <Col lg={4} md={6} sm={10}>
          <Card bordered={false}>
            <Statistic
              title="Tổng số mặt hàng"
              value={formatter(totalProduct)}
              valueStyle={{
                color: "#3f8600",
              }}
              loading={loadingProduct}
            />
          </Card>
        </Col>
        <WithPermission permission={POLICIES.READ_DEBTSUPPLIER}>
        <Col lg={4} md={6} sm={10}>
          <Card bordered={false}>
            <Statistic
              title="Tổng công nợ"
              value={get(debt, "totalAmount", 0)}
              valueStyle={{
                color: "#3f8600",
              }}
            />
          </Card>
        </Col>
        </WithPermission>
      </Row>
      <h5 className="my-3">Thống kê doanh thu</h5>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={{
          startDate: defaultDate.startDate,
          endDate: defaultDate.endDate,
          searchBy : 'date'
        }}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item<FormFieldSearch> name={"searchBy"}>
              <Select options={optionsSearchBy} />
            </Form.Item>
          </Col>
          {
            {
                date : <>
                <Col>
            <Form.Item<FormFieldSearch> name={"startDate"} label="Ngày bắt đầu">
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item<FormFieldSearch> name={"endDate"} label="Ngày kết thúc">
              <DatePicker format={"YYYY-MM-DD"} />
            </Form.Item>
          </Col>
          </>,
                month : <>
                <Col>
            <Form.Item<FormFieldSearch> name={"startDate"} label="Tháng">
              <DatePicker picker='month'/>
            </Form.Item>
          </Col>
          </>,
                quarter : <>
                <Col>
            <Form.Item<FormFieldSearch> name={"startDate"} label="Quý">
              <DatePicker picker='quarter'/>
            </Form.Item>
          </Col>
          </>,
                year : <>
                <Col>
            <Form.Item<FormFieldSearch> name={"startDate"} label="Năm">
              <DatePicker picker='year'/>
            </Form.Item>
          </Col>
          </>,
            }[searchBy]
          }
          <Col>
            <Button htmlType="submit" icon={<FilterOutlined />} type="primary">
              Áp dụng bộ lọc
            </Button>
          </Col>
        </Row>
      </Form>
      <Tabs defaultActiveKey="0" items={Items}/>
    </div>
  );
}
