import { GiftTwoTone } from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import cumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { TYPE_REWARD } from "~/modules/cumulativeDiscount/constants";
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
const {TYPE_VALUE_VI,TYPE_DISCOUNT_VI,TARGET_VI,TYPE_VALUE,TYPE_DISCOUNT} = cumulativeDiscountModule.constants;
const CLONE_TYPE_VALUE_VI : any = TYPE_VALUE_VI;
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TARGET_VI: any = TARGET_VI;
const color = {
  [TYPE_DISCOUNT["DISCOUNT.CORE"]] : 'success',
  [TYPE_DISCOUNT["DISCOUNT.SOFT"]] : 'geekblue',
  [TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]] : 'purple',
  [TYPE_DISCOUNT.LK] : 'volcano',
  '' : 'error'
}
export default function ExpandRowDiscount({
  data,
}: propsType): React.JSX.Element {
    
    return (
        <div>
          {data?.map((item: typeCumulativeDiscount) => (
            <Row key={get(item, 'id')}>
              <Col span={12}>
                <Typography.Text strong> <Tag color={color[get(item,'typeDiscount','')]}>{CLONE_TYPE_DISCOUNT_VI[get(item,'typeDiscount','')]} - {CLONE_TARGET_VI?.[get(item,'target')]}</Tag> {get(item, 'name')}</Typography.Text>
              </Col>
              <Col span={6}>
              {/* <Typography.Text strong>{formatter(get(item, 'value')) + " " +CLONE_TYPE_VALUE_VI[get(item,'valueType')]}</Typography.Text> */}
              </Col>
              <Col flex={1}>
                {[TYPE_REWARD.VALUE,TYPE_REWARD.BONUS].includes(get(item,'typeReward')) &&   <Typography.Text>- {formatter(get(item, 'discountAmount'))} {get(item,'valueType') === TYPE_VALUE.PERCENT ? `(${get(item, 'value')}%)` : ""}</Typography.Text>}
                {[TYPE_REWARD.PRODUCT].includes(get(item,'typeReward')) &&   <Typography.Text >Tặng thêm: {formatter(get(item, 'itemReward.quantityClampReward'))} {get(item,'itemReward.name')}</Typography.Text>}
              
              </Col>
            </Row>
          ))}
        </div>
      );
}
