import { Button, Modal, type TableColumnsType } from "antd";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { formatter, useFetchState } from "~/utils/helpers";
import apis from "../reportGroupCollaborator.api";
type propsType = {
  query?: any;
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

  const [modal, contextModal] = Modal.useModal();
  const [pagination, setPaging] = useState({
    current: 1,
    pageSize: 10,
  });
  
  const memoQuery = useMemo(
    () => ({ ...query, page: pagination.current, limit: pagination.pageSize }),
    [query, pagination]
  );

 const [data, isLoading, totalDocs] = useFetchState({
    api: apis.getAll,
    query: memoQuery,
    useDocs: true,
  });
 
  function onClickCell(id: string, fullName?: string) {
    modal.info({
      icon: <></>,
      title: fullName,
      content: <BillAndDebtTable query={{ ...query, focusId: id }} />,
      maskClosable: true,
      width: "90vw",
      footer: <></>,
      closable: true,
    });
  }

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
      title: "Mã người quản lý",
      dataIndex: "code",
      key: "code",
      width: 120,
      fixed: "left",
    },
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (record, root: any) => {    
        return (
          <Button
            type="text"
            onClick={() =>
              onClickCell(
                root._id,
                root.childrens
                  .map(({ fullName }: any) => fullName)
                  .concat(record)
                  .join(" > ")
              )
            }
            disabled={root?.childLength <= 0 ? true : false}
            style={{color: "#3481FF"}}
          >
            {" "}
            {record}
          </Button>
        );
      },
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

  const dataSource : ReportProductType[] = data ?? [];
  return (
    <div style={{ marginTop: 20 }}>
      {/* <WhiteBox> */}
      {contextModal}
        <TableAnt
          dataSource={dataSource}
          loading={isLoading}
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
            showTotal: () => `Tổng cộng: ${totalDocs} `,
          }}
          stickyTop
          // expandable={expandable}
        />
      {/* </WhiteBox> */}
    </div>
  );
}
