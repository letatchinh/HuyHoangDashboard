import { GiftTwoTone } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
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
const CLONE_TYPE_VALUE_VI : any = TYPE_VALUE_VI;
export default function ExpandRowDiscount({
  data,
}: propsType): React.JSX.Element {
  console.log(data,'data');
  
    return (
        <div>
          {data?.map((item: typeCumulativeDiscount) => (
            <Row key={get(item, 'id')}>
              <Col span={12}>
                <Typography.Text><GiftTwoTone /> Chiết khấu {get(item, 'name')}</Typography.Text>
              </Col>
              <Col span={8}>
                {/* <Typography.Text strong>{formatter(get(item, 'value')) + " " +CLONE_TYPE_VALUE_VI[get(item,'valueType')]}</Typography.Text> */}
                <Typography.Text strong>{formatter(get(item, 'actualValue'))} Đ</Typography.Text>
              </Col>
            </Row>
          ))}
        </div>
      );
}
