import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useBillPaging,
  useBillQueryParams,
  useGetBills,
  useUpdateBillParams,
} from "../bill.hook";

import { Select, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable } from "~/utils/helpers";
import { STATUS_BILL_VI } from "../constants";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
  const [query] = useBillQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] = useUpdateBillParams(query);
  const [bills, isLoading] = useGetBills(query);
  const paging = useBillPaging();
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={PATH_APP.bill.root + "/" + get(record, "_id")}
            >
              {codeSequence}
            </Link>
          );
        },
      },
      {
        title: "Ngày tạo đơn",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render(createdAt, record, index) {
          return (
            <Typography.Text>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "center",
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        render(status, record, index) {
          return (
            <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
          );
        },
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        align: "center",
        render(pair, record, index) {
          return <Typography.Text>{formatter(pair)}</Typography.Text>;
        },
      },
      {
        title: "Khách phải trả",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        render(totalPrice, record, index) {
          return <Typography.Text>{formatter(totalPrice)}</Typography.Text>;
        },
      },
    ],
    []
  );
  return (
    <div className="bill-page">
      <Space>
        <SelectSupplier onChange={(value) => onParamChange({supplierIds : value})} mode='multiple'/>
      <SearchAnt onParamChange={onParamChange} />
      </Space>
      <TableAnt
      stickyTop
        columns={columns}
        dataSource={bills}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size='small'
      />
    </div>
  );
}
