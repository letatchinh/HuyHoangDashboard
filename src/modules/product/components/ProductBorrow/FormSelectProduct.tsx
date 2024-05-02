import {
  Col,
  Flex,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import React, {useMemo, useState} from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import {
  useConvertProductListCollaborator,
} from "../../product.hook";
import Search from "antd/es/input/Search";
import { useGetCollaborator } from "~/modules/collaborator/collaborator.hook";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";
import useProductBorrowContext from "./ProductBorrowContext";
import { filterSelectWithLabel } from "~/utils/helpers";
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
    productOfCollaborator,
    setKeyword,
  } = useProductBorrowContext();
  const [collaborator, isLoading]: any = useGetCollaborator(id);
  const productsCollaborator = useConvertProductListCollaborator(collaborator);
  const [productsList, setProductsList] = useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSearch = (e: any) => {
    const newOptions: any = productsCollaborator?.filter((item: any) => {
      if (item?.name?.toLowerCase().includes(e?.toLowerCase()) || item?.codeBySupplier?.toLowerCase().includes(e?.toLowerCase())) {
        return item;
      };
    });
    setProductsList(newOptions);
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
            allowClear
            onChange={(e: any)=> onSearch(e.target.value)}
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
                loading={isLoading}
                rowSelection={rowSelection}
                columns={columnsReady}
                dataSource={ productsList?.length ? productsList :productsCollaborator}
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
                        ? `${selectedRowKeys?.length} / ${productsCollaborator?.length}`
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
