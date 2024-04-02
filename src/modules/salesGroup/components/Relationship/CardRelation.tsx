import { Flex, Tag } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { EMPLOYEE_LEVEL, EMPLOYEE_LEVEL_COLOR } from "~/modules/employee/constants";
import Address from "../Address";
import ListMember from "../ListMember";
import PopoverCardEmployee from "../PopoverCardEmployee";
const CLONE_EMPLOYEE_LEVEL : any = EMPLOYEE_LEVEL;
const CLONE_EMPLOYEE_LEVEL_COLOR : any = EMPLOYEE_LEVEL_COLOR;
type propsType = {
  managementArea?: any[];
  leader?: any;
  member?: any;
  parentNear?: any;
  name?: any;
  typeArea?: any;
};

export default function CardRelation({
  managementArea,
  leader,
  member,
  parentNear,
  name,
  typeArea,
}: propsType): React.JSX.Element {
  const employeeLevelLeader = useMemo(() => get(leader, "employee.employeeLevel", ""),[leader])
  return (
      <Flex align={"center"} vertical >
      <WhiteBox>
        <Flex align={"center"} vertical>
        
        {leader && (
          <div>
            Quản lý:{" "}
            <PopoverCardEmployee employee={get(leader, "employee", "")}>
              <Tag color={CLONE_EMPLOYEE_LEVEL_COLOR[employeeLevelLeader]}>{CLONE_EMPLOYEE_LEVEL[employeeLevelLeader]}</Tag><span style={{cursor: 'default'}}>{get(leader, "employee.fullName", "")}</span>
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
