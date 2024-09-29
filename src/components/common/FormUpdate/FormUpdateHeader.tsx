import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WhiteBox from '../WhiteBox';
type propsType = {
    title : string,
    id ? : any;
    loading? : boolean
}
export default function FormUpdateHeader({title,id,loading}:propsType) : React.JSX.Element {
    const navigate = useNavigate();

    return (
        <WhiteBox className='form-update-header'>
          <Flex  justify={"space-between"}>
          <Flex gap={20}>
            <Button onClick={() => navigate(-1)}>
              <Flex justify={"center"} align="center">
                <ArrowLeftOutlined />
              </Flex>
            </Button>
            <h4>{id ? "Cập nhật" : "Tạo mới"} {title}</h4>
          </Flex>
          <Button
            style={{ paddingInline: 40 }}
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Flex>
        </WhiteBox>
    )
}