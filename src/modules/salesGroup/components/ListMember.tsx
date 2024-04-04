import { Avatar, Popover } from 'antd';
import { get } from 'lodash';
import React from 'react';
import AvatarShortOrName from '~/components/common/AvatarShortOrName';
import { MemberRulesInGroupType } from '../salesGroup.modal';
import CardEmployee from './CardEmployee';
type propsType = {
    member : MemberRulesInGroupType[]
}
export default function ListMember({member}:propsType) : React.JSX.Element {
    return (
        <Avatar.Group maxCount={8} shape="square">
        {member?.map((mem,index) =>   <Popover key={index} title={<CardEmployee employee={get(mem, "employee")}/>}>
          <AvatarShortOrName name={get(mem, "employee.fullName","")} src={get(mem, "employee.avatar","")}/>
        </Popover>)}
       </Avatar.Group>
    )
}