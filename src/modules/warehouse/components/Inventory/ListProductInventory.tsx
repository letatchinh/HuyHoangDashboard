import { Col, DatePicker, Form, Row, Table } from "antd";
import React, { useMemo } from "react";
import useInventoryWarehouseStore from "../../store/InventoryStore";
import {usePagingInventory } from "../../warehouse.hook";
import TableAnt from "~/components/Antd/TableAnt";
import { pagingTable } from "~/utils/helpers";
import Search from "antd/es/input/Search";
import SearchAnt from "~/components/Antd/SearchAnt";
import dayjs from "dayjs";
type propsType = {};
export default function ListProductInventory(
  props: propsType
): React.JSX.Element {
  const {
    activeTab,
    loading,
    data,
    onParamChange,
    keyword,
    setKeyword,
    onSearch,
  } = useInventoryWarehouseStore();
  const paging = usePagingInventory();
  const columns = useMemo(
    () => [
      {
        title: "Mã sản phẩm",
        dataIndex: "codeBySupplier",
        key: "codeBySupplier",
        width: 80,
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: 200,
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 40,
      },
      {
        title: "Đơn vị",
        dataIndex: "variant",
        key: "unit",
        width: 100,
        render: (value: any) => value?.unit?.name,
      },
    ],
    [activeTab]
  );
  return (
    <>
      <Row justify={"start"} gutter={12}>
        <Col span={6}>
          <Form.Item name={"keyword"}>
            <SearchAnt
              style={{ alignSelf: "center" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={"startDate"} label="Ngày bắt đầu">
            <DatePicker
              style={{ width: "80%" }}
              format={"YYYY-MM-DD"}
              onChange={(e: any) => onSearch({ startDate: e ? dayjs(e).format("YYYY-MM-DD") : null })}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name={"endDate"} label="Ngày kết thúc">
            <DatePicker
              style={{ width: "80%" }}
              format={"YYYY-MM-DD"}
              onChange={(e: any) => onSearch({ startDate: e ? dayjs(e).format("YYYY-MM-DD") : null })}
            />
          </Form.Item>
        </Col>
      </Row>
      <TableAnt
        columns={columns}
        dataSource={data || []}
        pagination={pagingTable(paging, onParamChange)}
        loading={loading}
        size="small"
      />
    </>
  );
}
