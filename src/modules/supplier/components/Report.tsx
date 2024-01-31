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
} from "antd";
import { formatter } from "~/utils/helpers";
import apis from "../supplier.api";
import dayjs from "dayjs";
import { BarChartOutlined, FilterOutlined, TableOutlined } from "@ant-design/icons";
import { FormFieldSearch, SearchByType } from "../supplier.modal";
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table/InternalTable";
import ChartBill from "./ChartBill";
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
  const [bills, loadingBills] = useFetchState({
    api: apis.getBills,
    query: queryGetBills,
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

  const columns : ColumnsType = [
    {
        title : "Mã đơn hàng",
        dataIndex : 'codeSequence',
        key : 'codeSequence',
    },
    {
        title : "Tổng giá trị",
        dataIndex : 'totalPrice',
        key : 'totalPrice',
        render(totalPrice, record, index) {
            return formatter(totalPrice);
        },
    },
    {
        title : "Ngày tạo",
        dataIndex : 'createdAt',
        key : 'createdAt',
        render(createdAt, record, index) {
            return dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss");
        },
    },
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
      </Row>
      <h5 className="my-3">Lịch sử bán hàng</h5>
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
        <Space>
            <Button onClick={() => setTypeShow('chart')} type={typeShow === 'chart' ? 'primary' : 'default'} icon={<BarChartOutlined />}></Button>
            <Button onClick={() => setTypeShow('table')} type={typeShow === 'table' ? 'primary' : 'default'} icon={<TableOutlined />}></Button>
        </Space>
      </Form>
      {typeShow === 'table' &&<TableAnt 
      dataSource={get(bills,'bills',[])}
      columns={columns}
      loading={loadingBills}
      pagination={false}
      size='small'
      scroll={{y : 500}}
      />}
      {typeShow === 'chart' && <ChartBill loadingBills={loadingBills} data={bills} searchBy={searchBy} searchByVi={searchByVi}/>}
    </div>
  );
}
