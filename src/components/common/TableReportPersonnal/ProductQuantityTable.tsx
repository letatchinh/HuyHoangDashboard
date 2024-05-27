import { ColumnsType } from "antd/es/table";
import React from "react";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { v4 } from "uuid";
type propsType = {
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function ProductQuantityTable(
  props: propsType
): React.JSX.Element {
  const { data, pagination, isLoading } = props;
  const columns: ColumnsType = [
    // {
    //   title: "STT",
    //   key: "index",
    //   width: 50,
    //   render: (text, record, index) => {
    //     return (+newMemoOfDetail.page - 1) * newMemoOfDetail.limit + index + 1;
    //   },
    // },
    {
      title: "Cộng tác viên",
      dataIndex: "seller",
      key: "seller",
      // width: 280,
      // render: (record) => {
      //   return record?.name;
      // },
    },
    {
      title: "Mã thuốc",
      dataIndex: "code",
      key: "code",
      // width: 120,
      // render: (record) => {
      //   return record?.name;
      // },
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      // width: 280,
      // render: (record) => {
      //   return record?.name;
      // },
    },
    // {
    //   title: "Đơn vị cơ bản",
    //   dataIndex: "variant",
    //   key: "variant",
    //   // width: 150,
    //   // render(variants, record, index) {
    //   //   return (
    //   //     <div>
    //   //       {/* {variants?.map((item: any) => get(item, "unit", "") + ", ")} */}
    //   //     </div>
    //   //   );
    //   // },
    // },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      align: "center" as any,
       render(variants, record, index) {
        return (
          <div>
            {record?.quantity + " (" + record?.variant + ")"}
          </div>
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalReport",
      key: "totalReport",
      width: 180,
      render(record) {
        return formatter(record);
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      // width: 250,
      // render: (record) => {
      //   return record?.name;
      // },
    },
  ];
  return (
    <WhiteBox>
      <TableAnt
        dataSource={data ?? []}
        loading={isLoading}
        rowKey={(rc) => [rc?._id,v4()].join('.')}
        columns={columns}
        size="small"
        pagination={pagination}
        stickyTop
      />
    </WhiteBox>
  );
}
