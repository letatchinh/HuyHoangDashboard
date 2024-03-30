import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Row, Select, Table } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { formatter } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import {
  useGetReportSuppliers,
  useReportSupplierPaging,
  useReportSupplierQueryParams,
  useUpdateReportSupplierParams,
} from "../reportSupplier.hook";
import { FormFieldSearch, SearchByType } from "../reportSupplier.modal";
const defaultDate = {
  startDate: dayjs().startOf("month"),
  endDate: dayjs().endOf("month"),
};
type propsType = {};
const columns: ColumnsType = [
  {
    title: "Nhà cung cấp",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Doanh thu",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render(totalAmount, record, index) {
      return formatter(totalAmount);
    },
  },
];
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
export default function ReportSupplier(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [query] = useReportSupplierQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateReportSupplierParams(query);
  const [data, isLoading] = useGetReportSuppliers(query);
  const paging = useReportSupplierPaging();
  const searchBy: SearchByType = Form.useWatch("searchBy", form);

  const onFinish = (values: FormFieldSearch) => {
    const { searchBy, startDate, endDate } = values;
    if(startDate){
        switch (searchBy) {
            case "date":
              onParamChange({
                startDate: dayjs(startDate)
                  .startOf(searchBy)
                  .format("YYYY-MM-DD HH:mm:ss"),
                endDate: dayjs(endDate).endOf(searchBy).format("YYYY-MM-DD HH:mm:ss"),
              });
              break;
            case "month":
            case "quarter":
            case "year":
              onParamChange({
                startDate: dayjs(startDate)
                  .startOf(searchBy)
                  .format("YYYY-MM-DD HH:mm:ss"),
                endDate: dayjs(startDate)
                  .endOf(searchBy)
                  .format("YYYY-MM-DD HH:mm:ss"),
              });
              break;
      
            default:
              break;
          }
    }else{
        onParamChange({
            startDate : null,
            endDate : null,
        })
    }
    
  };
  useChangeDocumentTitle("Doanh số tích luỹ của nhà cung cấp")
  return (
    <div>
      <h4>Báo cáo doanh thu của nhà cung cấp</h4>
      <Row style={{ marginBottom: 10 }} gutter={8}>
        <Col span={6}>
          <Search
            allowClear
            onSearch={(value) => onParamChange({ keyword: value?.trim() })}
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
          />
        </Col>
        <Col flex={1}>
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              startDate: defaultDate.startDate,
              endDate: defaultDate.endDate,
              searchBy: "date",
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
                  date: (
                    <>
                      <Col>
                        <Form.Item<FormFieldSearch>
                          name={"startDate"}
                          label="Ngày bắt đầu"
                        >
                          <DatePicker format={"YYYY-MM-DD"} />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item<FormFieldSearch>
                          name={"endDate"}
                          label="Ngày kết thúc"
                        >
                          <DatePicker format={"YYYY-MM-DD"} />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  month: (
                    <>
                      <Col>
                        <Form.Item<FormFieldSearch>
                          name={"startDate"}
                          label="Tháng"
                        >
                          <DatePicker picker="month" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  quarter: (
                    <>
                      <Col>
                        <Form.Item<FormFieldSearch>
                          name={"startDate"}
                          label="Quý"
                        >
                          <DatePicker picker="quarter" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                  year: (
                    <>
                      <Col>
                        <Form.Item<FormFieldSearch>
                          name={"startDate"}
                          label="Năm"
                        >
                          <DatePicker picker="year" />
                        </Form.Item>
                      </Col>
                    </>
                  ),
                }[searchBy]
              }
              <Col>
                <Button
                  htmlType="submit"
                  icon={<FilterOutlined />}
                  type="primary"
                >
                  Áp dụng bộ lọc
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <TableAnt
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng ${total}`,
          showSizeChanger: true,
          onChange(page, pageSize) {
            onParamChange({ page, limit: pageSize });
          },
        }}
        size="small"
      />
    </div>
  );
}
