import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import {
  useGetSuppliersProductAuthor,
  useSuppliersProductAuthorQueryParams,
} from "~/modules/supplier/supplier.hook";
import { DataType } from "../productsAll.modal";
import { get } from "lodash";
import { Button, Checkbox, Col, Row } from "antd";
import { Table } from "antd";
import { useSetSupplierInfo, useSupplierInfoRedux } from "../productsAll.hook";
type propsType = {
  onChangeStep?: any;
  onCloseModal?: any;
  step?: number;
  supplierId?: string | null;
  setSupplierId?: any;
  keyword?: string;
};
export default function FormListSupplier({
  onChangeStep,
  onCloseModal,
  step,
  supplierId,
  setSupplierId,
  keyword,
}: propsType): React.JSX.Element {
  const [query] = useSuppliersProductAuthorQueryParams(keyword);
  const [data, isLoading] = useGetSuppliersProductAuthor(query);
  const onSetSupplierInfo = useSetSupplierInfo();
  const supplierInfo = useSupplierInfoRedux();

  const onChange = (e: any, item: any) => {
    if (e.target.checked) {
      setSupplierId(item?._id);
      onSetSupplierInfo(item);
    } else {
      setSupplierId(null);
      onSetSupplierInfo(undefined);
    }
  };
  useEffect(() => {
    setSupplierId(supplierInfo?._id);
  }, [supplierInfo]);

  const columns: ColumnsType<DataType> = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chọn",
      key: "checkbox",
      render: (variant, rc) => {
        return (
          <Checkbox
            onChange={(e) => onChange(e, rc)}
            disabled={
              supplierId ? (rc?._id === supplierId ? false : true) : false
            }
            checked={rc?._id === supplierId}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data ?? []}
        loading={isLoading}
        rowKey={(rc) => rc?._id}
        pagination={false}
      />
    </div>
  );
}
