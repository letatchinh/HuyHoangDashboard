import { Button, Checkbox, Col, DatePicker, Flex, Form, Row, Space, Table } from "antd";
import React, { useMemo } from "react";
import useInventoryWarehouseStore from "../../store/InventoryStore";
import {usePagingInventory } from "../../warehouse.hook";
import TableAnt from "~/components/Antd/TableAnt";
import { pagingTable } from "~/utils/helpers";
import Search from "antd/es/input/Search";
import SearchAnt from "~/components/Antd/SearchAnt";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import ExportExcelButton from "~/modules/export/component";
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
    onOpen,
    arrCheckBox,
    query,
    canDownload,
    onChangeCheckBox
  } = useInventoryWarehouseStore();
  const paging = usePagingInventory();
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã sản phẩm",
        dataIndex: "codeBySupplier",
        key: "codeBySupplier",
        width: 50,
        fixed: "left",
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        width: 100,
      },
      {
        title: "Số lượng",
        dataIndex: "variant",
        key: "quantity",
        width: 40,
        render: (value: any) => value?.quantity,
      },
      {
        title: "Đã gửi yêu cầu",
        dataIndex: "variant",
        key: "orderSupplierQuantity",
        width: 60,
        render: (value: any) => value?.orderSupplierQuantity,
      },
      {
        title: "Đơn vị",
        dataIndex: "variant",
        key: "unit",
        width: 50,
        render: (value: any) => value?.unit?.name,
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "supplierName",
        key: "supplierName",
        width: 50,
        render: (value: any) => value
      },
      ...(
        canDownload ? [
          {
            title: 'Lựa chọn',
            key: '_id',
            width: 80,
            align: 'center' as any,
            render: (item: any, record: any) => {
              const id = record._id;
              return (
                <Checkbox
                  checked={arrCheckBox?.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />)
            }
          },
        ] : []
      )
    ],
    [activeTab, data, arrCheckBox ,canDownload]
  );
  return (
    <>
        <Row gutter={12} justify={"end"} className="mb-1" style={{ width: "100%" }}>
          <Col>
          <Space>
          <WithPermission permission={POLICIES.DOWNLOAD_OUTOFSTOCK}>
            <ExportExcelButton
              api="product/out-of-stock"
              exportOption="employee"
              query={query}
              fileName="Danh sách sản phẩm đang thiếu hàng"
              ids={arrCheckBox}
              />
            </WithPermission>
          <WithPermission permission={POLICIES.WRITE_ORDERSUPPLIER}>
              <Button type="primary" onClick={onOpen} loading = {loading}>Tạo đơn mua</Button>
          </WithPermission>
            </Space>
          </Col>
      </Row>
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
