import { LeftOutlined, SendOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { get, omit } from "lodash";
import PolicyModule from "policy";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Status from "~/components/common/Status/index";
import WhiteBox from "~/components/common/WhiteBox";
import OrderItemModule from "~/modules/sale/orderSupplier/OrderItem"
import { PATH_APP } from "~/routes/allPath";
import { concatAddress, formatter } from "~/utils/helpers";
import { STATUS_ORDER_SUPPLIER, STATUS_ORDER_SUPPLIER_VI } from "../constants";
import StepStatus from "../components/StepStatus";
import { PayloadUpdateOrderSupplier } from "../orderSupplier.modal";
import useUpdateOrderSupplierStore from "../storeContext/UpdateOrderSupplierContext";
import { useResetOrderSupplier, useUpdateOrderSupplier } from "../orderSupplier.hook";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import VoucherInOrder from "~/modules/vouchers/components/VoucherInOrder";

type propsType = {};
const Layout = ({ label, children }: { label: any; children: any }) => (
  <Row justify={"space-between"} align="middle">
    <Col span={12}>
      <span>{label}: </span>
    </Col>

    <Col>
      <span>{children}</span>
    </Col>
  </Row>
);
type FormFieldBillType = {
  note: string;
};
const CLONE_STATUS_ORDER_SUPPLIER_VI: any = STATUS_ORDER_SUPPLIER_VI;
const CLONE_STATUS_ORDER_SUPPLIER: any = STATUS_ORDER_SUPPLIER;
export default function UpdateBill(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  useResetOrderSupplier();
  const { orderSupplier, isLoading, mutateOrderSupplier, onOpenForm } = useUpdateOrderSupplierStore();
  const {
    codeSequence,
    createdAt,
    status,
    historyStatus,
    orderSupplierItems,
    pair,
    totalPrice,
    totalPair,
    paymentAmount,
    // createBy,
    note,
    totalListPayment,
  } = orderSupplier || {};
  // const canUpdateOrderSupplier = PolicyModule.hook.useMatchPolicy(
  //   PolicyModule.POLICIES.UPDATE_BILL
  // );

  // const queryGetDebtPharmacy = useMemo(() => ({pharmacyId : get(orderSupplier,'pharmacyId')}),[orderSupplier]);
  // const [debt,isLoadingDebt] = useFetchState({api : PharmacyModule.api.getDebt,query : queryGetDebtPharmacy});
  const { id } = useParams();
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const onOpenCancel = useCallback(() => setOpenCancel(true), []);
  const [open, setOpen] = useState(false);
  const [openDetailVoucher, setOpenDetailVoucher] = useState(false);
  const [orderSelect, setOrderSelect] = useState<any>();
  const [supplierId, setSupplierId] = useState<string | null>("");
  const [debt, setDebt] = useState<number | null>();
  const onCloseCancel = useCallback(() => {
    setOpenCancel(false);
    setCancelNote("");
  }, []);

  const [isSubmitLoading, updateBill] = useUpdateOrderSupplier(() => {
    onCloseCancel();
    mutateOrderSupplier();
  });

  const onOpenPayment = (item: any) => {
    setOpen(true);
    setSupplierId(item?.supplierId);
    setDebt(item?.remaining);
    setOrderSelect(item);
  };
  const onClosePayment = () => {
    setOpen(false);
    setSupplierId(null);
    setOrderSelect(null);
  };

  const onOpenDetailVouchers = (item: any) => {
    setOpenDetailVoucher(true);
  };
  const onCloseDetailVouchers = () => {
    setOpenDetailVoucher(false);
  };


  const onCancelBill = () => {
    const payloadUpdate: PayloadUpdateOrderSupplier = {
      cancelNote,
      status: CLONE_STATUS_ORDER_SUPPLIER.CANCELLED,
      _id: get(orderSupplier, "_id"),
    };
    updateBill(payloadUpdate);
  };
  const onFinish = (values: FormFieldBillType) => {
    const payloadUpdate: PayloadUpdateOrderSupplier = {
      ...values,
      _id: get(orderSupplier, "_id"),
    };
    updateBill(payloadUpdate);
  };

  // useChangeDocumentTitle(codeSequence ? "Đơn hàng - " + codeSequence : 'Loading...',{dependency : [codeSequence]})
  useEffect(() => {
    form.setFieldsValue({ note });
  }, [note]);
  return (
    <div className="bill-page-update">
      <Form form={form} onFinish={onFinish}>
        {isLoading && <Spin fullscreen />}
        <Link className="link_" to={PATH_APP.orderSupplier.root}>
          <LeftOutlined /> Đơn hàng
        </Link>

        <div className="bill-page-update--infoBill">
          <Row justify={"space-between"} align="middle" gutter={24}>
            <Col lg={9} md={24} sm={24}>
              <Row align="middle" gutter={8} wrap={false}>
                <Col>
                  <h3 className="fw-6">{codeSequence}</h3>
                </Col>
                <Col>
                  <Typography.Text type="secondary">
                    {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </Col>
                <Col>
                  <Space>
                    <WithPermission permission={POLICIES.UPDATE_ORDERSUPPLIER}>
                    <Button
                      type="primary"
                      danger
                      onClick={onOpenCancel}
                      disabled={
                        orderSupplierItems?.some(
                          (item: any) =>
                            get(item, "status") !==
                            "NEW"
                        ) ||
                        status !== STATUS_ORDER_SUPPLIER.NEW
                      }
                    >
                      Huỷ đơn
                    </Button>
                    </WithPermission>
                  </Space>
                </Col>
              </Row>
            </Col>
            {/* step */}
            <Col lg={15} md={24} sm={24}>
              <StepStatus
                statuses={
                  status !== STATUS_ORDER_SUPPLIER.CANCELLED
                    ? omit(STATUS_ORDER_SUPPLIER, ["CANCELLED"])
                    : omit(STATUS_ORDER_SUPPLIER, [
                        STATUS_ORDER_SUPPLIER.COMPLETED,
                        STATUS_ORDER_SUPPLIER.PROCESSING,
                      ])
                }
                statusesVi={STATUS_ORDER_SUPPLIER_VI}
                currentStatus={status}
                historyStatus={historyStatus}
              />
            </Col>
          </Row>
        </div>
        <Row gutter={8}>
          {/* // Info Pharmacy  */}
          <Col lg={16} md={24} sm={24}>
            <div className="bill-page-update--infoPharmacy">
              <WhiteBox>
                <Row>
                  <Col>
                    <h6>Thông tin nhà cung cấp</h6>
                  </Col>
                  <WithPermission permission={POLICIES.READ_VOUCHER}>
                      <Col style={{ position: 'absolute', right: 0, top: 5 }}>
                      <Button type="link" onClick={onOpenDetailVouchers}>Xem chi tiết các phiếu</Button>
                      </Col>
                  </WithPermission>
                </Row>
                <Row justify={"space-between"}>
                  <Col>
                    <Space
                      className="bill-page-update--infoPharmacy__info"
                      align="center"
                    >
                      <Avatar />
                      <div>
                        <p className="bill-page-update--infoPharmacy__info__name">
                          {get(orderSupplier, "supplier.name", "")}
                        </p>
                        {/* <p className="bill-page-update--infoPharmacy__info__phone">
                          {get(orderSupplier, "pharmacy.phoneNumber", "")}
                        </p> */}
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    {/* <Typography.Text strong>Công nợ hiện tại : 0</Typography.Text> */}
                    {status !== STATUS_ORDER_SUPPLIER.CANCELLED && (
                      <WithPermission permission={POLICIES.WRITE_VOUCHERSUPPLIER}>
                        <Button
                        disabled={paymentAmount <= 0}
                        type="primary"
                        size="small"
                        onClick={()=>{onOpenPayment(orderSupplier)}}
                      >
                        Tạo phiếu chi
                      </Button>
                      </WithPermission>
                    )}
                  </Col>
                </Row>
                <Divider />
                <h6>Địa chỉ</h6>
                {concatAddress(get(orderSupplier, "supplier.address"))}
              </WhiteBox>
            </div>
          </Col>
          {/* Thông tin đơn hàng */}
          <Col lg={8} md={24} sm={24}>
            <div className="bill-page-update--infoBillRight">
              <WhiteBox>
                <Space className="justify-content-between w-100">
                  <h6>Thông tin đơn hàng</h6>
                  <Status
                    status={status}
                    statusVi={CLONE_STATUS_ORDER_SUPPLIER_VI[status]}
                  />
                </Space>
                <Divider />
                {/* <Layout label={"Nhân viên tạo"}>
                  {get(createBy, "fullName", "")}
                </Layout> */}
                <Layout label={"Tổng số tiền"}>{formatter(totalPrice || 0)}</Layout>
                <Layout label={"Đã trả trước"}>-{formatter(totalPair || 0)}</Layout>
                <Layout label={"Tổng số tiền còn lại"}>
                  <Typography.Text strong>
                    {formatter(paymentAmount || 0)}
                  </Typography.Text>
                </Layout>
                <Divider />
                <Typography.Text strong>Ghi chú</Typography.Text>
                <Form.Item<FormFieldBillType> name={"note"}>
                  <TextArea />
                </Form.Item>
                <WithPermission permission={POLICIES.UPDATE_ORDERSUPPLIER}>
                <Button
                  style={{ marginLeft: "auto", display: "block", marginTop: 5 }}
                  type="primary"
                  // onClick={() => form.submit()}
                  htmlType="submit"
                  icon={<SendOutlined />}
                  size="small"
                />
                </WithPermission>
              </WhiteBox>
            </div>
          </Col>
        </Row>
      </Form>
      <div className="bill-page-update--infoBillItem">
        <WhiteBox>
          <h6>Thông tin sản phẩm</h6>
          <OrderItemModule.components.ListOrderItem statusBill={status} />
        </WhiteBox>
      </div>
      <ModalAnt
        destroyOnClose
        onCancel={onCloseCancel}
        okText="Huỷ đơn"
        okType="danger"
        open={openCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={onCancelBill}
        confirmLoading={isSubmitLoading}
      >
        <h6 className="text-center">Xác nhận huỷ đơn</h6>
        <TextArea
          value={cancelNote}
          onChange={(e) => setCancelNote(e.target.value)}
          placeholder="Vui lòng nhập lý do huỷ đơn!"
        />
      </ModalAnt>
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
            data: orderSupplier,
            type: "ORDER",
          }}
          dataAccountingDefault={[{
            creditAccount: 1111,
            amountOfMoney: debt || 0
          }]}
          billId={id}
          mutateOrderSupplier = { mutateOrderSupplier}
        />
      </Modal>
      <Modal
        title="Danh sách phiếu thu - chi"
        open={openDetailVoucher}
        onCancel={onCloseDetailVouchers}
        onOk={onCloseDetailVouchers}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <VoucherInOrder
          billId = {id}
          defaultActiveTabKey="2"
        />
      </Modal>
    </div>
  );
}
