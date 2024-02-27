import { CheckCircleOutlined } from "@ant-design/icons";
import { Tag, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { formatter } from "~/utils/helpers";
type propsType = {
  record: any;
};
export default function ProcessCumulative({
  record,
}: propsType): React.JSX.Element {
  const discount = useMemo(() => get(record, "discount"),[record]);
  const unit = useMemo(() => get(record, "variantUnit"),[record]);
  const cumulative = useMemo(() => get(discount, "applyVariantId")
  ? get(record, "cumulativeQuantity", 1)
  : get(record, "cumulativeAmount", 1),[discount]);
  const isDone = useMemo(() => cumulative >= get(discount, "condition.gte"),[discount,cumulative]);
  return (
    <span>
      {formatter(cumulative)} /{" "}
      <Typography.Text strong>
        {formatter(get(discount, "condition.gte"))}
      </Typography.Text>{" "}
        {unit ? get(unit,'name','') : "VNĐ"}
      {" "}
     {isDone ? <Tag icon={<CheckCircleOutlined />} color={isDone ? '#4AAC4E' : 'processing'}>{isDone ? "Đã đạt" : "Chưa đạt"}</Tag> : null}
    </span>
  );
}
