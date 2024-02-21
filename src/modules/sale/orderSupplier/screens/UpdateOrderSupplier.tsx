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
import { Link } from "react-router-dom";
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
    totalAmount,
    // createBy,
    note,
  } = orderSupplier || {};
  const canUpdateOrderSupplier = PolicyModule.hook.useMatchPolicy(
    PolicyModule.POLICIES.UPDATE_BILL
  );

  // const queryGetDebtPharmacy = useMemo(() => ({pharmacyId : get(orderSupplier,'pharmacyId')}),[orderSupplier]);
  // const [debt,isLoadingDebt] = useFetchState({api : PharmacyModule.api.getDebt,query : queryGetDebtPharmacy});

  const [openCancel, setOpenCancel] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const onOpenCancel = useCallback(() => setOpenCancel(true), []);
  const [open, setOpen] = useState(false);
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
    setDebt(item?.paymentAmount);
    setOrderSelect(item);
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
    <div className="orderSupplier-page-update">
      <Form form={form} onFinish={onFinish}>
        {isLoading && <Spin fullscreen />}
        <Link className="link_" to={PATH_APP.orderSupplier.root}>
          <LeftOutlined /> Đơn hàng
        </Link>

        <div className="orderSupplier-page-update--infoBill">
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
                    <Button
                      type="primary"
                      danger
                      onClick={onOpenCancel}
                      disabled={
                        !canUpdateOrderSupplier ||
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
            <div className="orderSupplier-page-update--infoPharmacy">
              <WhiteBox>
                <h6>Thông tin nhà cung cấp</h6>
                <Row justify={"space-between"}>
                  <Col>
                    <Space
                      className="orderSupplier-page-update--infoPharmacy__info"
                      align="center"
                    >
                      <Avatar />
                      <div>
                        <p className="orderSupplier-page-update--infoPharmacy__info__name">
                          {get(orderSupplier, "supplier.name", "")}
                        </p>
                        {/* <p className="orderSupplier-page-update--infoPharmacy__info__phone">
                          {get(orderSupplier, "pharmacy.phoneNumber", "")}
                        </p> */}
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    {/* <Typography.Text strong>Công nợ hiện tại : 0</Typography.Text> */}
                    {status !== STATUS_ORDER_SUPPLIER.CANCELLED && (
                      <Button
                        disabled={totalAmount <= 0}
                        type="primary"
                        size="small"
                        onClick={()=>{onOpenPayment(orderSupplier)}}
                      >
                        Tạo phiếu chi
                      </Button>
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
            <div className="orderSupplier-page-update--infoBillRight">
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
                <Layout label={"Tổng số tiền"}>{formatter(totalPrice)}</Layout>
                <Layout label={"Đã trả trước"}>-{formatter(totalPair)}</Layout>
                <Layout label={"Tổng số tiền còn lại"}>
                  <Typography.Text strong>
                    {formatter(totalAmount)}
                  </Typography.Text>
                </Layout>
                <Divider />
                <Typography.Text strong>Ghi chú</Typography.Text>
                <Form.Item<FormFieldBillType> name={"note"}>
                  <TextArea />
                </Form.Item>
                <Button
                  style={{ marginLeft: "auto", display: "block", marginTop: 5 }}
                  type="primary"
                  onClick={() => form.submit()}
                  icon={<SendOutlined />}
                  size="small"
                />
              </WhiteBox>
            </div>
          </Col>
        </Row>
      </Form>
      <div className="orderSupplier-page-update--infoBillItem">
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
        {/* <PaymentVoucherForm
          onClose={() => onClosePayment()}
          supplierId={supplierId}
          refCollection={REF_COLLECTION_UPPER.SUPPLIER}
          debt={debt}
          method={{
            data: orderSelect,
            type: "ORDER",
          }}
        /> */}
      </Modal>
    </div>
  );
}
