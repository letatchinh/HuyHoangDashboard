import {
  DownOutlined, LeftOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Dropdown, Row,
  Space, Spin, Typography
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { MenuProps } from "antd/lib/index";
import dayjs from "dayjs";
import { get, omit } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Status from "~/components/common/Status/index";
import WhiteBox from "~/components/common/WhiteBox";
import { useResetBillAction, useUpdateBill } from "~/modules/sale/bill/bill.hook";
import { PATH_APP } from "~/routes/allPath";
import { concatAddress, formatter } from "~/utils/helpers";
import { PayloadUpdateBill } from "../bill.modal";
import StepStatus from "../components/StepStatus";
import BillItemModule from '~/modules/sale/billItem';
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import useUpdateBillStore from "../storeContext/UpdateBillContext";
import PolicyModule from 'policy';
type propsType = {};
const Layout = ({ label, children }: { label: any; children: any }) => (
  <Row justify={"space-between"} align="middle">
    <Col span={10}>
      <span>{label}: </span>
    </Col>

    <Col>
      <span>{children}</span>
    </Col>
  </Row>
);

const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
const CLONE_STATUS_BILL: any = STATUS_BILL;
export default function UpdateBill(props: propsType): React.JSX.Element {
  useResetBillAction();
  const { bill,isLoading } = useUpdateBillStore();
  const {
    codeSequence,
    createdAt,
    status,
    historyStatus,
    billItems,
    pair,
    totalPrice,
    createBy,
  } = bill || {};
  const canUpdateBill = PolicyModule.hook.useMatchPolicy(PolicyModule.POLICIES.UPDATE_BILL);
  const [openCancel, setOpenCancel] = useState(false);
  const [note, setNote] = useState("");
  const onOpenCancel = useCallback(() => setOpenCancel(true), []);
  const onCloseCancel = useCallback(() => {
    setOpenCancel(false);
    setNote("");
  }, []);
  const [isSubmitLoading,updateBill] = useUpdateBill(onCloseCancel);
  const onUpdateBill = () => {
    const payloadUpdate  : PayloadUpdateBill= {
      note,
      status : CLONE_STATUS_BILL.CANCELLED,
      _id : get(bill,'_id')
    };
    updateBill(payloadUpdate);
  }


  const items: MenuProps["items"] = useMemo(() => [
    {
      key: "1",
      onClick : () => onOpenCancel(),
      label: <span >Huỷ đơn</span>,
      disabled: !canUpdateBill || billItems?.some(
        (item: any) => get(item, "status") !== BillItemModule.constants.STATUS_BILLITEM.ORDERING
      ),
      
    },
  ],[onOpenCancel,billItems,canUpdateBill])

  return (
    <div className="bill-page-update">
      {isLoading && <Spin fullscreen/>}
      <Link className="link_" to={PATH_APP.bill.root}>
        <LeftOutlined /> Đơn hàng
      </Link>
      <div className="bill-page-update--infoBill">
        <Row justify={"space-between"} align="middle" gutter={24}>
          <Col lg={9} md={24} sm={24}>
            <Row  align="middle" gutter={8} wrap={false}>
              <Col>
                <h3 className="fw-6">{codeSequence}</h3>
              </Col>
              <Col>
                <Typography.Text type="secondary">
                  {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography.Text>
              </Col>
              <Col>
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items,
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      Thêm thao tác
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
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
              <h6>Thông tin khách hàng</h6>
              <Row justify={"space-between"}>
                <Col>
                  <Space
                    className="bill-page-update--infoPharmacy__info"
                    align="center"
                  >
                    <Avatar />
                    <div>
                      <p className="bill-page-update--infoPharmacy__info__name">
                        {get(bill, "pharmacy.name", "")}
                      </p>
                      <p className="bill-page-update--infoPharmacy__info__phone">
                        {get(bill, "pharmacy.phoneNumber", "")}
                      </p>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Typography.Text strong>Công nợ hiện tại : 0</Typography.Text>
                </Col>
              </Row>
              <Divider />
              <h6>Địa chỉ</h6>
              {concatAddress(get(bill, "pharmacy.address"))}
            </WhiteBox>
          </div>
        </Col>
        {/* // InfoBill */}
        <Col lg={8} md={24} sm={24}>
          <div className="bill-page-update--infoBillRight">
          <WhiteBox>
            <Space className="justify-content-between w-100">
              <h6>Thông tin đơn hàng</h6>
              <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
            </Space>
            <Divider />
            <Layout label={"Nhân viên tạo"}>
              {get(createBy, "fullName", "")}
            </Layout>
            <Layout label={"Tổng số tiền"}>{formatter(totalPrice)}</Layout>
            <Layout label={"Đã trả"}>{formatter(pair)}</Layout>
            <Layout label={"Tổng số tiền còn lại"}>
              <Typography.Text strong>
                {formatter(totalPrice - pair)}
              </Typography.Text>
            </Layout>
          </WhiteBox>
          </div>
        </Col>
      </Row>
      <div className="bill-page-update--infoBillItem">
        <WhiteBox>
          <h6>Thông tin sản phẩm</h6>
          <BillItemModule.components.ListBillItem statusBill={status}/>
        </WhiteBox>
      </div>
      <ModalAnt
        destroyOnClose
        onCancel={onCloseCancel}
        okText="Huỷ đơn"
        okType="danger"
        open={openCancel}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={onUpdateBill}
        confirmLoading={isSubmitLoading}
      >
        <h6 className="text-center">Xác nhận huỷ đơn</h6>
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Vui lòng nhập lý do huỷ đơn!"
        />
      </ModalAnt>
    </div>
  );
}
