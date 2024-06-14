import { Button, Modal } from "antd";
import React, { useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { formatter, useFetchState } from "~/utils/helpers";

import type { TableColumnsType } from "antd";
import { get } from "lodash";
import apis from "../reportGroupEmployeeSeller.api";
type propsType = {
  query?: any;
  pagination?: any;
};
interface Children {
  _id: string;
  quantity: number;
  total: number;
  // productId:  string;
  fullName: string;
  code: string;
}
interface ReportProductType {
  _id: string;
  fullName: string;
  code: string;
  childrens: Children[];
  productName: string;
  variant: string;
  supplier: string;
  productCode: string;
  productGroupName: string;
  quantity: number;
  total: number;
  timeSeries: string;
}

export default function ProductQuantityTable(
  props: propsType
): React.JSX.Element {
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
    api: apis.getProducts,
    query: memoQuery,
    useDocs: true,
  });
  function onClickCell(id: string, name?: string, productId?: string) {
    modal.info({
      icon: <></>,
      title: name,
      content: (
        <ProductQuantityTable
          query={{ ...query, focusId: id, productId: productId }}
        />
      ),
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
                  .join(" > "),
                root?.productId
              )
            }
            style={{color: "#3481FF"}}
            disabled={root.childLength <= 0 ? true : false}
          >
            {" "}
            {record}
          </Button>
        );
      },
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "productGroup",
      key: "productGroup",
      // width: 120,
    },
    {
      title: "Mã thuốc",
      dataIndex: "productCode",
      key: "productCode",
      // width: 120,
    },
    {
      title: "Tên thuốc",
      dataIndex: "product",
      key: "product",
      width: 280,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      // align: "center" as any,
      render(variants, record, index) {
        return <div>{record?.quantity + " (" + record?.variant + ")"}</div>;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "totalPrice",
      key: "totalPrice",
      // width: 180,
      render(record) {
        return formatter(record);
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      // width: 250,
    },
  ];

  const dataSource: ReportProductType[] = data ?? [];

  return (
    <div>
      {contextModal}
      <TableAnt
        dataSource={dataSource}
        // loading={isLoading}
        rowKey={(rc) => rc?.key + get(rc, "timeSeries", "")}
        columns={columns}
        size="small"
        pagination={{
          ...pagination,
          onChange: (current: number, pageSize: number) => {
            setPaging({
              current,
              pageSize,
            });
          },
          total: totalDocs,
          showSizeChanger: true,
          showTotal: (total: any) => `Tổng cộng: ${totalDocs} `,
        }}
        // stickyTop
      />
    </div>
  );
}
