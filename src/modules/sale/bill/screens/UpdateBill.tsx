import { LeftOutlined, SendOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider, Form,
  Modal,
  Row,
  Space,
  Spin,
  Typography
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { get, omit } from "lodash";
import PolicyModule from "policy";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Status from "~/components/common/Status/index";
import WhiteBox from "~/components/common/WhiteBox";
import {
  useResetBillAction,
  useUpdateBill
} from "~/modules/sale/bill/bill.hook";
import BillItemModule from "~/modules/sale/billItem";
import { PATH_APP } from "~/routes/allPath";
import { CheckPermission, concatAddress, formatter } from "~/utils/helpers";
import { PayloadUpdateBill } from "../bill.modal";
import StepStatus from "../components/StepStatus";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import useUpdateBillStore from "../storeContext/UpdateBillContext";
import VoucherInOrder from "~/modules/vouchers/components/VoucherInOrder";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { REF_COLLECTION } from "~/constants/defaultValue";
import { ReportSalaryPartnerProvider } from "~/modules/reportSalaryPartner/ReportSalaryPartnerProvider";
import { METHOD_TYPE } from "~/modules/vouchers/constants";
type propsType = {};
const Layout = ({ label, children,strong }: { label: any; children: any,strong?:boolean }) => (
  <Row className="hover-dot-between" justify={"space-between"} align="middle">
    <Col span={12}>
      {strong ? <strong>{label}: </strong> : <span>{label}</span>}
    </Col>

    <Col>
      <span>{children}</span>
    </Col>
  </Row>
);
type FormFieldBillType = {
  note : string,
}
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
const CLONE_STATUS_BILL: any = STATUS_BILL;
export default function UpdateBill(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  useResetBillAction();
  const { bill, isLoading,mutateBill,onOpenForm, compareMoney,onOpenFormPayment ,totalRevenueInVouchers} = useUpdateBillStore();
  
  const {
    codeSequence,
    createdAt,
    status,
    historyStatus,
    billItems,
    pair,
    totalPrice,
    createBy,
    note,
    totalAmount,
    totalReceiptVoucherCompleted,
    totalReceiptAmount,
    remainAmount,
    totalFee,
    feeDetail,
    refCollection,
  } = bill || {};
  console.log(refCollection, refCollection)
  const { pathname } = useLocation();
  const keyPermission = useMemo(() => CheckPermission(pathname), [pathname]);
  const canUpdateBill = useMatchPolicy([keyPermission, 'update']);
  const canWriteBill = useMatchPolicy([keyPermission, 'write']);
  // const queryGetDebtPharmacy = useMemo(() => ({pharmacyId : get(bill,'pharmacyId')}),[bill]);
  // const [debt,isLoadingDebt] = useFetchState({api : PharmacyModule.api.getDebt,query : queryGetDebtPharmacy});
  const { id } = useParams();
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const onOpenCancel = useCallback(() => setOpenCancel(true), []);
  const [openDetailVoucher, setOpenDetailVoucher] = useState(false);
  const onOpenDetailVouchers = (item: any) => {
    setOpenDetailVoucher(true);
  };
  const onCloseDetailVouchers = () => {
    setOpenDetailVoucher(false);
  };

  const onCloseCancel = useCallback(() => {
    setOpenCancel(false);
    setCancelNote("");
  }, []);
  const [isSubmitLoading, updateBill] = useUpdateBill(() => {
    onCloseCancel();
    mutateBill()
  });
  const onCancelBill = () => {
    const payloadUpdate: PayloadUpdateBill = {
      cancelNote,
      status: CLONE_STATUS_BILL.CANCELLED,
      _id: get(bill, "_id"),
    };
    updateBill(payloadUpdate);
  };
  const onFinish = (values : FormFieldBillType) => {
    const payloadUpdate: PayloadUpdateBill = {
      ...values,
      _id: get(bill, "_id"),
    };
    updateBill(payloadUpdate);
  }
  // useChangeDocumentTitle(codeSequence ? "Đơn hàng - " + codeSequence : 'Loading...',{dependency : [codeSequence]})
  useEffect(() => {
    form.setFieldsValue({note})
  },[note]);
  return (
    <div className="bill-page-update">
      <Form
      form={form}
      onFinish={onFinish}
      >

      
      {isLoading && <Spin fullscreen />}
      <Link className="link_" to={PATH_APP.bill.root}>
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
                  <Button
                    type="primary"
                    danger
                    onClick={onOpenCancel}
                    disabled={
                      !canUpdateBill
                      || billItems?.some(
                        (item: any) =>
                          get(item, "status") !==
                          BillItemModule.constants.STATUS_BILLITEM.ORDERING
                      )
                      || status !== STATUS_BILL.NEW
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
                status !== STATUS_BILL.CANCELLED
                  ? omit(STATUS_BILL, ["CANCELLED"])
                  : omit(STATUS_BILL, [
                      STATUS_BILL.COMPLETED,
                      STATUS_BILL.PROCESSING,
                    ])
              }
              statusesVi={STATUS_BILL_VI}
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
                    <h6>Thông tin khách hàng</h6>
                  </Col>

                  <WithPermission permission={refCollection === 'partner' ? POLICIES.READ_VOUCHERBILLPARTNER : POLICIES.READ_VOUCHERPHARMACY}>
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
                    {/* <Avatar /> */}
                    <div>
                      <p className="bill-page-update--infoPharmacy__info__name">
                        {get(bill, "pharmacy.name", get(bill, "pharmacy.fullName", ""))}
                      </p>
                      <p className="bill-page-update--infoPharmacy__info__phone">
                        {get(bill, "pharmacy.phoneNumber", "")}
                      </p>
                    </div>
                  </Space>
                  </Col>
                  <Row gutter={10}>
                    <ReportSalaryPartnerProvider refCollection={refCollection} methodType={METHOD_TYPE.BILL as any}>
                    <WithPermission permission={refCollection === 'partner' ? POLICIES.WRITE_VOUCHERBILLPARTNER : POLICIES.WRITE_VOUCHERPHARMACY}>
                    <Col>
                    {status !== STATUS_BILL.CANCELLED && <Button disabled={remainAmount <= 0 || (totalRevenueInVouchers >= totalAmount)} type="primary" size="small" onClick={onOpenForm}>
                      Tạo phiếu thu
                    </Button>}
                    </Col>
                      
              
                      {compareMoney > 0 &&  
                      <Col>
                        <Button type="primary" size="small" onClick={onOpenFormPayment}>
                          Tạo phiếu chi
                        </Button>
                      </Col>
                        }
                      </WithPermission>
                    </ReportSalaryPartnerProvider>
                  </Row>
              </Row>
              <Divider />
              <h6>Địa chỉ giao</h6>
              {get(bill, "deliveryAddress",'')}
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
                  statusVi={CLONE_STATUS_BILL_VI[status]}
                />
              </Space>
              <Divider />
              <Layout label={"Nhân viên tạo"}>
                {get(createBy, "fullName", "")}
              </Layout>
              <Layout label={"Tổng số tiền"}>{formatter(get(bill,'totalAmountBill',0))}</Layout>
              <Layout label={"Chiết khấu"}>-{formatter(get(bill,'totalDiscountBill',0))}</Layout>
              <Layout label={"Tổng số tiền sau chiết khấu"}>{formatter(get(bill,'totalAfterDiscountBill',0))}</Layout>
              {/* <Layout label={"Đã trả trước"}>-{formatter(pair)}</Layout> */}
              <Layout label={"Phụ phí"}>{formatter(get(feeDetail,'SUB_FEE',0))}</Layout>
              <Layout label={"Vận chuyển"}>{formatter(get(feeDetail,'LOGISTIC',0))}</Layout>
              <Layout label={"Đã thanh toán"}>-{formatter(totalReceiptAmount)}</Layout>
              <Layout label={"Đã thanh toán và xác nhận"}>-{formatter(totalReceiptVoucherCompleted + (pair || 0))}</Layout>
              <Layout strong label={"Tổng số tiền còn lại"}>
                <Typography.Text strong>
                  {formatter(remainAmount)}
                </Typography.Text>
              </Layout>
              <Divider/> 
              <Typography.Text strong>Ghi chú</Typography.Text>
              <Form.Item<FormFieldBillType> name={'note'}>
              <TextArea />
              </Form.Item>
              <Button style={{marginLeft : 'auto',display : 'block',marginTop : 5}} type="primary" onClick={() => form.submit()} icon={<SendOutlined />} size='small'/>
            </WhiteBox>
          </div>
        </Col>
      </Row>
        </Form>
      <div className="bill-page-update--infoBillItem">
        <WhiteBox>
          <h6>Thông tin sản phẩm</h6>
          <BillItemModule.components.ListBillItem statusBill={status} />
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
        title="Danh sách phiếu thu - chi"
        open={openDetailVoucher}
        onCancel={onCloseDetailVouchers}
        onOk={onCloseDetailVouchers}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <VoucherInOrder
          billId={id}
          defaultActiveTabKey="1"
        />
      </Modal>
    </div>
  );
}
