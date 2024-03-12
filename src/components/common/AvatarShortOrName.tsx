import { Avatar } from 'antd';
import { AvatarProps } from 'antd/lib/index';
import React from 'react';
import { getShortName } from '~/utils/helpers';
interface propsType  extends AvatarProps{
    avatar?: string,
    name?: string,
}
export default function AvatarShortOrName({avatar,name,...props}:propsType) : React.JSX.Element {
    return (
        avatar ? <Avatar {...props} src={avatar} /> : <Avatar {...props}>{getShortName(name || "")}</Avatar>
    )
}