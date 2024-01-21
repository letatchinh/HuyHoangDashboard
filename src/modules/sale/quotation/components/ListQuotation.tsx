import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
    useGetQuotations, useQuotationPaging,
    useQuotationQueryParams, useUpdateQuotationParams
} from "../quotation.hook";

import { Dropdown, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { MenuProps } from "antd/lib/index";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import { PATH_APP } from "~/routes/allPath";
import { pagingTable } from "~/utils/helpers";
import { STATUS_QUOTATION_VI } from "../constants";
type propsType = {
  status?: string;
};
const CLONE_STATUS_QUOTATION_VI: any = STATUS_QUOTATION_VI;
export default function ListQuotation({
  status,
}: propsType): React.JSX.Element {
  const [query] = useQuotationQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateQuotationParams(query);
  const [quotations, isLoading] = useGetQuotations(query);
  const paging = useQuotationPaging();
  const items: MenuProps['items'] = useMemo(() => [
    {
      label: 'Cập nhật',
      key: '1',
    },
    {
      label: 'Xoá',
      key: '2',
    },
  ],[]);
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng tạm",
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={PATH_APP.quotation.root + "/" + get(record, "_id")}
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
            <Status
              status={status}
              statusVi={CLONE_STATUS_QUOTATION_VI[status]}
            />
          );
        },
      },
      {
        title: "Thao tác",
        dataIndex: "_id",
        key: "action",
        align: "center",
        render(_id, record, index) {
          return (
            <Dropdown.Button
              type="primary"
              menu={{
                items,
              }}
            >
              Chuyển đổi
            </Dropdown.Button>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="quotation-page">
      <Space>
        <SearchAnt onParamChange={onParamChange} />
      </Space>
      <TableAnt
        columns={columns}
        dataSource={quotations}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
      />
    </div>
  );
}
