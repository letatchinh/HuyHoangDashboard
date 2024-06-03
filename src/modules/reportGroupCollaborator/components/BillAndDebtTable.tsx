import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import { useGetReportGroupCollaborators } from "../reportGroupCollaborator.hook";
import { v4 } from "uuid";
import type { TableColumnsType } from "antd";
import { get } from "lodash";
type propsType = {
  query?: any;
  pagination?: any;
};
interface Children {
  _id: string;
  code: string;
  fullName: string;
  billTotalPrice: number;
  count: number;
  debt: number;
}
interface ReportProductType {
  _id: string;
  fullName: string;
  code: string;
  childrens: Children[];
  billTotalPrice: number;
  count: number;
  debt: number;
  timeseries: string;
}
export default function BillAndDebtTable(props: propsType): React.JSX.Element {
  const { query, pagination } = props;
  const [data, isLoading] = useGetReportGroupCollaborators(query);

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
      width: 120,
    },
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Doanh số",
      dataIndex: "billTotalPrice",
      key: "billTotalPrice",
      width: 200,
      render(value) {
        return formatter(value);
      },
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "count",
      key: "count",
      width: 120,
      render(value) {
        return formatter(value??0);
      },
    },
    {
        title: "Công nợ",
        dataIndex: "debt",
        key: "debt",
        width: 200,
        render(value) {
          return formatter(value);
        },
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
      title: "Doanh số",
      dataIndex: "billTotalPrice",
      key: "billTotalPrice",
      width: 200,
      render(value) {
        return formatter(value);
      },
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "count",
      key: "count",
      width: 120,
      render(value) {
        return formatter(value);
      },
    },
    {
        title: "Công nợ",
        dataIndex: "debt",
        key: "debt",
        width: 200,
        render(value) {
          return formatter(value);
        },
      },
  ]
  const expandable = {
    expandedRowRender: (record: any) => <TableAnt
      columns={columnsList}
      dataSource={record.childrens}
      pagination={false}
      rowKey={record => record._id+get(record,'timeseries','')}
    />,
    rowExpandable: (record: any) => record.childrens && record.childrens.length > 0,
  };
  const dataSource : ReportProductType[] = data ?? [];
  return (
    <div style={{ marginTop: 20 }}>
      <WhiteBox>
        <TableAnt
          dataSource={dataSource}
          loading={isLoading}
          rowKey={(rc) => rc?._id+ get(rc,'timeseries','')}
          columns={columns}
          size="small"
          pagination={pagination}
          stickyTop
          expandable={expandable}
        />
      </WhiteBox>
    </div>
  );
}
