import { Col, Divider, Form, Radio, Row, Switch, Typography } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useMemo } from "react";
import { STATUS, STATUS_NAMES } from "~/constants/defaultValue";
import { formatter } from "~/utils/helpers";
import {
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_REWARD_VI,
  TYPE_VALUE_VI,
} from "../constants";
import { DiscountFactory } from "../cumulativeDiscount.service";
type propsType = {
  data: any;
  units: any;
  name: any;
  isSameTarget: boolean;
};
const Layout = ({ label, value }: { label: string; value: any }) => (
  <Row>
    <Col span={3}>
    {label}: 
    </Col>
    <Col>
     <Typography.Text strong>{value}</Typography.Text>
    </Col>
  </Row>
);
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TYPE_VALUE_VI: any = TYPE_VALUE_VI;
const CLONE_TYPE_REWARD_VI: any = TYPE_REWARD_VI;

const DiscountMethod = new DiscountFactory();
export default function DiscountView({
  data,
  units,
  name,
  isSameTarget,
}: propsType): React.JSX.Element {
  console.log(data,'data');
  
  const conditionText = useMemo(() => {
    const applyVariantId = units?.find(
      (unit: any) => get(unit, "_id") === get(data, "applyVariantId")
    );
    let text = `Từ ${formatter(get(data, "condition.gte"))} ${
      applyVariantId ? get(applyVariantId, "name", "") : "Đ"
    } `;
    if (get(data, "condition.lte")) {
      text += `đến ${formatter(get(data, "condition.lte"))} ${
        applyVariantId ? get(applyVariantId, "name", "") : "Đ"
      }`;
    }
    return text;
  }, [data, units]);

  const valueText = useMemo(() => {
    let text = "";
    if (get(data, "typeReward") === TYPE_REWARD.VALUE) {
      text =
        formatter(get(data, "value", "")) +
        CLONE_TYPE_VALUE_VI[get(data, "valueType")];
    } else {
      text = CLONE_TYPE_REWARD_VI[get(data, "typeReward")];
    }
    return text;
  }, [data]);

  const ApplyTimeText = useMemo(() => {
    let text = DiscountMethod.handleConvertTextViewApplyTimeSheet(get(data,'applyTimeSheet'))
    return text;
  }, [data]);

  const CumulativeText = useMemo(() => {
    const text = DiscountMethod.handleConvertTextViewCumulativeTimeSheet(get(data,'cumulativeTimeSheet'));
    return text;
  }, [data]);

  return (
    <div>
      <Layout label="Tên chiết khấu" value={get(data, "name", "")} />
      <Layout
        label="Loại chiết khấu"
        value={CLONE_TYPE_DISCOUNT_VI[get(data, "typeDiscount", "")]}
      />
      <Layout label="Giá trị chiết khấu" value={valueText} />
      {get(data, "typeDiscount") === TYPE_DISCOUNT.LK && (
        <>
          <Layout label="Điều kiện nhận" value={conditionText} />
          <Layout label="Thời gian tích luỹ" value={CumulativeText} />
          <Layout label="Thời gian áp dụng" value={ApplyTimeText} />
        </>
      )}
      <Form.Item
        name={[name, "status"]}
        label="Trạng thái"
        labelCol={{ span: 3 }}
      >
        <Radio.Group
          size="small"
          options={[
            {
              label: STATUS_NAMES.ACTIVE,
              value: STATUS.ACTIVE,
            },
            {
              label: STATUS_NAMES.INACTIVE,
              value: STATUS.INACTIVE,
            },
          ]}
          optionType="button"
          buttonStyle="solid"
        />
      </Form.Item>
    </div>
  );
}
