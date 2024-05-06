import { MinusOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Modal, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import Search from "antd/lib/input/Search";
import { get, pick } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import { filterSlug } from "~/utils/helpers";
import {
  useRemoveProductCollaborator,
  useUpdateProductCollaborator,
} from "../collaborator.hook";
import {
  DiscountType,
  ItemSubmitDataProductPartner,
  SubmitDataProductPartner,
} from "../collaborator.modal";
import Discount from "./Discount";
import DiscountForm from "./DiscountForm";
type propsType = {
  id?: any;
  useRemoveProduct: any;
  useUpdateProduct: any;
  isLoading?: boolean;
  dataSource?: any[];
};
export default function ControlProduct({
  id,
  dataSource,
  isLoading,
  useRemoveProduct,
  useUpdateProduct,
}: propsType): React.JSX.Element {
  const [data,setData] = useState<any>([]);
  const [openModalUpdateDiscount, setOpenModalUpdateDiscount] = useState(false);
  const [isSubmitLoading, removeProduct]: any = useRemoveProduct();
  const [, updateProduct]: any = useUpdateProduct();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onSearch = (keyword:any) => {
    const filterResult = dataSource?.filter((item:any) => filterSlug(keyword,get(item,'product.name')) || filterSlug(keyword,get(item,'product.codeBySupplier')));
    setData(filterResult)
  }

  const onRemoveMultiProduct = useCallback(() => {
    const submitData: SubmitDataProductPartner = {
      partnerId: id,
      items: selectedRowKeys?.map((rowKey: any) => ({
        productId: rowKey,
        discount: {
          discountType: "PERCENT",
          value: 0,
        },
      })),
    };
    removeProduct(submitData);
  }, [selectedRowKeys]);
  const onRemoveProduct = useCallback(
    (item: ItemSubmitDataProductPartner) => {
      const submitData: SubmitDataProductPartner = {
        partnerId: id,
        items: [item],
      };
      removeProduct(submitData);
    },
    [id]
  );
  const onUpdateProduct = useCallback(
    (items: ItemSubmitDataProductPartner[]) => {
      const submitData: SubmitDataProductPartner = {
        partnerId: id,
        items,
      };
      updateProduct(submitData);
    },
    [id]
  );
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        dataIndex: "product",
        key: "product",
        render(product, record, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Chiết khấu",
        dataIndex: "discount",
        key: "discount",
        align: "center",
        width: 100,
        render(discount: any, record, index) {
          return (
            <Discount
              onUpdateProduct={(discount: DiscountType) =>
                onUpdateProduct([
                  {
                    productId: get(record, "productId", ""),
                    discount,
                  },
                ])
              }
              loading={isSubmitLoading}
              discount={discount}
            />
          );
        },
      },
      {
        title: selectedRowKeys?.length ? (
          <Dropdown.Button
            menu={{
              items: [
                {
                  label: "Cập nhật chiết khấu",
                  key: "1",
                },
              ],
              onClick: () => setOpenModalUpdateDiscount(true),
            }}
            onClick={onRemoveMultiProduct}
            size="small"
            type="primary"
          >
            Gỡ
          </Dropdown.Button>
        ) : (
          ""
        ),
        dataIndex: "productId",
        key: "productId",
        align: "center",
        width: 70,
        render(productId, record: any, index) {
          return !selectedRowKeys?.includes(productId) ? (
            <Button
              size="small"
              loading={isSubmitLoading}
              onClick={() =>
                onRemoveProduct(pick(record, ["productId", "discount"]))
              }
              danger
            >
              Gỡ
            </Button>
          ) : (
            <></>
          );
        },
      },
    ],
    [id, isSubmitLoading, selectedRowKeys]
  );
  useEffect(() => {
    setSelectedRowKeys([]);
    setData([]);
  }, [dataSource]);
  return (
    <>
      <TableAnt
        title={() => <Search allowClear onChange={(e => onSearch(e.target.value))}/>}
        loading={isLoading}
        dataSource={data?.length ? data : dataSource}
        columns={columns}
        pagination={false}
        size="small"
        scroll={{ y: 400 }}
        rowSelection={rowSelection}
        rowKey={(rc) => rc?.productId}
        footer={() => (
          <Flex justify={"end"}>
            <Typography.Text style={{ fontStyle: "italic" }} strong>
              Tổng sản phẩm:{" "}
              {selectedRowKeys?.length
                ? `${selectedRowKeys.length} / ${dataSource?.length}`
                : dataSource?.length}
            </Typography.Text>
          </Flex>
        )}
      />
      <ModalAnt
        footer={null}
        closable
        onCancel={() => setOpenModalUpdateDiscount(false)}
        open={openModalUpdateDiscount}
      >
        <DiscountForm
          hide={() => setOpenModalUpdateDiscount(false)}
          onUpdateProduct={(discount: DiscountType) => {
            onUpdateProduct(
              selectedRowKeys?.map((rowKey: any) => ({
                productId: rowKey,
                discount,
              }))
            );
          }}
          loading={isSubmitLoading}
        />
        ,
      </ModalAnt>
    </>
  );
}
