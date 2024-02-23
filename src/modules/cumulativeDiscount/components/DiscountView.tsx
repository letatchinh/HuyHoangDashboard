import { Col, Divider, Form, Radio, Row, Switch, Typography } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useMemo } from "react";
import { INFINITY, STATUS, STATUS_NAMES } from "~/constants/defaultValue";
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
  variants: any;
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
  variants,
  name,
  isSameTarget,
}: propsType): React.JSX.Element {
  
  const conditionText = useMemo(() => {
    const applyVariantId = variants?.find(
      (variant: any) => get(variant, "_id") === get(data, "applyVariantId")
    );
    let text = '';
    switch (get(data,'typeDiscount')) {
      case TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"]:
        if (get(data, "condition.lte")) {
           text = `Mỗi ${formatter(get(data, "condition.gte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          } `;
    
          text += `Tối đa ${formatter(get(data, "condition.lte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          }`;
        }else{
           text = `Mỗi ${formatter(get(data, "condition.gte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          } `;
        }
        break;
      case TYPE_DISCOUNT.LK:
        if (get(data, "condition.lte")) {
           text = `Từ ${formatter(get(data, "condition.gte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          } `;
    
          text += `đến ${formatter(get(data, "condition.lte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          }`;
        }else{
           text = `Lớn hơn ${formatter(get(data, "condition.gte"))} ${
            applyVariantId ? get(applyVariantId, "unit.name", "") : "Đ"
          } `;
        }
        break;
    
      default:
        break;
    }
  
    return text;
  }, [data, variants]);

  const valueText = useMemo(() => {
    let text = "";
    switch (get(data, "typeReward")) {
      case TYPE_REWARD.VALUE:
        text =
        formatter(get(data, "value", "")) +
        CLONE_TYPE_VALUE_VI[get(data, "valueType")];
        break;
        case TYPE_REWARD.PRODUCT:
          text = get(data, "itemReward.quantity") + " " + get(data, "itemReward.name");
          break;
        case TYPE_REWARD.BONUS:
          text = CLONE_TYPE_REWARD_VI[get(data, "typeReward")];
          break;
      default:
        break;
    }
    return text;
  }, [data]);
  console.log(data,'data');
  
  const timesRewardText = useMemo(() => {
    let text = "";
    if(get(data,'timesReward') === INFINITY){
      text += "Không giới hạn số lần/Đơn"
    }else{
      text += "Chỉ nhận tối đa "+get(data,'timesReward',1)+" lần/Đơn"
    }
    return text;
  },[data])

  const ApplyTimeText = useMemo(() => {
    let text = DiscountMethod.handleConvertTextViewApplyTimeSheet(get(data,'applyTimeSheet'),get(data,'typeDiscount'))
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
      <Layout label="Tần suất nhận" value={timesRewardText} />
      {[TYPE_DISCOUNT.LK,TYPE_DISCOUNT['DISCOUNT.SOFT.CONDITION']].includes(get(data, "typeDiscount")) && (
        <>
          <Layout label="Điều kiện nhận" value={conditionText} />
          {get(data, "typeDiscount") === TYPE_DISCOUNT.LK && <Layout label="Thời gian tích luỹ" value={CumulativeText} />}
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
          disabled={!isSameTarget}
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
