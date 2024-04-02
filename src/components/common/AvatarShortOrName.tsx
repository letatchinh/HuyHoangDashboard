import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/index';
import React from 'react';
import { getShortName } from '~/utils/helpers';
interface propsType  extends AvatarProps{
    name?: string,
}
export default function AvatarShortOrName({name,...props}:propsType) : React.JSX.Element {
    return (
        props?.src ? <Avatar {...props}  /> : <Avatar {...props}>{getShortName(name || "")}</Avatar>
    )
}