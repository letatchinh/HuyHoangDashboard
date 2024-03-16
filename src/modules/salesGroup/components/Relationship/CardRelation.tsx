import { Badge, Flex, Tag } from "antd";
import { get } from "lodash";
import React from "react";
import WhiteBox from "~/components/common/WhiteBox";
import Address from "../Address";
import PopoverCardEmployee from "../PopoverCardEmployee";
type propsType = {
  managementArea?: any[];
  leader?: any;
  member?: any;
  parentNear?: any;
};
export default function CardRelation({
  managementArea,
  leader,
  member,
  parentNear,
}: propsType): React.JSX.Element {
  return (
    <Flex align={"center"} vertical>
      <WhiteBox>
        <Address
          onlyShowLastPath={!!parentNear}
          managementArea={managementArea}
        />
        {leader && (
          <div>
            Quản lý:{" "}
            <PopoverCardEmployee employee={get(leader, "employee", "")}>
              {get(leader, "employee.fullName", "")}
            </PopoverCardEmployee>
          </div>
        )}
        {member && (
          <div>
            TDV:
            <PopoverCardEmployee employee={get(member, "employee", "")}>
              {get(member, "employee.fullName", "")}
            </PopoverCardEmployee>
          </div>
        )}
        {!leader && !member ? <Tag bordered={false} color={'error'}>Trống</Tag> : null}
      </WhiteBox>
    </Flex>
  );
}
