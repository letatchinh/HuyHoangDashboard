import { CheckCircleOutlined } from "@ant-design/icons";
import { Flex, Popover, Tag, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { formatter } from "~/utils/helpers";
import ProcessBillItem from "./ProcessBillItem";
type propsType = {
  record: any;
};
export default function ProcessCumulative({
  record,
}: propsType): React.JSX.Element {
  const discount = useMemo(() => get(record, "discount"),[record]);
  const bills = useMemo(() => get(record, "bills"),[record]);
  const cumulativeAmount = useMemo(() => get(record, "cumulativeAmount"),[record]);
  const cumulativeQuantity = useMemo(() => get(record, "cumulativeQuantity"),[record]);
  const unit = useMemo(() => get(record, "variantUnit"),[record]);
  const cumulative = useMemo(() => get(discount, "applyVariantId")
  ? get(record, "cumulativeQuantity", 1)
  : get(record, "cumulativeAmount", 1),[discount]);
  const isDone = useMemo(() => cumulative >= get(discount, "condition.gte"),[discount,cumulative]);
  return (
    <Flex align={'center'}>
    <span style={{flex : 1}}>
      <Popover trigger={'click'} content={<ProcessBillItem bills={bills} cumulativeAmount={cumulativeAmount} cumulativeQuantity={cumulativeQuantity} discount={discount}/>}>
      <a>{formatter(cumulative)}</a>
      </Popover> /{" "}
      <Typography.Text strong>
        {formatter(get(discount, "condition.gte"))}
      </Typography.Text>{" "}
        {unit ? get(unit,'name','') : "VNĐ"}
      {" "}
    </span>
    {isDone ? <Tag icon={<CheckCircleOutlined />} color={isDone ? '#4AAC4E' : 'processing'}>{isDone ? "Đã đạt" : "Chưa đạt"}</Tag> : null}
    </Flex>
  );
}
