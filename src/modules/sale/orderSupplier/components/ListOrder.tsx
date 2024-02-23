import React, { useCallback, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";

import { Button, Modal, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link, useParams } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable } from "~/utils/helpers";
import { STATUS_ORDER_SUPPLIER_VI } from "../constants";
import {
  useGetOrderSupplier,
  useGetOrderSuppliers,
  useOrderSupplierPaging,
  useOrderSupplierQueryParams,
  useUpdateOrderSupplier,
  useUpdateOrderSupplierParams,
} from "../orderSupplier.hook";
import WithPermission from "~/components/common/WithPermission";
import { PlusCircleTwoTone } from "@ant-design/icons";
import policyModule from "policy";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { AlignType } from "rc-table/lib/interface";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import PaymentModule from "~/modules/paymentVoucher";

type propsType = {
  status?: string;
};
const CLONE_STATUS_ORDER_SUPPLIER_VI: any = STATUS_ORDER_SUPPLIER_VI;

export default function ListOrder({ status }: propsType): React.JSX.Element {
  const [query] = useOrderSupplierQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateOrderSupplierParams(query);
  const [orderSuppliers, isLoading] = useGetOrderSuppliers(query);

  const paging = useOrderSupplierPaging();
  const [open, setOpen] = useState(false);
  const [orderSelect, setOrderSelect] = useState<any>();
  const [supplierId, setSupplierId] = useState<string | null>("");
  const [debt, setDebt] = useState<number | null>();
  // const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_VOUCHER);

  const onOpenPayment = (item: any) => {
    setOpen(true);
    setSupplierId(item?.supplierId);
    setDebt(item?.paymentAmount);
    setOrderSelect(item);
  };

  const onClosePayment = () => {
    setOpen(false);
    setSupplierId(null);
    setOrderSelect(null);
  };

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={PATH_APP.orderSupplier.root + "/" + get(record, "_id")}
            >
              {codeSequence}
            </Link>
          );
        },
      },
      {
        title: "Tên nhà cung cấp",
        dataIndex: "supplier",
        key: "supplier",
        align: "center",
        render(supplier, record, index) {
          return <Typography.Text>{get(supplier, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Ngày tạo đơn",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render(createdAt, record, index) {
          return (
            <Typography.Text strong>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        render(status, record, index) {
          return (
            <Status
              status={status}
              statusVi={CLONE_STATUS_ORDER_SUPPLIER_VI[status]}
            />
          );
        },
      },
      {
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
        align: "center",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        align: "center",
      },
      {
        title: "Thành tiền",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        render(totalPrice, record, index) {
          return <Typography.Text>{formatter(totalPrice)}</Typography.Text>;
        },
      },
      {
        title: "Số tiền đã trả",
        dataIndex: "totalPair",
        key: "totalPair",
        align: "center",
        render(totalPair, record, index) {
          return <Typography.Text>{formatter(totalPair)}</Typography.Text>;
        },
      },
      {
        title: "Số tiền phải trả",
        dataIndex: "paymentAmount",
        key: "paymentAmount",
        align: "center",
        render(paymentAmount, record, index) {
          return <Typography.Text>{formatter(paymentAmount)}</Typography.Text>;
        },
      },

      {
        title: "Tạo phiếu",
        dataIndex: "_id",
        key: "_id",
        align: "center" as AlignType,
        render(value: any, rc: any) {
          return (
            <Space>
              <Button type="primary" onClick={() => onOpenPayment(rc)}>
                Phiếu chi
              </Button>
            </Space>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="bill-page">
      <Row align="middle" gutter={8}>
        <Space>
          <SelectSupplier
            onChange={(value) => onParamChange({ supplierIds: value })}
            mode="multiple"
          />
          <SearchAnt onParamChange={onParamChange} />
        </Space>
        <WithPermission permission={policyModule.POLICIES.WRITE_QUOTATION}>
          <Button
            style={{ marginLeft: "auto" }}
            onClick={() => window.open(PATH_APP.orderSupplier.create)}
            type="primary"
            icon={<PlusCircleTwoTone />}
          >
            Tạo đơn hàng
          </Button>
        </WithPermission>
      </Row>
      <TableAnt
        stickyTop
        columns={columns}
        dataSource={orderSuppliers}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size="small"
      />
      <Modal
        title="Phiếu chi"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <PaymentVoucherForm
          onClose={() => onClosePayment()}
          supplierId={supplierId}
          refCollection={REF_COLLECTION_UPPER.SUPPLIER}
          debt={debt}
          method={{
            data: orderSelect,
            type: "ORDER",
          }}
          dataAccountingDefault={[{
            creditAccount: 1111,
            amountOfMoney: debt || 0
          }]}
        />
      </Modal>
    </div>
  );
}
