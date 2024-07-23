import { Button, Col, DatePicker, Form, Row, Table } from "antd";
import React, { useMemo } from "react";
import useInventoryWarehouseStore from "../../store/InventoryStore";
import {useColumns, usePagingInventory } from "../../warehouse.hook";
import TableAnt from "~/components/Antd/TableAnt";
import { pagingTable } from "~/utils/helpers";
import Search from "antd/es/input/Search";
import SearchAnt from "~/components/Antd/SearchAnt";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
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
    onOpen
  } = useInventoryWarehouseStore();
  const paging = usePagingInventory();
  const columns = useColumns({ activeTab, data });
  return (
    <>
      <WithPermission permission={POLICIES.WRITE_ORDERSUPPLIER}>
      <Row gutter={12} justify={"end"} className="mb-1" style={{width: "100%"}}>
          <Button type="primary" onClick={onOpen}>Tạo đơn mua</Button>
      </Row>
      </WithPermission>
      <Row justify={"start"} gutter={12}>
        <Col span={6}>
          <Form.Item name={"keyword"}>
            <SearchAnt
              style={{ alignSelf: "center" , width: "90%"}}
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
        rowKey={rc => rc?._id}
        dataSource={data || []}
        pagination={pagingTable(paging, onParamChange)}
        loading={loading}
        size="small"
        scroll={{ x: 1000, y: 500 }}
      />
    </>
  );
}
