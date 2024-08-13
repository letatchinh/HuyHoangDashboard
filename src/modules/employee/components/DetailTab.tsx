import React from "react";
import { propsType } from "../employee.modal";
import { useGetEmployee } from "../employee.hook";
import { Col, Flex, Form, Row } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { concatAddress } from "~/utils/helpers";
import { AREA_VI } from "~/constants/defaultValue";
import { EMPLOYEE_LEVEL_VI } from "../constants";

export default function DetailTab(props: propsType): React.JSX.Element {
  const { employeeId } = props;
  const [info, isLoading] = useGetEmployee(employeeId);
  const [form] = Form.useForm();

  if (isLoading) {
    return (
      <Flex align={"center"} justify="center">
        <LoadingOutlined />
      </Flex>
    );
  }
  return (
    <div>
      <Form
        form={form}
        autoComplete="off"
        scrollToFirstError
        requiredMark={false}
        labelCol={{ sm: 24, md: 5, lg: 4 }}
        wrapperCol={{ sm: 24, md: 19, lg: 20 }}
      >
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Mã trình dược viên: </div>
              <div>{info?.employeeNumber}</div>
            </div>
            <hr style={{ color: "#0909091a" }} />
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Tên trình dược viên: </div>
              <div>{info?.fullName}</div>
            </div>
            <hr style={{ color: "#0909091a" }} />
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Giới tính: </div>
              <div>{info?.gender === "M" ? "Nam" : "Nữ"}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
          {/* <Col span={12}>
            <div className="content-field">
              <div className="label">Kênh bán hàng: </div>
              <div>{info?.salesChannel?.title}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col> */}
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Số điện thoại: </div>
              <div>{info?.phoneNumber}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Email: </div>
              <div>{info?.email}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
        </Row>

        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">CMND/CCCD: </div>
              <div>{info?.idNumber}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Nhóm TDV: </div>
              <div>{info?.groups}</div>
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Vị trí công việc: </div>
              {/* <div>{EMPLOYEE_LEVEL_VI[get(info, "employeeLevel", "")]}</div> */}
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Vùng nhận lương: </div>
              {/* <div>{AREA_VI[get(info, "baseSalary", "")]}</div> */}
            </div>
            <hr style={{ color: "#0000001a" }} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="content-field">
                <div className="labelFull">Địa chỉ: </div>
                <div>{concatAddress(info?.address)}</div>
              </div>
              <hr style={{ color: "#0000001a" }} />
            </div>
          </Col>
        </Row>
        <Row>
          <div className="labelFull">Nhà thuốc đảm nhiệm: </div>
        </Row>

        {info?.pharmacies?.map((item: any) => (
          <Row gutter={36}>
            <Col span={12}>
              <div className="content-field">
                <div className="label">Mã nhà thuốc: </div>
                <div>{item?.code}</div>
              </div>
              <hr style={{ color: "#0000001a" }} />
            </Col>
            <Col span={12}>
              <div className="content-field">
                <div className="label">Tên nhà thuốc: </div>
                <div>{item?.name}</div>
              </div>
              <hr style={{ color: "#0000001a" }} />
            </Col>
          </Row>
        ))}
      </Form>
    </div>
  );
}
