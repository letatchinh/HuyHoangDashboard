import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
type propsType = {
    title : string,
}
export default function FormUpdateHeader({title}:propsType) : React.JSX.Element {
    const navigate = useNavigate();

    return (
        <Flex className='form-update-header' justify={"space-between"}>
          <Flex gap={20}>
            <Button onClick={() => navigate(-1)}>
              <Flex justify={"center"} align="center">
                <ArrowLeftOutlined />
              </Flex>
            </Button>
            <h4>{title}</h4>
          </Flex>
          <Button
            style={{ paddingInline: 40 }}
            htmlType="submit"
            type="primary"
          >
            Lưu
          </Button>
        </Flex>
    )
}