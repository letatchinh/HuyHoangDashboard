import { LeftOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_TEST_LIST } from '../constants';
type propsType = {

}
export default function BreacrumTest(props:propsType) : React.JSX.Element {
    const navigation = useNavigate()
    return (
        <Flex gap={6} align='center'>
            <Button onClick={()=>{
                navigation(PATH_TEST_LIST)
            }} icon ={<LeftOutlined />}/>
            <strong style={{fontSize:18}}>Danh sách bộ đề</strong>
        </Flex>
    )
}