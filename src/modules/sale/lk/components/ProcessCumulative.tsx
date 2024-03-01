import { CheckCircleOutlined } from "@ant-design/icons";
import { Flex, Popover, Tag, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { formatter } from "~/utils/helpers";
import ProcessBillItem from "./ProcessBillItem";
type OptionsType = {
  showIsDone?: boolean
}
type propsType = {
  record: any;
  options : OptionsType
};
export default function ProcessCumulative({
  record,
  options
}: propsType): React.JSX.Element {
  const discount = useMemo(() => get(record, "discount"),[record]);
  const bills = useMemo(() => get(record, "bills"),[record]);
  const cumulativeAmount = useMemo(() => get(record, "cumulativeAmount"),[record]);
  const cumulativeQuantity = useMemo(() => get(record, "cumulativeQuantity"),[record]);
  const unit = useMemo(() => get(record, "variantUnit"),[record]);
  const cumulative = useMemo(() => get(discount, "applyVariantId")
  ? get(record, "cumulativeQuantity", 1)
  : get(record, "cumulativeAmount", 1),[discount]);
  const isDone = useMemo(() => get(discount, "condition.isRanger") ? cumulative >= get(discount, "condition.gte") && cumulative < get(discount, "condition.lte") : cumulative >= get(discount, "condition.gte") ,[discount,cumulative]);
  const isOver = useMemo(() => get(discount, "condition.isRanger") ? cumulative > get(discount, "condition.lte") : false ,[discount,cumulative]);
  
  return (
    <Flex align={'center'}>
    <span style={{flex : 1}}>
      <Popover trigger={'click'} content={<ProcessBillItem bills={bills} cumulativeAmount={cumulativeAmount} cumulativeQuantity={cumulativeQuantity} discount={discount}/>}>
      <Typography.Text strong>Đã tích luỹ: <a>{formatter(cumulative)}</a></Typography.Text>
      {" "}
      {(options?.showIsDone && isDone) ? <Tag icon={<CheckCircleOutlined />} color={'#389F0C'}>{"Đã đạt"}</Tag> : null}
      {isOver ? <Tag  color={'#f50'}>{"Đã vượt mức"}</Tag> : null}
      </Popover>
      <Typography.Text type="secondary">
        <br/>
        Mốc: {get(discount, "condition.isRanger") ? "Từ " : "Lớn hơn "}
        {formatter(get(discount, "condition.gte"))}
        {get(discount, "condition.isRanger") && `-${formatter(get(discount, "condition.lte"))}`}
        {" "}
        {unit ? get(unit,'name','') : "VNĐ"}
      </Typography.Text>
      {" "}
    </span>
  
    </Flex>
  );
}
