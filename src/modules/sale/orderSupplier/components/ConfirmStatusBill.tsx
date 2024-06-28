
import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Input, Popconfirm, Tooltip } from "antd";
import { forIn, get, omit, pick } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { CheckPermission } from "~/utils/helpers";
import {  STATUS_ORDER_SUPPLIER, STATUS_ORDER_SUPPLIER_VI } from "../constants";

type propsType = {
  onChangeStatusBill: (status: keyof typeof STATUS_ORDER_SUPPLIER, id: string | null | undefined , note: string) => void;
  bill: any;
  isDisabledAll?: boolean;
  isSubmitLoading?: boolean;
  onOpenCancel: (p: any) => void;
  id?: string | null;
};
const CLONE_STATUS_BILL: any = omit(STATUS_ORDER_SUPPLIER, ['REQUESTED', 'UNCREATED']);
const CLONE_STATUS_BILL_REQUEST: any = omit(STATUS_ORDER_SUPPLIER, ['UNCREATED']);
const CLONE_STATUS_BILL_VI: any = omit(STATUS_ORDER_SUPPLIER_VI, ['REQUESTED', 'UNCREATED']);
const CLONE_STATUS_BILL_VI_REQUEST: any = omit(STATUS_ORDER_SUPPLIER_VI, ['UNCREATED']);
export default function ConfirmStatusBill({
  onChangeStatusBill,
  bill,
  isDisabledAll,
  isSubmitLoading,
  onOpenCancel,
  id,
}: propsType): React.JSX.Element {
  const status = useMemo(() => get(bill, "status"), [bill]);
  const [note, setNote] = useState<string>("");
  const {pathname} = useLocation();
  const canUpdateBill = useMatchPolicy([CheckPermission(pathname), 'update']);
  const getNextStatus = useCallback(
    ({ status, expirationDate, lotNumber }: any) => {
      let nextStatus: any = null;
      let message;
      let isSame = false;
      forIn((status === 'REQUESTED' ? CLONE_STATUS_BILL_REQUEST : CLONE_STATUS_BILL), (value, key) => {
        if (value === CLONE_STATUS_BILL.CANCELLED) return;
        if (isDisabledAll) {
          return;
        }
        if (nextStatus) return;
        if (isSame) {
          nextStatus = value;
          return;
        }
        if (status === key) {
          isSame = true;
        }
      });
      return {
        nextStatus,
        message,
      };
    },
    [isDisabledAll, bill, id]
  );
  const { nextStatus, message } = useMemo(
    () =>
      getNextStatus({
        status,
        lotNumber: get(bill, "lotNumber"),
        expirationDate: get(bill, "expirationDate"),
      }),
    [bill, status]
  );

  useEffect(() => {
    setNote('')
  }, [id]);
  return nextStatus && canUpdateBill ? (
        <Flex gap={"small"} align="center" justify={"center"}>
            <Popconfirm
              title={
                "Chuyển đổi sang trạng thái " +
                CLONE_STATUS_BILL_VI[nextStatus]
              }
              description={
                <Input.TextArea
                  placeholder="Bắt buộc nhập ghi chú"
                  onChange={(e) => setNote(e.target.value)}
                />
              }
              okText="Ok"
              cancelText="Huỷ"
              onConfirm={() => {
                onChangeStatusBill(nextStatus,id, note);
              }}
            >
              <Tooltip title={message}>
                <Button
                  icon={<ArrowUpOutlined />}
                  block
                  style={{
                    backgroundColor: "#F7F9F2",
                  }}
                  // type="primary"
                  disabled={isDisabledAll || !!message}
                  loading={isSubmitLoading}
                >
                    {(status === 'REQUESTED' ? CLONE_STATUS_BILL_VI_REQUEST: CLONE_STATUS_BILL_VI)[nextStatus]}
                </Button>
              </Tooltip>
            </Popconfirm>
          {status === CLONE_STATUS_BILL.NEW && (
            <Popconfirm
              title={'Bạn có chắc chắn muốn huỷ đơn này?'}
              onConfirm={() => 
              onChangeStatusBill('CANCELLED',id, note)
              }
              description={
                <Input.TextArea
                  placeholder="Bắt buộc nhập ghi chú"
                  onChange={(e) => setNote(e.target.value)}
                  />
              }
            >
              <Button
                type="primary"
                block
                danger  
                style={{
                  backgroundColor: "rgb(201, 0, 0)",
                }}
                loading={isSubmitLoading}
              >
                Huỷ đơn
              </Button>
              </Popconfirm>
          )}
      </Flex>
  ) : (
    <></>
  );
}
