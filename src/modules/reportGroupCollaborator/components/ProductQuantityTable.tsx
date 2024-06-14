import type { TableColumnsType } from "antd";
import { Button, Modal, Table } from "antd";
import React, { useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter, useFetchState } from "~/utils/helpers";
import apis from "../reportGroupCollaborator.api";
type propsType = {
  query?: any;
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
    api: apis.getAllBill,
    query: memoQuery,
    useDocs: true,
  });
 
  function onClickCell(id: string, fullName?: string, productId?: string) {
    modal.info({
      icon: <></>,
      title: fullName,
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
      width: 220,
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
      dataIndex: "productGroupName",
      key: "productGroupName",
      width: 180,
    },
    {
      title: "Mã thuốc",
      dataIndex: "productCode",
      key: "productCode",
      width: 120,
    },
    {
      title: "Tên thuốc",
      dataIndex: "productName",
      key: "productName",
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
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
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
     
    },
  ];
  
  const dataSource : ReportProductType[] = data ?? [];
  
  return (
    <WhiteBox>
      {contextModal}
      <TableAnt
        dataSource={dataSource}
        loading={isLoading}
        rowKey={(rc) => rc?._id}
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
      />
    </WhiteBox>
  );
}
