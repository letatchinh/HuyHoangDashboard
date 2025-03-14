import { Button, Col, Flex, Row } from "antd";
import React from "react";
import SearchTestList from "./SearchTestList";
import { PlusOutlined } from "@ant-design/icons";
type propsType = {};
export default function HeadList(props: propsType): React.JSX.Element {
  return (
    <Row style={{ width: "100%", marginBottom: 8 }}>
      <Flex justify="space-between" gap={10} style={{width:'100%'}}>
        <SearchTestList />
        <Col >
          <Button type="primary" icon={<PlusOutlined/>}>Thêm mới</Button>
        </Col>
      </Flex>
    </Row>
  );
}
