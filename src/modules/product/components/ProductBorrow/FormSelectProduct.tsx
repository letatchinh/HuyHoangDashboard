import {
  Button,
  Checkbox,
  Col,
  Flex,
  InputNumber,
  List,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectProductGroups from "~/modules/productGroup/screens/SelectProductGroup";
import {
  useConvertDataAssignProductsCol,
  useConvertProductListCollaborator,
  useGetProducts,
  useProductQueryParams,
  useUpdateProductParams,
} from "../../product.hook";
import Search from "antd/es/input/Search";
import { useFetchState } from "~/utils/helpers";
import apis from "../../product.api";
import { useGetCollaborator } from "~/modules/collaborator/collaborator.hook";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import supplierModule from "~/modules/supplier";
import { ColumnsType } from "antd/es/table";
import { get, omit } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";
import EmptyData from "~/components/Antd/EmptyData";
import { SyncOutlined } from "@ant-design/icons";
import { useProductBorrowContext } from "./Context";
type propsType = {
  id?: string | null;
};
export default function FormSelectProduct({
  id,
}: propsType): React.JSX.Element {
  const {
    dataSelected, 
    selectedRowKeys, 
    setDataSelected,
    setSelectedRowKeys, 
    supplierId, 
    setSupplierId, 
    productOfCollaborator, 
    isLoadingProducts,
    setKeyword } = useProductBorrowContext();
  // const [supplierFilterId, setSupplierFilterId] = useState();
  // const [suppliers, loadingSupplier] = useFetchState({
  //   api: supplierModule.api.getAllPublic,
  //   useDocs: false,
  // });
  
  const [collaborator, isLoading]: any = useGetCollaborator(id);
  const productsCollaborator = useConvertProductListCollaborator(collaborator);

  useEffect(() => {
    if (selectedRowKeys?.length) {
      setDataSelected(
        productOfCollaborator?.map((item: any) => ({
          _id: item?._id,
          variants: get(item, "variants", []),
          variantCurrent: get(item, "variants", [])[0],
          name: get(item, "name", ""),
          quantity: 1,
        }))
      );
    }else{
      setDataSelected([]);
    }
  }, [selectedRowKeys]);

  useEffect(() => {
    console.log(dataSelected,'dataSelected')
  }, [dataSelected]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleChangeValueData = (key: any, value: any, productId: string) => {
    const data = [...dataSelected];
    if (key === "quantity") {
      const newData = data?.map((item: any) => {
        if (item?._id === productId) {
          return {
            ...item,
            quantity: value,
          };
        };
        return item;
      });
      setDataSelected(newData);
    };
    if (key === "unit") { 
      const newData = data?.map((item: any) => {
        if (item?._id === productId) {
          const findVariant = get(item, "variants", []).find((v: any) => get(v, "_id") === value); 
          return {
            ...item,
            variantCurrent: findVariant,
          };
        };
        return item;
      });
      setDataSelected(newData);
    };
  };
  const columnsReady: ColumnsType = useMemo(
    () => [
      {
        title: (
            <Search
            style={{
              position: "sticky",
            }}
            placeholder="Tìm sản phẩm"
            onSearch={setKeyword}
            allowClear
            onChange={(e: any) => {
              if (e === "") setKeyword(e.target.value);
            }}
          />
        ),
        dataIndex: "product",
        key: "name",
        width: 200,
        render(name, product, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
      },
    ],
    [productOfCollaborator]
  );

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: '',
        dataIndex: "name",
        key: "name",
        width: 200,
        render(name, product, index) {
          return (
            <Typography.Text strong>{get(product, "name", "")}</Typography.Text>
          );
        },
      },
      {
        title: "Số lượng",
        key: "quantity",
        width: 80,
        align: "center",
        render(name, product, index) {
          return (
            <Typography.Text strong>
              <InputNumber min={1} value={product?.quantity} onBlur={(value) => handleChangeValueData('quantity', Number(value.target.value), get(product, '_id', ''))} />
            </Typography.Text>
          );
        },
      },
      {
        title: "Đơn vị",
        dataIndex: "variantCurrent",
        key: "unit",
        width: 100,
        align: "center",
        render(unit, record, index) {
          let options = [];
          if (get(record, "variants", [])?.length > 1) {
            options = get(record, "variants", [])?.map((item: any) => ({
              label: get(item, "unit.name"),
              value: get(item, "_id"),
            }));
          }
          return get(record, "variants", [])?.length > 1 ? (
            <Select
              style={{ minWidth: 100 }}
              options={options}
              defaultValue={get(record, "variants[0]._id", null)}
              onChange={(value) => handleChangeValueData('unit', value, get(record, '_id', ''))}
            />
          ) : (
            get(record, "variants[0].unit.name", "")
          );
        },
      },
    ],
    [handleChangeValueData, dataSelected]
  );
  return (
    <div style={{ maxHeight: "90vh", overflow: "hidden" }}>
      <BaseBorderBox
        title={""}
        styleContent={{ minHeight: "700px", height: "100%" }}
      >
        <Row gutter={36}>
          <Col span={10}>
            <BaseBorderBox
              title={"Danh sách sản phẩm sẵn sàng"}
              styleContent={{
                minHeight: "600px",
                height: "70%",
                maxHeight: "600px",
              }}
            >
              {/* <div className="d-flex align-items-center ml-1 gap-2 mb-1">
                <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
                <SelectSupplier
                  style={{width: '350px'}}
                    value={supplierSelectId}
                    onChange={(value) => setSupplierSelectId(value)}
                    defaultSuppliers={suppliers}
                  />
              </div> */}
              <TableAnt
                // locale={{
                //   emptyText : <EmptyData mess={<Button type='primary' ghost icon={<SyncOutlined />} onClick={mutate}>Thử lại</Button>}/>
                // }}
                loading={isLoading}
                rowSelection={rowSelection}
                columns={columnsReady}
                dataSource={productsCollaborator}
                size="small"
                pagination={false}
                rowKey={(rc) => rc?._id}
                scroll={{ y: 400 }}
                footer={() => (
                  <Flex justify={"end"}>
                    <Typography.Text style={{ fontStyle: "italic" }} strong>
                      Tổng sản phẩm:{" "}
                      {selectedRowKeys?.length
                        ? `${selectedRowKeys.length} / ${productsCollaborator?.length}`
                        : productsCollaborator?.length}
                    </Typography.Text>
                  </Flex>
                )}
              />
            </BaseBorderBox>
          </Col>
          <Col span={14}>
            <BaseBorderBox
              title={"Danh sách sản phẩm đã chọn"}
              styleContent={{
                minHeight: "600px",
                maxHeight: "70%",
                height: "600px",
              }}
            >
              {/* <div className="d-flex align-items-center ml-1 gap-2 mb-1">
                <Typography.Text strong>Chọn nhà cung cấp:</Typography.Text>
                  <SelectSupplier
                    value={supplierFilterId}
                    onChange={(value) => setSupplierFilterId(value)}
                    defaultSuppliers={suppliers}
                  />
              </div> */}
              <TableAnt
                loading={isLoading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSelected}
                size="small"
                pagination={false}
                rowKey={(rc) => rc?._id}
                scroll={{ y: 400 }}
                footer={() => (
                  <Flex justify={"end"}>
                    <Typography.Text style={{ fontStyle: "italic" }} strong>
                      Tổng sản phẩm:{" "}
                      {selectedRowKeys?.length
                        ? `${selectedRowKeys.length} / ${productsCollaborator?.length}`
                        : productsCollaborator?.length}
                    </Typography.Text>
                  </Flex>
                )}
              />
            </BaseBorderBox>
          </Col>
        </Row>
      </BaseBorderBox>
    </div>
  );
}
