import { Button } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import {
  STATUS_VOUCHERS_VI,
  WH_VOUCHER_STATUS,
} from "~/constants/defaultValue";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import ReceiptVoucherForm from "~/modules/receiptVoucher/components/ReceiptVoucherForm";

import StatusTag from "~/modules/supplier/components/Debt/StatusTag";
import { formatter } from "~/utils/helpers";
import { contextReport } from "../reportSalaryPartner.hook";
import { ItemVoucher } from "./Context";
const CLONE_STATUS_VI: any = STATUS_VOUCHERS_VI;

type propsType = {
  dataSource: ItemVoucher[];
};
export default function VoucherList({
  dataSource,
}: propsType): React.JSX.Element {
    const { mutate } = contextReport.useContextReportSalaryPartner;
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<any>();
  const [typeVoucher, setTypeVoucher] = useState<any>();
  const onOpen = useCallback((ID: any, typeV: any) => {
    setOpen(true);
    setId(ID);
    setTypeVoucher(typeV);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null);
  }, []);

  const columns: ColumnsType = [
    {
      title: "Mã phiếu",
      dataIndex: "codeSequence",
      key: "codeSequence",
      render: (codeSequence,record) => <Button onClick={() => onOpen(get(record,'_id'),get(record,'typeVoucher'))} type="link">{codeSequence}</Button>,
    },
    {
      title: "Mã phiếu",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (totalAmount) => formatter(totalAmount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <StatusTag statusVi={CLONE_STATUS_VI[status]} status={status} />
      ),
    },
  ];
  return (
    <>
      <TableAnt
        columns={columns}
        dataSource={dataSource}
        size="small"
        pagination={false}
      />
      <ModalAnt
        footer={null}
        title={`Phiếu chi`}
        open={open}
        onCancel={onClose}
        width={1366}
        destroyOnClose
      >
        {typeVoucher === "PT" ? (
          <PaymentVoucherForm
            id={id}
            onClose={() => {
                onClose();
                mutate();
            }}
            refCollection="partner"
          />
        ) : (
          <ReceiptVoucherForm
            id={id}
            onClose={() => {
                onClose();
                mutate();
            }}
            refCollection="partner"
          />
        )}
      </ModalAnt>
    </>
  );
}
