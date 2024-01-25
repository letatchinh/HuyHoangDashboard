import { InfoCircleTwoTone } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import React from 'react';
import { useMatchOrPolicy } from '~/modules/policy/policy.hook';
import { policyType } from '~/modules/policy/policy.modal';
type propsType = {
    children: React.JSX.Element,
    title : string,
    permissions : [string,policyType][],
}
export default function PermissionBadge({children,title,permissions}:propsType) : React.JSX.Element {
    const isMatchPolicy = useMatchOrPolicy(permissions)
    return (
        isMatchPolicy 
        ? children
        : <Tooltip title={title || "Bạn không có quyền"}>
            <Badge offset={[0,-6]} count={<InfoCircleTwoTone twoToneColor={'red'}/>}>
                {children}
            </Badge>
        </Tooltip>
    )
}