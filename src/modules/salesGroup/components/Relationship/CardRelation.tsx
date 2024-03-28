import { Badge, Flex, Tag, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import WhiteBox from "~/components/common/WhiteBox";
import {  SALES_GROUP_GEOGRAPHY_COLOR,SALES_GROUP_GEOGRAPHY_VI } from "../../constants";
import Address from "../Address";
import ListMember from "../ListMember";
import PopoverCardEmployee from "../PopoverCardEmployee";
type propsType = {
  managementArea?: any[];
  leader?: any;
  member?: any;
  parentNear?: any;
  name?: any;
  typeArea?: any;
};

const CLONE_SALES_GROUP_GEOGRAPHY_COLOR : any = SALES_GROUP_GEOGRAPHY_COLOR;
const CLONE_SALES_GROUP_GEOGRAPHY_VI : any = SALES_GROUP_GEOGRAPHY_VI;
export default function CardRelation({
  managementArea,
  leader,
  member,
  parentNear,
  name,
  typeArea,
}: propsType): React.JSX.Element {
  
  return (
  // <Tag style={{padding : 5}} color={CLONE_SALES_GROUP_GEOGRAPHY_COLOR[typeArea]}>
      <Flex align={"center"} vertical >
      <WhiteBox>
        <Flex align={"center"} vertical>
        {/* <Typography.Text strong><Tag color={CLONE_SALES_GROUP_GEOGRAPHY_COLOR[typeArea]}>{CLONE_SALES_GROUP_GEOGRAPHY_VI[typeArea]}</Tag>{name}</Typography.Text> */}
        
        {leader && (
          <div>
            Quản lý:{" "}
            <PopoverCardEmployee employee={get(leader, "employee", "")}>
              <span style={{cursor: 'default'}}>{get(leader, "employee.fullName", "")}</span>
            </PopoverCardEmployee>
          </div>
        )}
          <Flex align={'center'} gap={5}>
            Thành viên:{" "}
            {/* <PopoverCardEmployee employee={get(member, "employee", "")}>
              <span style={{cursor: 'default'}}>{get(member, "employee.fullName", "")}</span>
            </PopoverCardEmployee> */}
            {member?.length ? <ListMember member={member}/> : "Trống"}
          </Flex>
        {!leader && !member ? <Tag bordered={false} color={'error'}>Trống</Tag> : null}
        <Address
          onlyShowLastPath={!!parentNear}
          managementArea={managementArea}
          bordered={true}
        />
        </Flex>
      </WhiteBox>
      
    </Flex>
  // </Tag>
  );
}
