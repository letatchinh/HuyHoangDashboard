import { GiftTwoTone } from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { formatter } from "~/utils/helpers";
import { typeCumulativeDiscount } from "../bill.modal";
type propsType = {
  data: typeCumulativeDiscount[],
};
 const TYPE_VALUE_VI = {
  VALUE : "Đ",
  PERCENT : "%",
}
const TYPE_DISCOUNT_VI = {
  "DISCOUNT.CORE" : "Chiết khấu cứng",
  "DISCOUNT.SOFT" : "Chiết khấu mềm",
  LK : "Luỹ kế",
}
// const CLONE_TYPE_VALUE_VI : any = TYPE_VALUE_VI;
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
export default function ExpandRowDiscount({
  data,
}: propsType): React.JSX.Element {
  
    return (
        <div>
          {data?.map((item: typeCumulativeDiscount) => (
            <Row key={get(item, 'id')}>
              <Col span={12}>
                <Typography.Text strong><GiftTwoTone /> <Tag color='success'>{CLONE_TYPE_DISCOUNT_VI[get(item,'typeDiscount','')]}</Tag> {get(item, 'name')}</Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong>{}</Typography.Text>
              </Col>
              <Col span={4}>
                {/* <Typography.Text strong>{formatter(get(item, 'value')) + " " +CLONE_TYPE_VALUE_VI[get(item,'valueType')]}</Typography.Text> */}
                <Typography.Text strong type="warning">- {formatter(get(item, 'actualValue'))}</Typography.Text>
              </Col>
            </Row>
          ))}
        </div>
      );
}
