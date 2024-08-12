import { Col, DatePicker, Form, Row, TimePicker, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useGetProfile } from "~/modules/auth/auth.hook";
type propsType = {};
export default function InfoCreateBy(props: propsType): React.JSX.Element {
  const profile = useGetProfile();
  return (
    <Row justify={"space-between"}>
      <Col span={9}>
        <Typography.Text strong>
          Người tạo: {profile?.profile?.fullName}
        </Typography.Text>
      </Col>
      <Col span={14}>
        <Row justify="end">
          <Col style={{ borderBottom: "1px solid #dedede" }}>
            <Form.Item noStyle name="date" initialValue={dayjs()}>
              <DatePicker
                variant="borderless"
                allowClear={false}
                suffixIcon={null}
                style={{
                  paddingRight: 0,
                }}
                format={"DD-MM-YYYY"}
              />
            </Form.Item>
          </Col>
          <Col style={{ borderBottom: "1px solid #dedede" }}>
            <Form.Item noStyle name="time" initialValue={dayjs()}>
              <TimePicker
                variant="borderless"
                allowClear={false}
                suffixIcon={null}
                placeholder=""
                format={"HH:mm"}
                style={{
                  width: 45,
                  paddingRight: 0,
                  paddingLeft: 0,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
