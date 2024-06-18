import { DownOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Flex, Typography } from 'antd';
import React from 'react';
import { COLOR, STATUS, STATUS_COLOR, STATUS_NAMES } from '~/constants/defaultValue';
type propsType = {
    onParamChange : any,
    value : any
};
const CLONE_STATUS_NAMES : any = STATUS_NAMES;
const CLONE_STATUS_COLOR : any = STATUS_COLOR;
export default function FIlterStatus({onParamChange,value}:propsType) : React.JSX.Element {
    return (
        <Dropdown 
        trigger={['click']}
        menu={{items : [
            {
              label : STATUS_NAMES.ACTIVE,
              key : STATUS.ACTIVE,
              onClick : () => onParamChange({status : STATUS.ACTIVE})
            },
            {
              label : STATUS_NAMES.INACTIVE,
              key : STATUS.INACTIVE,
              onClick : () => onParamChange({status : STATUS.INACTIVE})
            },
            {
              label : "Tất cả",
              key : 'all',
              onClick : () => onParamChange({status : null})
            },
          ]}}>
            <Button type='text'>
            <Flex gap={5} align={'center'}>
            <Badge status={CLONE_STATUS_COLOR[value]}/>
            <Typography.Text strong>{value ? CLONE_STATUS_NAMES[value] : "Tất cả"}</Typography.Text>
            <DownOutlined style={{color : COLOR.primary}}/>
            </Flex>
            </Button>
          </Dropdown>
    )
}