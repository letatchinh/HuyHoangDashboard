import { Col, Flex, Row } from "antd";
import React, { PropsWithChildren } from "react";
import BreacrumTest from "./BreacrumTest";
type propsType = {};
export default function HeaderDetail(
  props: PropsWithChildren<propsType>
): React.JSX.Element {
  return (
    <Row
      style={{
        width: "calc(100% + 20px)",
        backgroundColor: "white",
        marginInline: -10,
        paddingInline: 10,
        paddingBlock: 10,
        position:'sticky',
        top: -10,
        zIndex:100,
        boxShadow:'2px 2px 2px rgba(111, 111, 111, 0.53)'
      }}
    >
      <Flex justify="space-between" gap={10} style={{ width: "100%" }}>
        <Col>
          <BreacrumTest />
        </Col>
        <Col>{props.children}</Col>
      </Flex>
    </Row>
  );
}
