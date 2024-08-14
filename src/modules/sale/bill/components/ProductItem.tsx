import { Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { STATUS_BILLITEM_LEVEL } from "../../billItem/constants";
import { STATUS_BILL } from "../constants";
import FormLot from "../../billItem/components/FormLot";
import { formatter } from "~/utils/helpers";
type propsType = {
  data?: any[];
  column?: any;
  stylesTable?: any;
};
export default function ProductItem({
  data,
  column,
  stylesTable,
  ...props
}: propsType): React.JSX.Element {
  const CLONE_STATUS_BILLITEM_LEVEL: any = STATUS_BILLITEM_LEVEL;
  const columns: ColumnsType = [
    {
      title: "Mã sản phẩm",
      dataIndex: "variant",
      key: "variant.variantCode",
      align: "center",
      render(variant, record, index) {
        return (
          <Typography.Text>{get(variant, "variantCode", "")}</Typography.Text>
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product.name",
      render(product, record, index) {
        const status: any = get(record, "status", "");
        const lotNumber = get(record, "lotNumber", "");
        const expirationDate = get(record, "expirationDate");
        const _id = get(record, "_id", "");
        // const {nextStatus,message} = getNextStatus({status,lotNumber,expirationDate});
        return (
          <div className="d-flex flex-column">
            <Typography.Text>
              {get(record, "codeBySupplier")} - {get(product, "name", "")}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render(quantity, record, index) {
        return <Typography.Text>{quantity}</Typography.Text>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "variant",
      key: "variant",
      align: "center",
      render(variant, record, index) {
        return (
          <Typography.Text>{formatter(get(variant, "price"))}</Typography.Text>
        );
      },
    },
    {
      title: "Chiết khấu",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      align: "center",
      render(totalDiscount, record, index) {
        return <Typography.Text>{formatter(totalDiscount)}</Typography.Text>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalRoot",
      key: "totalRoot",
      align: "center",
      render(totalRoot, record, index) {
        return (
          <Typography.Text strong>{formatter(totalRoot)}</Typography.Text>
        );
      },
    },
  ];
  if (column) {
    columns.push(column);
  };
  
  return (
    <>
      <h6>Danh sách sản phẩm</h6>
      <TableAnt
        className="mb-3"
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
        {...props}
        style={stylesTable}
      />
    </>
  );
}
