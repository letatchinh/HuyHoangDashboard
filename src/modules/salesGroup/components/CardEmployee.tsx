import { Avatar, Badge, Col, Flex, Row, Tag, Typography } from "antd";
import React from "react";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import {
  EMPLOYEE_LEVEL_COLOR,
  EMPLOYEE_LEVEL_VI,
} from "~/modules/employee/constants";
type propsType = {
  employee?: any;
};
const CLONE_EMPLOYEE_LEVEL_VI: any = EMPLOYEE_LEVEL_VI;
const CLONE_EMPLOYEE_LEVEL_COLOR: any = EMPLOYEE_LEVEL_COLOR;

export default function CardEmployee({
  employee,
}: propsType): React.JSX.Element {
  const { avatar, fullName, employeeLevel, phoneNumber } = employee;

  return (
    <Row style={{ width: 300 }} gutter={8}>
      <Col span={8}>
        <AvatarShortOrName
          style={{ width: "100%", height: 100 }}
          shape="square"
          src={avatar}
          name={fullName}
        />
      </Col>

      <Col flex={1}>
        <Flex vertical>
          <Typography.Text strong>{fullName}</Typography.Text>
          <Tag style={{width : 'max-content'}} color={CLONE_EMPLOYEE_LEVEL_COLOR?.[employeeLevel]}>
            {CLONE_EMPLOYEE_LEVEL_VI?.[employeeLevel]}
          </Tag>
          <Typography.Text type="secondary">{phoneNumber}</Typography.Text>
        </Flex>
      </Col>
    </Row>
  );
}
