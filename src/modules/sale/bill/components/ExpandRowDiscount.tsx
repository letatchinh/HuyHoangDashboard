import { GiftTwoTone } from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import cumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { formatter } from "~/utils/helpers";
import { typeCumulativeDiscount } from "../bill.modal";
type propsType = {
  data: typeCumulativeDiscount[],
};
// const TYPE_DISCOUNT_VI = {
//   "DISCOUNT.CORE" : "Chiết khấu cứng",
//   "DISCOUNT.SOFT" : "Chiết khấu mềm",
//   LK : "Luỹ kế",
// }
const {TYPE_VALUE_VI,TYPE_DISCOUNT_VI,TARGET_VI,TYPE_VALUE} = cumulativeDiscountModule.constants;
const CLONE_TYPE_VALUE_VI : any = TYPE_VALUE_VI;
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TARGET_VI: any = TARGET_VI;
export default function ExpandRowDiscount({
  data,
}: propsType): React.JSX.Element {
  console.log(data,'data');
  
    return (
        <div>
          {data?.map((item: typeCumulativeDiscount) => (
            <Row key={get(item, 'id')}>
              <Col span={12}>
                <Typography.Text strong> <Tag color='success'>{CLONE_TYPE_DISCOUNT_VI[get(item,'typeDiscount','')]} - {CLONE_TARGET_VI?.[get(item,'target')]}</Tag> {get(item, 'name')}</Typography.Text>
              </Col>
              <Col span={6}>
              {/* <Typography.Text strong>{formatter(get(item, 'value')) + " " +CLONE_TYPE_VALUE_VI[get(item,'valueType')]}</Typography.Text> */}
              </Col>
              <Col flex={1}>
                
                <Typography.Text strong type="warning">- {formatter(get(item, 'discountAmount'))} {get(item,'valueType') === TYPE_VALUE.PERCENT ? `(${get(item, 'value')}%)` : ""}</Typography.Text>
              </Col>
            </Row>
          ))}
        </div>
      );
}
