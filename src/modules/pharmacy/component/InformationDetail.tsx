import React from "react";
import { propsType } from "../pharmacy.modal";
import { useGetPharmacyId } from "../pharmacy.hook";
import { Col, Form, Row } from "antd";
import { concatAddress } from "~/utils/helpers";

export default function InformationDetail(props: propsType) {
  const { pharmacyId } = props;
  const [info, isLoading] = useGetPharmacyId(pharmacyId);
  const [form] = Form.useForm();

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
            <div className="content-field" >
              <div className="label">Mã nhà thuốc: </div>
              <div>{info?.code}</div>
            </div>
            <hr style={{color: '#0909091a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Tên nhà thuốc: </div>
              <div>{info?.name}</div>
            </div>
            <hr style={{color: '#0909091a'}}/>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Tên người đại diện: </div>
              <div>{info?.infoPolicy?.fullName}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Số điện thoại: </div>
              <div>{info?.phoneNumber}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Email: </div>
              <div>{info?.infoPolicy?.email}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Trình dược viên: </div>
              <div>{info?.employee?.fullName}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="content-field">
                <div className="label">Địa chỉ: </div>
                <div>{concatAddress(info?.address)}</div>
              </div>
              <hr style={{color: '#0000001a'}}/>
            </div>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Loại nhà thuốc: </div>
              <div>{info?.customerGroup?.title}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Nhóm nhà thuốc: </div>
              <div>{info?.customer?.rateType} - {info?.customer?.title}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Kênh bán hàng: </div>
              <div>{info?.salesChannel?.title}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Tần suất viếng thăm: </div>
              <div>{info?.frequencyOfVisits}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Mã số thuế: </div>
              <div>{info?.tax}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
          <Col span={12}>
            <div className="content-field">
              <div className="label">Số hiệu GPHĐ: </div>
              <div>{info?.operationLicenseNumber}</div>
            </div>
            <hr style={{color: '#0000001a'}}/>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="content-field">
                <div className="label">Ghi chú: </div>
                <div>{info?.note}</div>
              </div>
              <hr style={{color: '#0000001a'}}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="content-field">
                <div className="label">Địa chỉ giao hàng: </div>
                <div>{concatAddress(info?.addressDelivery)}</div>
              </div>
              <hr style={{color: '#0000001a'}}/>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
