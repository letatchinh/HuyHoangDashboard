import { ColumnsType } from "antd/es/table";
import { Col, DatePicker, Row, Table, Form, Select, Spin } from "antd";
import React, { useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useGetProductSuppliers,
  useProductSupplierPaging,
  useProductSupplierQuery,
  useTotalAmountBillItem,
} from "../../supplier.hook";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import { formatNumberThreeComma } from "~/utils/helpers";
import StatusTag from "./StatusTag";
import {
  ORDER_STATUS_KEY_SEARCH_COLOR,
  OptionStatus,
} from "~/constants/defaultValue";
import { get, sum, transform } from "lodash";
import "./index.scss";
import RenderLoading from "~/components/common/RenderLoading";
type propsType = {
  supplierId: string | null;
};
export default function ProductList(props: propsType): React.JSX.Element {
  const { supplierId } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [searchByStatus, setSearchByStatus] = useState<string[]>([]);
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
    }),
    []
  );
  const [date, setDate] = useState<any>(defaultDate);
  const [query, onTableChange] = useProductSupplierQuery(keyword);
  const newQuery = useMemo(
    () => ({
      ...query,
      supplierId: supplierId,
      ...date,
      status: searchByStatus?.toString(),
    }),
    [supplierId, query, date, searchByStatus]
  );
  const [data, isLoading] = useGetProductSuppliers(newQuery);
  const totalAmount = useTotalAmountBillItem();
  const paging = useProductSupplierPaging();
  const totalPage = useMemo(() => {
    return sum(data?.map((e: any) => get(e, "price", 0)));
  }, [data]);

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã sản phẩm",
        dataIndex: "product",
        key: "medicalCode",
        render(value) {
          return value?.medicalCode;
        },
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "product",
        key: "name",
        render(value) {
          return value?.name;
        },
      },
      {
        title: "Giá",
        dataIndex: "price",
        key: "price",
        render(value) {
          return formatNumberThreeComma(value);
        },
      },
      {
        title: "Trạng thái sản phẩm",
        dataIndex: "status",
        key: "status",
        render(text) {
          return <StatusTag status={text} />;
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render(value) {
          return dayjs(value).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "bill",
        key: "codeSequence",
        render(value) {
          return value?.codeSequence;
        },
      },
    ],
    []
  );
  const renderLoading = (component: any) => {
    return isLoading ? <Spin /> : component;
  };
  return (
    <>
      <Row
        justify={"space-between"}
        style={{ marginTop: "20px", padding: "0px" }}
      >
        <Col span={8}>
          <Row>
            <Col span={18}>
              <Search
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                onSearch={(value) => {
                  setKeyword(value?.trim());
                }}
                placeholder="Tiếm bất kỳ..."
                enterButton
                allowClear
                style={{ width: 300 }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Tìm theo trạng thái..."
                // onChange={onChangeStatus}
                allowClear
                dropdownStyle={{
                  width: "150px",
                }}
                mode="multiple"
                style={{
                  width: "200px",
                }}
                onChange={(e) => {
                  setSearchByStatus(e);
                }}
              >
                {transform(
                  ORDER_STATUS_KEY_SEARCH_COLOR,
                  (result: any, value, key) => {
                    result.push({
                      label: get(value, "name", ""),
                      value: key,
                      color: get(value, "colorStyle", ""),
                    });
                  },
                  []
                )?.map((e: any) => (
                  <Select.Option value={get(e, "value")}>
                    <p style={{ color: `${e.color}` }}>{get(e, "label")}</p>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <Row justify={"start"} style={{ width: "60%" }}>
            <Col span={12}>
              <Form.Item
                label={"Từ ngày"}
                name="startDate"
                labelCol={{ lg: 8 }}
              >
                <DatePicker
                  defaultValue={dayjs(date.startDate)}
                  onChange={(e) =>
                    setDate({
                      ...date,
                      startDate: dayjs(e).format("YYYY-MM-DD HH:mm:ss"),
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={"Đến ngày"} name="endDate">
                <DatePicker
                  defaultValue={dayjs(date.endDate)}
                  onChange={(e) =>
                    setDate({
                      ...date,
                      endDate: dayjs(e).format("YYYY-MM-DDTHH:mm:ss"),
                    })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row
        gutter={30}
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {renderLoading(
          <Col className="sumary-row__left" span={10}>
            <h6>Tổng tiền theo thời gian: </h6>
            <h6
              style={{
                marginLeft: "10px",
              }}
            >
              {formatNumberThreeComma(totalAmount)}đ
            </h6>
          </Col>
        )}
        {renderLoading(
          <Col span={10} className="sumary-row__right">
            <h6>Tổng tiền theo trang hiện tại:</h6>
            <h6
              style={{
                marginLeft: "10px",
              }}
            >{`${formatNumberThreeComma(totalPage)}đ`}</h6>
          </Col>
        )}
      </Row>
      <TableAnt
        loading={isLoading}
        dataSource={data}
        columns={columns}
        onChange={onTableChange}
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total} `,
        }}
        size="small"
      />
    </>
  );
}
