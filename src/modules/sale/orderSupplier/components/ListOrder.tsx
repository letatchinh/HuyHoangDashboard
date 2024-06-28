import React, { useCallback, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";

import { Button, Checkbox, Col, Flex, Modal, Radio, Row, Space, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get, trim } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable } from "~/utils/helpers";
import { STATUS_ORDER_SUPPLIER, STATUS_ORDER_SUPPLIER_VI } from "../constants";
import {
  useGetOrderSuppliers,
  useOrderSupplierPaging,
  useOrderSupplierQueryParams,
  useUpdateOrderSupplierParams,
  useUpdateStatusOrderSupplier,
} from "../orderSupplier.hook";
import WithPermission from "~/components/common/WithPermission";
import { PlusCircleTwoTone } from "@ant-design/icons";
import policyModule from "policy";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { AlignType } from "rc-table/lib/interface";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import useCheckBoxExport from "~/modules/export/export.hook";
import ExportExcelButton from "~/modules/export/component";
import { RadioChangeEvent } from "antd/lib/index";
import ConfigTable from "~/components/common/ConfigTable";
import DateTimeTable from "~/components/common/DateTimeTable";
import POLICIES from "~/modules/policy/policy.auth";
import ToolTipBadge from "~/components/common/ToolTipBadge";
import ConfirmStatusBill from "./ConfirmStatusBill";
import useNotificationStore from "~/store/NotificationContext";

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
  const canWriteVoucher = useMatchPolicy(policyModule.POLICIES.WRITE_VOUCHERSUPPLIER);
  const canDownload = useMatchPolicy(policyModule.POLICIES.DOWNLOAD_ORDERSUPPLIER);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const isHaveAdminBillPermission = useMatchPolicy(POLICIES.UPDATE_BILLSTATUS);
  const [, setBillItemIdCancel] = useState<any>();
  const [isSubmitLoading, updateStatusOrder] = useUpdateStatusOrderSupplier();
  const { onNotify } = useNotificationStore();
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
  const onChangeCreateBy = ({ target: { value } } : RadioChangeEvent) => {
    onParamChange({
      createBy : value,
    })
  };

  const onOpenCancel = useCallback((id:any) => {
    if(id){
      setBillItemIdCancel(id);
    }
  }, []);
  const isDisabledAll = (status: keyof typeof STATUS_ORDER_SUPPLIER) => {
    return status === STATUS_ORDER_SUPPLIER.CANCELLED
  };
  
  const onChangeStatusBill = (status: keyof typeof STATUS_ORDER_SUPPLIER, id: string | null | undefined, note: string) => {
    try {
      if (trim(note) === "" || null || undefined) {
        return onNotify?.error('Vui lòng nhập ghi chú!');
      };
      updateStatusOrder({ id, status,note });
    } catch (error) {
      console.log(error)
    }
  };

  const columns: ColumnsType = [
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
        width: 180,
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
            <Flex vertical align={'center'}>
              {get(record,'createAuto') && <Tag color={'blue'}>Hệ thống tạo</Tag>}
              {/* <Typography.Text strong>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text> */}
              <DateTimeTable data={createdAt}/>
            </Flex>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 250,
        render(status: keyof typeof STATUS_ORDER_SUPPLIER, record, index) {
          return (
              <div className="d-flex flex-column align-items-center">
              <ToolTipBadge title={status === STATUS_ORDER_SUPPLIER.CANCELLED && get(record, 'note', '')}>
              <Status
                status={status}
                statusVi={STATUS_ORDER_SUPPLIER_VI[status]}
              />
              </ToolTipBadge>
              <WithPermission permission={POLICIES.UPDATE_ORDERSUPPLIERSTATUS}>
              <ConfirmStatusBill
                bill={record}
                onChangeStatusBill={onChangeStatusBill}
                onOpenCancel={onOpenCancel}
                isDisabledAll={isDisabledAll(status)}
                isSubmitLoading={isSubmitLoading}
                id={get(record, '_id')} />
                </WithPermission>
                </div>
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
      ...(canDownload ? [
        {
          title: 'Lựa chọn',
          key: '_id',
          width: 80,
          align: 'center' as any,
          render: (item: any, record: any) =>
          {
            const id = record._id;
            return (
              <Checkbox
                checked= {arrCheckBox.includes(id)}
                onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
          />)}
        },
      ]: []
    ) 
    ];

  if(canWriteVoucher){
    columns.push({
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
    },)
  }

  const options : any = [
    {
      label : 'Tất cả',
      value : null,
    },
    {
      label : 'Tự động',
      value : '1',
    },
    {
      label : 'Thủ công',
      value : '0',
    },
  ]
  return (
    // <div className="bill-page">
    <>
      <Row align="middle" gutter={8}>
        <Col flex={1}>
        <Space>
          <SelectSupplier
            onChange={(value) => onParamChange({ supplierIds: value })}
            mode="multiple"
          />
          <SearchAnt value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange} />
        </Space>
        </Col>
        <Col span={8}>
          <Row align={"middle"} justify={"end"}>
            <Col>
              <WithPermission permission={policyModule.POLICIES.DOWNLOAD_ORDERSUPPLIER}>
                  <ExportExcelButton
                        api='order-supplier'
                        exportOption = 'orderSupplier'
                        query={query}
                        fileName='Danh sách đơn hàng nhà cung cấp'
                        ids={arrCheckBox}
                      />
              </WithPermission>
              
            </Col>
            <Col>
              <WithPermission permission={policyModule.POLICIES.WRITE_ORDERSUPPLIER}>
                <Button
                  style={{ marginLeft: "auto" }}
                  onClick={() => window.open(PATH_APP.orderSupplier.create)}
                  type="primary"
                  icon={<PlusCircleTwoTone />}
                >
                  Tạo đơn hàng
                </Button>
              </WithPermission>
            </Col>
          </Row>
        </Col>
      </Row>
      <Flex align={'center'} gap={10}>
      <span>Hình thức tạo: </span>
      <Radio.Group
          options={options}
        onChange={onChangeCreateBy}
        value={query?.createBy}
        optionType="button"
        buttonStyle="solid"
      />
      </Flex>
      <ConfigTable>
        <TableAnt
          // className="table-striped-rows-custom"
          bordered
          stickyTop
          columns={columns}
          dataSource={orderSuppliers}
          loading={isLoading}
          pagination={pagingTable(paging, onParamChange)}
          size="small"
          scroll={{ x: 1500 }} 
        />
      </ConfigTable>
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
    </>
    // </div>
  );
}
