import React, { useMemo, useState } from 'react';
import { useGetVoucherSuppliers, useVoucherSupplierPaging, useVoucherSupplierQuery } from '../../supplier.hook';
import TableAnt from '~/components/Antd/TableAnt';
import { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';
import dayjs from 'dayjs';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import { get, transform } from 'lodash';
import StatusTag from '~/modules/vouchers/components/StatusTag';
import { MAP_STATUS_VOUCHERS_VI } from '~/constants/defaultValue';
import { formatNumberThreeComma } from '~/utils/helpers';
type propsType = {
  supplierId: string | null
};

export default function Vouchers(props: propsType): React.JSX.Element {
  const { supplierId } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [searchByStatus, setSearchByStatus] = useState<string[]>([]);
  const [query, onTableChange] = useVoucherSupplierQuery(keyword);
  console.log(query,'query')
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
    }),
    []
  );
  const [date, setDate] = useState<any>(defaultDate);
  const newQuery = useMemo(() => ({
    ...query,
    ...date,
    supplierId: supplierId,
    status: searchByStatus?.toString(),
  }), [supplierId, date, searchByStatus, query]);

  const [data, isLoading] = useGetVoucherSuppliers(newQuery);
  const paging = useVoucherSupplierPaging();
  
  const columns: ColumnsType  = useMemo(
    () => [
      {
        title: "Mã phiếu",
        dataIndex: "codeSequence",
        key: "codeSequence",
      },
      {
        title: "Số tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render(value) {
          return formatNumberThreeComma(value);
        }
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render(value) {
          return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      {
        title: "Ngày duyệt",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render(value) {
          return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (text, record, index) => <StatusTag status={text}/>
      },
    ],
    [data]
  );

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
                  MAP_STATUS_VOUCHERS_VI,
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
      <TableAnt
        loading={isLoading}
        dataSource={data}
        columns={columns}
        onChange={onTableChange}
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total} `,
        }}
      />
    </>
  )
}