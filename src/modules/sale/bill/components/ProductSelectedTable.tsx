import { DeleteOutlined, GiftTwoTone, UpCircleTwoTone } from "@ant-design/icons";
import { Badge, Button, InputNumber, Select, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  EditableCell,
  EditableRow
} from "~/components/common/EditableComponent";
import { formatter } from "~/utils/helpers";
import { DiscountOtherType, quotation, variant } from "../bill.modal";
import useCreateBillStore from "../storeContext/CreateBillContext";
import DiscountOther from "./DiscountOther";
import ExpandRowDiscount from "./ExpandRowDiscount";
import ImageProduct from "./ImageProduct";
import ProductListSuggest from "./productSuggest";

type propsType = {};
export default function ProductSelectedTable(
  props: propsType
): React.JSX.Element {
  const { quotationItems, onSave,onRemove,bill } = useCreateBillStore();  
  const [selectRowKey,setSelectRowKey] = useState<any[]>([]);
  const onSelect = (newVariantId : string,data : any) => {
    const variant = get(data,'variants',[])?.find((item : any) => get(item,'_id') === newVariantId);
    onSave({
      ...data,
      variant,
      variantId : newVariantId
    }) 
  }
  const onChangeRowKey = (newKey : string) => {
    if(selectRowKey.includes(newKey)){
      setSelectRowKey(selectRowKey.filter(item => item !== newKey))
    }else{
      setSelectRowKey([...selectRowKey,newKey])
    }
 
  }
  const columns = [
    {
      title: "",
      dataIndex: "images",
      key: "images",
      align:'center',
      width : 80,
      render: (images: any, record: any, index: number) => <ImageProduct images={images}/>
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
         
        {get(record,'variants',[])?.length > 1 ? <Select 
        className="mx-1"
        value={get(record, "variantId")}
        options={optionsVariant}
        onSelect={(value:any) => {
          onSelect(value,record)
        }} 
        /> : <span className="mx-1">({get(record,'variant.unit.name')})</span>}</Typography.Text>
        <p className="m-0">{name}</p>
      </div>
      }
    },
    
    {
      title: "Số lượng",
      dataIndex: "quantityActual",
      key: "quantityActual",
      editable: true,
      component: "InputNumber",
      align : 'center',
      required: true,
    },
    {
      title: "Giá niêm yết",
      dataIndex: "price",
      key: "price",
      align : 'center',
      render : (item : any,record : any) => {
        return formatter(item)
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "amountPrice",
      key: "amountPrice",
      align : 'center',
      render : (item : any,record : any) => {
        return formatter(Math.floor(get(record,'price',1) * get(record,'quantityActual',1)))
      }
    },
    {
      title: "Chiết khấu",
      dataIndex: "totalDiscount",
      key: "totalDiscount",
      align : 'center',
      render : (totalDiscount : number,record:any) => <Tooltip title="Xem chi tiết chiết khấu">
        <Button type="text" onClick={() => onChangeRowKey(record?.productId)}>{formatter(totalDiscount + get(record,'totalDiscountOther',0))}</Button>
      </Tooltip>
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align : 'center',
      render : (item : any,record : any) => {
        return <Typography.Text strong>{formatter(item)}</Typography.Text>
      }
    },
    {
      title: "Phí vận chuyển",
      dataIndex: "logistic",
      key: "logistic",
      align : 'center',
      render: (value: number) => (
        <InputNumber value={value}
          formatter={(value) => formatter(value)}
          min={0}
      />)
    },
    {
      title: "",
      dataIndex: "key",
      key: "action",
      render : (key : any,record : any) => {
        return <DeleteOutlined style={{color : 'red'}} onClick={() => onRemove(key)}/>
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
  
  return (
    <>
    <TableAnt
      className="table-selected-product"
      {...tableProps}
      size="small"
      rowKey={rc => rc?.productId}
      pagination={false}
      expandable={{
        expandedRowRender: (record: quotation) => {
          return (
            <div>
              <DiscountOther 
              totalDiscountOther={get(record,'totalDiscountOther',0)} 
              dataSource={get(record,'discountOther',[])} 
              onAdd={(newDiscountOther:DiscountOtherType) => onSave({
                ...record,
                discountOther : [...get(record,'discountOther',[]),newDiscountOther]
              })}
              onUpdate={(newDiscountOther:DiscountOtherType,index:number) => {
                const cloneDcOther = [...get(record,'discountOther',[])];
                cloneDcOther?.splice(index,1,newDiscountOther)
                onSave({
                  ...record,
                  discountOther : cloneDcOther
                })
              }}
              onRemove={(index:number) => onSave({
                ...record,
                discountOther : get(record,'discountOther',[])?.filter((i:any,idx:number) => idx !== index)
              })}
              />
              <ExpandRowDiscount data={get(record, "cumulativeDiscount")} />
            </div>
          )
        },
        expandedRowKeys : selectRowKey,
        expandIcon: ({ expanded, record }) =>
          expanded ? (
            <UpCircleTwoTone onClick={(e: any) => onChangeRowKey(record?.productId)} />
          ) : (
            <Badge size="small" count={get(record, "cumulativeDiscount", []).length}>
              <GiftTwoTone style={{fontSize : 24}} onClick={(e: any) => onChangeRowKey(record?.productId)} />
            </Badge>
          ),
      }}
    />
    {bill?.pharmacyId &&  <ProductListSuggest/>}
    </>
  );
}
