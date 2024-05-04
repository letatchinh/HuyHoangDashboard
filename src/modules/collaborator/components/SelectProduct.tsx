import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Flex, Table, Typography } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/lib/table/InternalTable";
import { debounce, get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import EmptyData from "~/components/Antd/EmptyData";
import SearchAnt from "~/components/Antd/SearchAnt";
import TableAnt from "~/components/Antd/TableAnt";
import { useAddProductCollaborator } from "../collaborator.hook";
import { SubmitDataProductPartner } from "../collaborator.modal";
import { ConfigType } from "./CollaboratorProduct";
import useCollaboratorProductStore from "../CollaboratorProductProvider";
type propsType = {
  id?: any;
  dataSource?: any[];
  mutate : () => void,
  setKeyword : (kw:any) => void,
  totalDocs : number,
  loading : boolean,
  useAddProduct : any,
  config? : ConfigType
};
export default function SelectProduct({
  id,
  dataSource,
  mutate,
  totalDocs,
  setKeyword,
  loading,
  useAddProduct,
  config
}: propsType): React.JSX.Element {
  const {canAdd} = useCollaboratorProductStore();
  const [isSubmitLoading, addProduct] = useAddProduct();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onAddMultiProduct = useCallback(() => {
    const submitData: SubmitDataProductPartner = {
        partnerId: id,
        items: selectedRowKeys?.map((rowKey:any) => ({
            productId: rowKey,
            discount: config?.discount || {
              discountType : "PERCENT",
              value : 10,
            },
          }))
      };
      addProduct(submitData);
  },[selectedRowKeys]);
  const onAddProduct = useCallback((value: any) => {
    const submitData: SubmitDataProductPartner = {
      partnerId: id,
      items: [
        {
          productId: value,
          discount: config?.discount || {
            discountType: "PERCENT",
            value: 10,
          },
        },
      ],
    };
    addProduct(submitData);
  }, [id]);
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Chọn tất cả",
        dataIndex: "name",
        key: "name",
        render(name, product, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
      },
      {
        title: selectedRowKeys?.length && canAdd ? <Button size="small" onClick={onAddMultiProduct} type="primary">Thêm</Button> : "",
        dataIndex: "_id",
        key: "_id",
        align : 'end',
        width : 100,
        render(_id, record: any, index) {
          return !selectedRowKeys?.includes(_id) && canAdd ? (
            <Button
              type="primary"
              onClick={() => onAddProduct(_id)}
              icon={<PlusOutlined />}
              loading={isSubmitLoading}
              size='small'
            >
              Thêm
            </Button> 
          ): <></>;
        },
      },
    ],
    [id,selectedRowKeys,isSubmitLoading]
  );
  useEffect(() => {
    setSelectedRowKeys([]);
  },[dataSource]);

  const fetcher = (e : any) => setKeyword(e.target.value);
  const debounceFetcher = debounce(fetcher,500)
  return (
    <TableAnt
    title={() => <Search allowClear onChange={debounceFetcher}/>}
      locale={{
        emptyText : <EmptyData mess={<Button type='primary' ghost icon={<SyncOutlined />} onClick={mutate}>Thử lại</Button>}/>
      }}
      loading={loading}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={dataSource}
      size='small'
      pagination={false}
      rowKey={rc=>rc?._id}
      scroll={{y : 400}}
      footer={() => <Flex justify={'end'}>
        <Typography.Text style={{fontStyle : 'italic'}} strong>
        Tổng sản phẩm: {selectedRowKeys?.length ? `${selectedRowKeys.length} / ${totalDocs}` : totalDocs}
        </Typography.Text>
      </Flex>}
    />
  );
}
