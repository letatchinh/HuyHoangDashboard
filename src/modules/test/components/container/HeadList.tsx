import { Button, Col, Flex, Row } from "antd";
import React from "react";
import SearchTestList from "./SearchTestList";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { PATH_TEST_CREATE } from "../../constants";
type propsType = {};
export default function HeadList(props: propsType): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <Row style={{ width: "100%", marginBottom: 8 }}>
      <Flex justify="space-between" gap={10} style={{width:'100%'}}>
        <SearchTestList />
        <Col >
          <Button type="primary" icon={<PlusOutlined/>} onClick={()=>navigate(PATH_TEST_CREATE)}>Thêm mới</Button>
        </Col>
      </Flex>
    </Row>
  );
}
