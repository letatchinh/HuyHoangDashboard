import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";

import { Button, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable } from "~/utils/helpers";
import { STATUS_BILL_VI } from "../constants";
import {
  useGetOrderSuppliers,
  useOrderSupplierPaging,
  useOrderSupplierQueryParams,
  useUpdateOrderSupplier,
  useUpdateOrderSupplierParams,
} from "../orderSupplier.hook";
import WithPermission from "~/components/common/WithPermission";
import { PlusCircleTwoTone } from "@ant-design/icons";
import policyModule from "policy";

type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListOrder({ status }: propsType): React.JSX.Element {
  const [query] = useOrderSupplierQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateOrderSupplierParams(query);
  const [orderSuppliers, isLoading] = useGetOrderSuppliers(query);
  const paging = useOrderSupplierPaging();
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
              to={PATH_APP.orderSupplier.root + "/" + get(record, "_id")}
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
            <Typography.Text strong>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Tên nhà cung cấp",
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
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
        align: "center",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        align: "center",
      },
      {
        title: "Số tiền đã trả",
        dataIndex: "pair",
        key: "pair",
        align: "center",
        render(pair, record, index) {
          return <Typography.Text>{formatter(pair)}</Typography.Text>;
        },
      },
      {
        title: "Số tiền phải trả",
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
      <Row align="middle" gutter={8}>
        {/* <SelectPharmacy
          showIcon={false}
          size={"middle"}
          onChange={(value) => onParamChange({ pharmacyId: value })}
        />
        <SearchAnt
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onParamChange={onParamChange}
        /> */}
        <WithPermission permission={policyModule.POLICIES.WRITE_QUOTATION}>
          <Button
            style={{ marginLeft: "auto" }}
            onClick={() => window.open(PATH_APP.orderSupplier.create)}
            type="primary"
            icon={<PlusCircleTwoTone />}
          >
            Tạo đơn hàng
          </Button>
        </WithPermission>
      </Row>
      <TableAnt
        stickyTop
        columns={columns}
        dataSource={orderSuppliers}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size="small"
      />
    </div>
  );
}
