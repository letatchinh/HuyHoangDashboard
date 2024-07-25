import { Button, Col, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { pagingTable } from "~/utils/helpers";
import useInventoryWarehouseStore from "../../store/InventoryStore";
import {
  useColumns,
  useGetInventoryCreate,
  usePagingInventoryCreate,
} from "../../warehouse.hook";
import { DataSourceType } from "~/pages/Dashboard/OrderSupplier/CreateOrderSupplier";
import { v4 } from "uuid";
import { get, omit } from "lodash";
type propsType = {};

export default function CreateOrderSupplierForm(
  props: propsType
): React.JSX.Element {
  const {activeTab ,listWarehouse,onClose,supplierId,setSupplierId} =
    useInventoryWarehouseStore();
    const [dataSelected, setDataSelected] = useState<any[]>([]);
  const [page, setPage] = useState<number | null>(1);
  const [limit, setLimit] = useState<number | null>(10);
  const query = useMemo(
    () => ({
      page,
      limit,
      warehouseId: activeTab,
      supplierId,
    }),
    [activeTab, supplierId]
  );
  const [data, loading] = useGetInventoryCreate(query);
  const columns = useColumns({ activeTab, data, dataSelected });
  const paging = usePagingInventoryCreate();
  const [newData, setNewData] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  useEffect(() => {
    if (data) {
      const res = data?.map((item: any, index: number) => ({
        ...item,
        key: (item?._id)?.concat(item?.variant?.variantCode),
      }));
      setNewData(res || []);
    }
  }, [data]);

  const onPagingChange = ({ page, limit }: { page: number; limit: number }) => {
    setPage(page);
    setLimit(limit);
  };
  const onSelectChange = (newSelectedRowKeys: any[], e: any) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (e?.length) {
      setDataSelected([...e]);
    } else {
      setDataSelected([]);
    }
    if (
      newSelectedRowKeys.length === 1 &&
      newSelectedRowKeys?.length > selectedRowKeys?.length
    ) {
      //Filter only when selecting for the first
      setSupplierId(e[0]?.supplierId);
    }
    if (newSelectedRowKeys.length === 0) {
      setSupplierId(null);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll : !supplierId
  };
  const onSubmit = () => {
    try {
      const warehouseName = listWarehouse?.find((item: any) => item?._id === activeTab)?.name?.vi;
      const newKey = v4();
      let newDataSource = {
        [newKey]: {
          typeTab : "createOrderSupplier",
          orderSupplierItems: dataSelected?.map((item: any) => ({
            ...item,
            quantity: item?.variant?.quantity,
            quantityActual: get(item?.variant,'quantity',1) * get(item?.variant,'exchangeValue',1),
            unitPrice: get(item?.variant, "cost", 0),
            productId: item?._id,
          })),
          warehouseId: activeTab,
          warehouseName,
          supplierId: supplierId,
          pair : 0,
          debtType: null,
        },
      };
      localStorage.setItem("order-supplier", JSON.stringify(newDataSource));
      window.open(PATH_APP.orderSupplier.create);
      onClose();
    } catch (error) {}
  };
  const hasSelected = dataSelected.length > 0;
  return (
    <>
      <Row>
        <Col span={8}>
          <SelectSupplier
            style={{ width: "100%" , marginBottom : 10}}
            onChange={(e: any) => {
              setSupplierId(e);
              setSelectedRowKeys([]);
              setDataSelected([]);
            }}
            value={supplierId}
          />
        </Col>
      </Row>
      <Row gutter={48}>
        <Col span={12}>
          <TableAnt
            dataSource={newData}
            rowSelection={rowSelection}
            columns={columns}
            scroll={{ x: 1000, y: 500 }}
            pagination={pagingTable(paging, onPagingChange)}
            loading={loading}
          />
        </Col>
        <Col span={12}>
          <TableAnt
            columns={columns}
            scroll={{ x: 1000, y: 500 }}
            loading={loading}
            dataSource={dataSelected}
            pagination={{
              total: dataSelected.length,
              pageSize: 10,
              showTotal: (total) => `Tổng cộng:  ${total} `,
            }}
          />
        </Col>
      </Row>
      <Row justify={"end"}>
        <Button disabled={!hasSelected} type="primary" onClick={onSubmit}>
          Tạo đơn hàng
        </Button>
      </Row>
    </>
  );
}
