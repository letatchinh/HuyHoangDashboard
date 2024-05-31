import { ColumnsType } from "antd/es/table";
import { TableRowSelection } from "antd/es/table/interface";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import { useGetReportGroupCollaborators } from "../reportGroupCollaborator.hook";
import { v4 } from "uuid";
type propsType = {
  query?: any;
  pagination?: any;
};

// interface DataType {
//   // key: React.ReactNode;
//   fullName?: string;
//   code?: string;
//     childrens?:        DataType[];
//     parentName:       string;
//     productId:        string;
//     productName:      string;
//     supplierId:       string;
//     productCode:      string;
//     variant:          string;
//     supplier:         string;
//     productGroupName: string;
//     supplierCode:     string;
//     quantity:         number;
//     total:            number;
//     timeseries:       string;
// }
export default function BillAndDebtTable(props: propsType): React.JSX.Element {
  const { query, pagination} = props;
  const [data, isLoading] = useGetReportGroupCollaborators(query);
  // const rowSelection: TableRowSelection<DataType> = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   },
  //   onSelect: (record, selected, selectedRows) => {
  //     console.log(record, selected, selectedRows);
  //   },
  //   onSelectAll: (selected, selectedRows, changeRows) => {
  //     console.log(selected, selectedRows, changeRows);
  //   },
  // };
  const columns: ColumnsType = [
    ...(query?.getByRanger === true
      ? [
          {
            title: "Chu kì",
            dataIndex: "timeSeries",
            key: "timeSeries",
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
  ];
  return (
    <div style={{ marginTop: 20 }}>
      <WhiteBox>
        <TableAnt
          dataSource={data || []}
          loading={isLoading}
          rowKey={(rc) => [rc?._id,v4()].join('.')}
          columns={columns}
          size="small"
          pagination={pagination}
          stickyTop
        />
      </WhiteBox>
    </div>
  );
}
