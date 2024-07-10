import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Popconfirm, Popover, Row, Tag, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { formatter } from "~/utils/helpers";
import { DiscountOtherType } from "../bill.modal";
import DiscountOtherForm from "./DiscountOtherForm";
import useCreateBillStore from "../storeContext/CreateBillContext";
type propsType = {
  onAdd: (p: any) => void;
  onUpdate: (p: any, index: number) => void;
  onRemove: (index: number) => void;
  dataSource: DiscountOtherType[];
  totalDiscountOther: number;
  productId : string
};
export default function DiscountOther({
  onAdd,
  onUpdate,
  onRemove,
  dataSource,
  totalDiscountOther,
  productId,
}: propsType): React.JSX.Element {
  const {onOpenCouponBillItem} = useCreateBillStore();
  return (
    <div>
      <Popover
        trigger={"click"}
        content={<DiscountOtherForm onAdd={onAdd} onUpdate={onUpdate} />}
      >
        <Button size="small" className="mb-1" icon={<PlusOutlined />} type="primary" ghost>
          Thêm Chiết khấu
        </Button>
      </Popover>
        <Button onClick={() => onOpenCouponBillItem(productId)} size="small" className="mb-1" icon={<PlusOutlined />} type="primary" ghost>
          Thêm mã giảm giá
        </Button>
      {dataSource?.map((item: DiscountOtherType, index: number) => (
        <Row align={"middle"} key={index}>
          <Col span={12}>
            <Typography.Text strong>
              {" "}
              <Tag color={"cyan"}>Chiết khấu thêm</Tag>
            </Typography.Text>
            <Typography.Text strong>{get(item, "name", "")}</Typography.Text>
          </Col>
          <Col span={6}>
            {/* <Typography.Text strong>{formatter(get(item,'value',0))}</Typography.Text> */}
          </Col>
          <Col span={3}>
            <Typography.Text strong>
              {formatter(
                totalDiscountOther
              )}
              {item?.typeDiscount === "PERCENT" && ` (${item?.value}%)`}
            </Typography.Text>
          </Col>
          <Col flex={1}>
            <Flex>
              <Popover
                trigger={"click"}
                content={
                  <DiscountOtherForm
                    onAdd={onAdd}
                    onUpdate={onUpdate}
                    index={index}
                    initData={item}
                  />
                }
              >
                <Button type="text">
                  <EditOutlined />
                </Button>
              </Popover>

              <Popconfirm title="Xác nhận gỡ" onConfirm={() => onRemove(index)}>
              <Button type="text">
                <DeleteOutlined />
              </Button>
              </Popconfirm>
            </Flex>
          </Col>
        </Row>
      ))}
    </div>
  );
}
