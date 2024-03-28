import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Popover, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { RULE_SALES_GROUP, SALES_GROUP_GEOGRAPHY } from "../constants";
import { MemberRulesInGroupType, TypeAreaType } from "../salesGroup.modal";
import AssignMember from "./AssignMember";
import AssignTeamLead from "./AssignTeamLead";
import CardEmployee from "./CardEmployee";
import ListMember from "./ListMember";
import PopoverCardEmployee from "./PopoverCardEmployee";
type propsType = {
  _id?: string;
  typeArea?: TypeAreaType;
  data: MemberRulesInGroupType[];
  child ? : any[]
};
export default function Member({ _id, data,typeArea,child }: propsType): React.JSX.Element {
  const teamLead = useMemo(
    () =>
      data?.find((member) => get(member, "rule") === RULE_SALES_GROUP.LEADER),
    [data]
  );
  const member = useMemo(
    () => data?.filter((m) => get(m, "rule") === RULE_SALES_GROUP.MEMBER),
    [data]
  );
  return (
    <Flex vertical gap={10}>
       <Flex align={"center"} gap={5}>
        Trưởng nhóm:{" "}
        {teamLead ? (
          <PopoverCardEmployee employee={get(teamLead, "employee", "")}>
        <Typography.Text style={{cursor : 'pointer'}} strong>
            {get(teamLead, "employee.fullName", "")}
          </Typography.Text>
          </PopoverCardEmployee>
        ) : (
          "(Chưa có)"
        )}{" "}
        <AssignTeamLead teamLead={teamLead} _id={_id} />
      </Flex> 
    {teamLead ?  <Flex align={"center"} gap={5} >
      <span style={{whiteSpace : 'nowrap'}}>Thành viên</span>:
        {member ? (
          <ListMember member={member}/>
        ) : (
          "(Chưa có)"
        )}
        <AssignMember member={member} _id={_id} />
      </Flex>  : <></>}
    </Flex>
  );
}
