import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { formatter } from "~/utils/helpers";
import TableAnt from "~/components/Antd/TableAnt";
import { v4 } from "uuid";
import moment from "moment";
import { Table } from "antd";
import WhiteBox from "~/components/common/WhiteBox";
import { useGetReportGroupCollaboratorsBill } from "../reportGroupCollaborator.hook";
import type { TableColumnsType } from "antd";
type propsType = {
  query?: any;
  pagination?: any;
};
interface Children {
  _id: string;
  quantity: number;
  total: number;
  // productId:  string;
  fullName: string;
  code: string;
}
interface ReportProductType {
  _id: string;
  fullName: string;
  code: string;
  childrens: Children[];
  productName: string;
  variant: string;
  supplier: string;
  productCode: string;
  productGroupName: string;
  quantity: number;
  total: number;
  timeseries: string;
}

export default function ProductQuantityTable(
  props: propsType
): React.JSX.Element {
  const { query, pagination } = props;
  const [data, isLoading] = useGetReportGroupCollaboratorsBill(query);
  const columns: TableColumnsType<ReportProductType> = [
    ...(query?.getByRanger === true
      ? [
          {
            title: "Chu kì",
            dataIndex: "timeseries",
            key: "timeseries",
            width: 120,
          },
        ]
      : []),
    {
      title: "Mã người quản lý",
      dataIndex: "code",
      key: "code",
      // width: 280,
    },
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      // width: 280,
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "productGroupName",
      key: "productGroupName",
      // width: 120,
    },
    {
      title: "Mã thuốc",
      dataIndex: "productCode",
      key: "productCode",
      // width: 120,
    },
    {
      title: "Tên thuốc",
      dataIndex: "productName",
      key: "productName",
      width: 280,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      // align: "center" as any,
      render(variants, record, index) {
        return <div>{record?.quantity + " (" + record?.variant + ")"}</div>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      // width: 180,
      render(record) {
        return formatter(record);
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      // width: 250,
    },
  ];
  const columnsList: TableColumnsType<Children> = [
    {
      title: "Mã người quản lý",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      // align: "center" as any,
      render(variants, record, index) {
        return <div>{record?.quantity}</div>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      // width: 180,
      render(record) {
        return formatter(record);
      },
    },
  ];
  const expandable = {
    expandedRowRender: (record: any) => (
      <Table
        columns={columnsList}
        dataSource={record.childrens}
        pagination={false}
        rowKey={(record) => record._id}
      />
    ),
    rowExpandable: (record: any) =>
      record.childrens && record.childrens.length > 0,
  };
  const dataSource : ReportProductType[] = data ?? [];
  
  return (
    <WhiteBox>
      <TableAnt
        dataSource={dataSource}
        loading={isLoading}
        rowKey={(rc) => rc?._id}
        columns={columns}
        size="small"
        pagination={pagination}
        expandable={expandable}
        
        // stickyTop
      />
    </WhiteBox>
  );
}
