import { GiftTwoTone, MinusCircleTwoTone, UpCircleTwoTone } from "@ant-design/icons";
import { Select, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  EditableCell,
  EditableRow
} from "~/components/common/EditableComponent";
import { formatter } from "~/utils/helpers";
import { quotation, variant } from "../bill.modal";
import useCreateBillStore from "../storeContext/CreateBillContext";
import ExpandRowDiscount from "./ExpandRowDiscount";
type propsType = {};
export default function ProductSelectedTable(
  props: propsType
): React.JSX.Element {
  const { quotationItems, onSave,onRemove } = useCreateBillStore();
  const onSelect = (value : string,options : any) => {
    if(!options) return;
    const {data} = options;
    
  }
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
      render : (name : string,record : any) => {
        const optionsVariant = get(record, "variants",[])?.map((variant : variant) => ({
          label : get(variant, "unit.name",""),
          value : get(variant, "_id",""),
          data : variant
        }))
      return <div>
        <Typography.Text strong>{get(record,'codeBySupplier')} 
        <Select options={optionsVariant}
        onSelect={onSelect}
        /></Typography.Text>
        <p className="m-0">{name}</p>
      </div>
      }
    },
    {
      title: "Chiết khấu",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      render : (totalDiscount : number) => formatter(totalDiscount)
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      editable: true,
      component: "InputNumber",
      required: true,
    },
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
      dataIndex: "totalPrice",
      key: "totalPrice",
      render : (item : any,record : any) => {
        return <Typography.Text strong>{formatter(item)}</Typography.Text>
      }
    },
    {
      title: "",
      dataIndex: "key",
      key: "action",
      render : (key : any,record : any) => {
        return <MinusCircleTwoTone onClick={() => onRemove(key)}/>
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
    dataSource: quotationItems,
  };
  console.log(quotationItems,'quotationItems');
  
  return (
    <TableAnt
      className="table-selected-product"
      {...tableProps}
      size="small"
      pagination={false}
      expandable={{
        expandedRowRender: (record: quotation) => (
          <ExpandRowDiscount data={get(record, "cumulativeDiscount")} />
        ),
        defaultExpandAllRows: true,
        rowExpandable: (record: quotation) =>
          !!get(record, "cumulativeDiscount", []).length,
        expandIcon: ({ expanded, onExpand, record ,expandable}) =>
        expandable ? 
          expanded ? (
            <UpCircleTwoTone onClick={(e: any) => onExpand(record, e)} />
          ) : (
            <GiftTwoTone onClick={(e: any) => onExpand(record, e)} />
          ) : null,
      }}
    />
  );
}
