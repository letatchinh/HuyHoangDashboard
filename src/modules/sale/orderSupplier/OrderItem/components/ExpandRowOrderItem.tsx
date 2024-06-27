import { Divider, Statistic, Table, Typography } from "antd";
import { get, omit } from "lodash";
import React from "react";
import { formatter } from "~/utils/helpers";
import StepStatus from "../../components/StepStatus";
import { STATUS_ORDER_ITEM, STATUS_ORDER_ITEM_VI } from "../../constants";
import {
  TARGET_VI,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_VALUE,
} from "~/modules/cumulativeDiscount/constants";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
type propsType = {
  historyStatus: any;
  status: any;
  cumulativeDiscount: any;
  orderRef: any;
  unitPrice: number;
  quantity:number
};
const CLONE_TARGET_VI: any = TARGET_VI;
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
export default function ExpandRowOrderItem({
  historyStatus,
  status,
  cumulativeDiscount,
  orderRef,
  unitPrice,
  quantity
}: propsType): React.JSX.Element {
  return (
    <div>
      <StepStatus
        size="small"
        statuses={
          status !== STATUS_ORDER_ITEM.CANCELLED
            ? omit(STATUS_ORDER_ITEM, ["CANCELLED"])
            : omit(STATUS_ORDER_ITEM, [
                STATUS_ORDER_ITEM.NEW,
                STATUS_ORDER_ITEM.CONFIRM,
                STATUS_ORDER_ITEM.ORDERING,
                STATUS_ORDER_ITEM.PACKAGED,
                STATUS_ORDER_ITEM.RECEIVED,
                STATUS_ORDER_ITEM.COMPLETED,
              ])
        }
        statusesVi={STATUS_ORDER_ITEM_VI}
        currentStatus={status}
        historyStatus={historyStatus}
      />
      <Divider />
      <h5>Lịch sử khách hàng B2B đặt hàng</h5>
      <Table
        dataSource={orderRef}
        columns={[
          {
            title: "Mã đơn bán",
            dataIndex: "code",
            key: "code",
            render(record, index) {
              return (
                <Link
                  className="link_"
                  to={PATH_APP.bill.root + "?page=1&limit=10&keyword=" + record}
                  target="_blank"
                >
                  {record}
                </Link>
              );
            },
          },
          {
            title: "Tên khách hàng",
            dataIndex: "pharmacy",
            key: "pharmacy",
          },
          {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
          },
        ]}
      />
      <Divider />
      <h5>Chiết khấu</h5>
      <Table
        dataSource={cumulativeDiscount}
        columns={[
          {
            title: "Tên chiết khấu",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Loại chiết khấu",
            dataIndex: "typeDiscount",
            key: "typeDiscount",
            render(typeDiscount) {
              return <span>{CLONE_TYPE_DISCOUNT_VI[typeDiscount]}</span>;
            },
          },
          {
            title: "Chiết khấu của",
            dataIndex: "target",
            key: "target",
            render(target) {
              return <span>{CLONE_TARGET_VI[target]}</span>;
            },
          },
          {
            title: "Giá trị chiết khấu",
            dataIndex: "value",
            key: "value",
            align: "center",
            render(value, record) {
              return (
                <span>
                  {formatter(value)}
                  {get(record, "valueType") === TYPE_VALUE.PERCENT ? "%" : ""}
                </span>
              );
            },
          },
          {
            title: "Tổng giá trị chiết khấu",
            dataIndex: "discountAmount",
            key: "discountAmount",
            align: "center",
            render(discountAmount, rc) {
              const value :any = {
                get VALUE (){
                  return get(rc, "value")
                },
                get PERCENT (){
                  return (get(rc, "value")*unitPrice)/100
                },
              }
              let minStep = Math.min(...[quantity, get(rc, "timesReward")])
              return <Typography.Text strong>
                    {formatter(value[get(rc, "valueType")] * minStep)}
                  </Typography.Text>
              // return get(rc, "typeReward") === TYPE_REWARD.PRODUCT ? (
              //   <Typography.Text strong>
              //     {formatter(get(rc, "itemReward.quantityClampReward", 0))}{" "}
              //     {get(rc, "itemReward.name", "")}
              //   </Typography.Text>
              // ) : (
                
              // );
            },
          },
        ]}
      />
    </div>
  );
}
