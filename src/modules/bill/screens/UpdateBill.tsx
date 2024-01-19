import {
  DownOutlined,
  LeftCircleTwoTone,
  LeftOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Dropdown,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import { MenuProps } from "antd/lib/index";
import dayjs from "dayjs";
import { get, omit } from "lodash";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Status from "~/components/common/Status/index";
import WhiteBox from "~/components/common/WhiteBox";
import { useGetBill } from "~/modules/bill/bill.hook";
import { PATH_APP } from "~/routes/allPath";
import { concatAddress, formatter } from "~/utils/helpers";
import ListBillItem from "../components/ListBillitem";
import StepStatus from "../components/StepStatus";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import useUpdateBillStore from "../storeContext/UpdateBillContext";
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
export default function UpdateBill(props: propsType): React.JSX.Element {
  const {bill} = useUpdateBillStore();
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

  const items: MenuProps["items"] = useMemo(() => [
    {
      key: "1",
      label: <a>Huỷ đơn hàng</a>,
      disabled : get(billItems,'')
    },
  ],[])

  
  return (
    <div className="bill-page-update">
      <Link className="link_" to={PATH_APP.bill.root}>
        <LeftOutlined /> Đơn hàng
      </Link>
      <div className="bill-page-update--infoBill">
        <Row justify={"space-between"} align="middle" gutter={24}>
          <Col lg={8} md={24} sm={24}>
            <Row justify={"space-between"} align='middle'>
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
          <Col lg={16} md={24} sm={24}>
            <StepStatus
              statuses={
                status !== STATUS_BILL.CANCELED
                  ? omit(STATUS_BILL, ["CANCELED"])
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
          <WhiteBox>
            <Space className="justify-content-between w-100">
              <h6>Thông tin đơn hàng</h6>
              <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
            </Space>
            <Divider />
            <Layout label={"Nhân viên tạo"}>{get(createBy,'fullName','')}</Layout>
            <Layout label={"Tổng số tiền"}>{formatter(totalPrice)}</Layout>
            <Layout label={"Đã trả"}>{formatter(pair)}</Layout>
            <Layout label={"Tổng số tiền còn lại"}>
              <Typography.Text strong>
                {formatter(totalPrice - pair)}
              </Typography.Text>
            </Layout>
          </WhiteBox>
        </Col>
      </Row>
      <div className="bill-page-update--infoBillItem">
            <WhiteBox>
              <h6>Thông tin sản phẩm</h6>
              <ListBillItem />
            </WhiteBox>
          </div>
    </div>
  );
}
