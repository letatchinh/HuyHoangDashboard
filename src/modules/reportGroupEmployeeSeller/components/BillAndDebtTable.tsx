import React, { useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter, useFetchState } from "~/utils/helpers";

import { Button, Modal, type TableColumnsType } from "antd";
import { get } from "lodash";
import { useGetReportGroupEmployeeSellers } from "../reportGroupEmployeeSeller.hook";
import apis from "../reportGroupEmployeeSeller.api";
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
  timeSeries: string;
}
const getKeyRow = (rc?: any) => (rd: any, idx?: number) =>
  [
    get(rc, "_id", ""),
    idx,
    get(rd, "_id"),
    get(rd, "timeSeries", ""),
    "TYPE_BILL",
  ].join("_");

export default function BillAndDebtTable(props: propsType): React.JSX.Element {
  const { query } = props;
  const [pagination, setPaging] = useState({
    current: 1,
    pageSize: 10,
  });
  const memoQuery = useMemo(
    () => ({ ...query, page: pagination.current, limit: pagination.pageSize }),
    [query, pagination]
  );

  const [modal, contextModal] = Modal.useModal();
  const [data, , totalDocs] = useFetchState({
    api: apis.getAll,
    query: memoQuery,
    useDocs: true,
  });

  const columns: TableColumnsType<ReportProductType> = [
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
      title: "Nhóm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (record, root: any) => {
        return (
          <Button
            type="text"
            onClick={() =>
              onClickCell(
                root._id,
                root.listParent
                  .map(({ name }: any) => name)
                  .concat(record)
                  .join(" > ")
              )
            }
          >
            {" "}
            {record}
          </Button>
        );
      },
    },
    {
      title: "Doanh số",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 200,
      render(value) {
        return formatter(value);
      },
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "countBill",
      key: "countBill",
      width: 120,
      render(value) {
        return formatter(value ?? 0);
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

  function onClickCell(id: string, name?: string) {
    modal.info({
      icon: <></>,
      title: name,
      content: <BillAndDebtTable query={{ ...query, focusId: id }} />,
      maskClosable: true,
      width: "90vw",
      footer: <></>,
      closable: true,
    });
  }
  const dataSource: ReportProductType[] = data ?? [];
  return (
    <div style={{ marginTop: 20 }}>
      <WhiteBox>
        {contextModal}
        <TableAnt
          dataSource={dataSource}
          // loading={isLoading}
          rowKey={getKeyRow()}
          columns={columns}
          size="small"
          pagination={{
            ...pagination,
            total: totalDocs,
            onChange: (current: number, pageSize: number) => {
              setPaging({
                current,
                pageSize,
              });
            },
            showSizeChanger: true,
            showTotal: (total: any) => `Tổng cộng: ${totalDocs} `,
          }}
          stickyTop
        />
      </WhiteBox>
    </div>
  );
}
