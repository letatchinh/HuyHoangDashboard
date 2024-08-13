
import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Modal, Popconfirm, Tooltip } from "antd";
import { forIn, get, omit, trim } from "lodash";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { CheckPermission } from "~/utils/helpers";
import { STATUS_BILL, STATUS_BILL_VI } from "../../bill/constants";
import { ParamGetNextStatus } from "../bill.modal";
import NoteAction from "./NoteAction";

type propsType = {
  onChangeStatusBill: (p: any) => void;
  bill: any;
  isDisabledAll?: boolean;
  isSubmitLoading?: boolean;
  onOpenCancel: (p: any) => void;
  setAskAgain?: (p: any) => void;
  id?: string | null | undefined;
};
const CLONE_STATUS_BILL_VI: any = omit(STATUS_BILL_VI, ["READY","UNREADY", "REQUESTED","REJECT", 'RETURN', 'CUSTOMER_REJECT']);
const CLONE_STATUS_BILL_VI_REQUESTED: any = omit(STATUS_BILL_VI, ["READY","UNREADY","REJECT", 'RETURN', 'CUSTOMER_REJECT']);
const CLONE_STATUS_BILL: any = omit(STATUS_BILL, ["READY","UNREADY","REQUESTED","REJECT", 'RETURN', 'CUSTOMER_REJECT']);
const CLONE_STATUS_BILL_REQUESTED: any = omit(STATUS_BILL, ["READY","UNREADY","REJECT", 'RETURN', 'CUSTOMER_REJECT']);
export default function ConfirmStatusBill({
  onChangeStatusBill,
  bill,
  isDisabledAll,
  isSubmitLoading,
  onOpenCancel,
  id,
}: propsType): React.JSX.Element {
  const status = useMemo(() => get(bill, "status"), [bill]);
  const {pathname} = useLocation();
  const canUpdateBill = useMatchPolicy([CheckPermission(pathname), 'update']);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);
  const ref = useRef<any>();
  const [form] = Form.useForm();

  const getNextStatus = useCallback(
    ({ status, expirationDate, lotNumber }: ParamGetNextStatus) => {
      let nextStatus: any = null;
      let message;
      let isSame = false;
      forIn((status === 'REQUESTED' ? CLONE_STATUS_BILL_REQUESTED: CLONE_STATUS_BILL), (value, key) => {
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

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  const onOpenCancelBill = () => {
    setIsOpenCancel(true);
  };
  const onCloseCancelBill = () => {
    setIsOpenCancel(false);
  };
  return nextStatus && canUpdateBill ? (
        <Flex ref = {ref} gap={"small"} align="center" justify={"center"} className="confirm-status-bill" style={{width: '250px'}}>
              <Tooltip title={message}>
                <Button
                  icon={<ArrowUpOutlined />}
                  block
                  style={{
                    backgroundColor: "#F7F9F2",
                    width: '150px'
                  }}
                  disabled={isDisabledAll || !!message}
                  loading={isSubmitLoading}
                  onClick={onOpen}
                >
                  {(status === 'REQUESTED' ? CLONE_STATUS_BILL_VI_REQUESTED: CLONE_STATUS_BILL_VI)[nextStatus]}
                </Button>
              </Tooltip>
          {status === CLONE_STATUS_BILL.NEW && (
              <Button
                type="primary"
                block
                danger  
                style={{
                  backgroundColor: "rgb(201, 0, 0)",
                  width: '80px'
                }}
                loading={isSubmitLoading}
                onClick={() => {
                  onOpenCancelBill();
                }}
              >
                Huỷ đơn
              </Button>
      )}
      <Modal
        title={`Chuyển đổi trạng thái đơn hàng thành ${CLONE_STATUS_BILL_VI[nextStatus]}`}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        afterClose={()=> form.resetFields()}
      >
        <NoteAction
          onFinish={(value: any) => {
            onChangeStatusBill({
              nextStatus,
              bill,
              note: value,
            })
          }}
          onClose={onClose}
          form={form}
          loading={isSubmitLoading}
        />
      </Modal>
        <Modal
        title={`Huỷ đơn hàng`}
        open={isOpenCancel}
        onCancel={onCloseCancelBill}
        footer={null}
        afterClose={()=> form.resetFields()}
        >
          <NoteAction
          onFinish={(value: any) => {
            onChangeStatusBill({
              nextStatus: CLONE_STATUS_BILL.CANCELLED,
               bill,
               note: value,
            })
          }}
          onClose={onCloseCancelBill}
          form={form}
          loading={isSubmitLoading}
        />
      </Modal>
      </Flex>
  ) : (
    <></>
  );
}
