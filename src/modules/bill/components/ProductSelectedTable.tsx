import { GifOutlined, GiftOutlined, GiftTwoTone, UpCircleTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
import { get } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  EditableCell,
  EditableRow,
} from "~/components/common/EditableComponent";
import useCreateBillStore from "~/store/createBillContext";
import { formatter } from "~/utils/helpers";
import { billItem } from "../bill.modal";
import ExpandRowDiscount from "./ExpandRowDiscount";
type propsType = {};
export default function ProductSelectedTable(
  props: propsType
): React.JSX.Element {
  const { clonedDataSource, onSave } = useCreateBillStore();
  console.log(clonedDataSource, "clonedDataSource");

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
      component: "InputNumber",
      required: true,
    },
    // {
    //   title: "Chiết khấu",
    //   dataIndex: "name",
    //   key: "name",
    // },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render : (item : any,record : any) => {
        return formatter(item)
      }
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      key: "total",
      render : (item : any,record : any) => {
        return formatter(item * get(record,'quantity',1))
      }
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const tableProps = {
    components,
    columns: columns?.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any, rowIndex: any) => {
          const editable =
            typeof col.editable === "function"
              ? col.editable(record)
              : !!col.editable;
          const max = typeof col.max === "function" ? col.max(record) : null;
          return {
            record,
            rowIndex,
            editable,
            dataIndex: col.dataIndex,
            title: col.title,

            component: col.component,
            required: col.required,
            max,
            handleSave: onSave,
          };
        },
      };
    }),

    // use cloned data source so that it can be submitted when complete
    dataSource: clonedDataSource,
  };
console.log(clonedDataSource,'clonedDataSource');

  return (
    <TableAnt
      className="table-selected-product"
      {...tableProps}
      size="small"
      pagination={false}
      expandable={{
        expandedRowRender: (record: billItem) => (
          <ExpandRowDiscount data={get(record, "cumulativeDiscount")} />
        ),
        defaultExpandAllRows: true,
        rowExpandable: (record: billItem) =>
          !!get(record, "cumulativeDiscount", [])?.length,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <UpCircleTwoTone onClick={(e: any) => onExpand(record, e)} />
          ) : (
            <GiftTwoTone onClick={(e: any) => onExpand(record, e)} />
          ),
      }}
    />
  );
}
