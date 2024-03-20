import { CopyOutlined, CopyrightCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button, Flex, Form, Row
} from "antd";
import { concat } from "lodash";
import React, { useMemo } from "react";
import UnitModule from '~/modules/productUnit';
import useNotificationStore from "~/store/NotificationContext";
import {
  TYPE_DISCOUNT, TYPE_REPEAT, TYPE_REWARD, TYPE_VALUE
} from "../constants";
import { TypePropsDiscountList } from "../cumulativeDiscount.modal";
import { DiscountFactory, validateDiscount } from "../cumulativeDiscount.service";
import DiscountItem from "./DiscountItem";
export default function DiscountList({
  loading,
  form,
  target,
  targetType,
  supplierId,
}: TypePropsDiscountList): React.JSX.Element {
  const {onNotify} = useNotificationStore();
  const defaultValueDiscount = useMemo(
    () => ({
      typeDiscount: TYPE_DISCOUNT["DISCOUNT.CORE"],
      valueType: TYPE_VALUE.PERCENT,
      typeReward: TYPE_REWARD.VALUE,
      target,
      targetType,
      timesReward : 1,
      typeRepeat : TYPE_REPEAT.noTime,
      editing : true
    }),
    [target, targetType]
  );

  const [units,isLoading] = UnitModule.hook.useGetListProductUnitAll();
  const onCopy = () => {
    const discountList = form.getFieldValue("cumulativeDiscount");
    const discountMethod = new DiscountFactory();
    const discountCopy = discountMethod.handleCopyDiscountList({
      discountList,
      targetTypeCopy: targetType,
      targetTypePaste: targetType === "pharmacy" ? "supplier" : "pharmacy",
    });
    form.setFieldsValue({
      cumulativeDiscount: concat(discountList, discountCopy),
    });
    onNotify?.success("Copy thành công", { placement: "topRight" });
    
  }
  return (
    <Form.List name={"cumulativeDiscount"}>
      {(fields, { add, remove }) => {
        const list = fields
        .filter(
          ({ name }) =>
            form.getFieldValue("cumulativeDiscount")[name].targetType ===
              targetType ||
            !form.getFieldValue("cumulativeDiscount")[name].targetType
        )
        return (
          <>
            {
              list.map(({ key, name, fieldKey, ...restField }: any, index) => (
                <DiscountItem
                  form={form}
                  index={index}
                  restField={restField}
                  key={key}
                  loading={loading}
                  name={name}
                  remove={remove}
                  units={units}
                  target={target}
                  targetType={targetType}
                  supplierId={supplierId}
                />
              ))}
            <Flex gap={10}>
            <Button
              type="primary"
              onClick={() => {
                if(list?.length){
                  validateDiscount({
                    form,
                    onFailed : () => onNotify?.error("Vui lòng điền đủ thông tin vào chiết khấu trước khi thêm"),
                    onSuccess : () => add(defaultValueDiscount)
                  })
                }else{
                  add(defaultValueDiscount)
                }
              }}
              icon={<PlusCircleOutlined />}
            >
              Thêm chiết khấu
            </Button>
            <Button
            onClick={onCopy}
            icon={<CopyOutlined />}
            >
              Sao chép toàn bộ chiết khấu sang chiết khấu {targetType === 'supplier' ? 'bán' : 'mua'} hàng
            </Button>
            </Flex>
            
          </>
        );
      }}
    </Form.List>
  );
}
