import { Col, Input, Row } from 'antd';
import React from 'react';
type propsType = {

}
export default function SearchTestList(props:propsType) : React.JSX.Element {
    return (
        <Col
          sm={{ flex: 1 }}
          xl={{ span: 8 }}
          lg={{ span: 12 }}
          md={{ flex:1 }}
        >
          <Input.Search placeholder='Tìm kiếm' enterButton  autoFocus/>
        </Col>
    );
}