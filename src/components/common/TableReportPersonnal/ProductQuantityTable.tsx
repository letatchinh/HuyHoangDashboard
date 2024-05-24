import { ColumnsType } from "antd/es/table";
import React from "react";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
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
      title: "Mã thuốc",
      dataIndex: "variants",
      key: "variants",
      width: 120,
      render: (record) => {
        return record?.name;
      },
    },
    {
      title: "Tên thuốc",
      dataIndex: "product",
      key: "product",
      width: 280,
      render: (record) => {
        return record?.name;
      },
    },
    {
      title: "Đơn vị cơ bản",
      dataIndex: "variants",
      key: "variants",
      width: 150,
      render(variants, record, index) {
        return (
          <div>
            {/* {variants?.map((item: any) => get(item, "unit", "") + ", ")} */}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      width: 150,
      align: "center" as any,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 180,
      render(record) {
        return formatter(record);
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      width: 250,
      render: (record) => {
        return record?.name;
      },
    },
  ];
  return (
    <WhiteBox>
      <TableAnt
        dataSource={data || []}
        loading={isLoading}
        rowKey={(rc) => rc?._id}
        columns={columns}
        size="small"
        pagination={pagination}
        stickyTop
      />
    </WhiteBox>
  );
}
