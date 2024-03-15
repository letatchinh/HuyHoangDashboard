import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Flex, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { RULE_SALES_GROUP, SALES_GROUP_GEOGRAPHY } from "../constants";
import { MemberRulesInGroupType } from "../salesGroup.modal";
import AssignMember from "./AssignMember";
import AssignTeamLead from "./AssignTeamLead";
type propsType = {
  _id?: string;
  typeArea?: any;
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
    () => data?.find((m) => get(m, "rule") === RULE_SALES_GROUP.MEMBER),
    [data]
  );
  return (
    <Flex vertical gap={10}>
      {typeArea !== SALES_GROUP_GEOGRAPHY.ZONE  ? <Flex align={"center"} gap={10}>
        Trưởng nhóm:{" "}
        {teamLead ? (
          <Typography.Text strong>
            {get(teamLead, "employee.fullName", "")}
          </Typography.Text>
        ) : (
          "(Chưa có)"
        )}{" "}
        <AssignTeamLead teamLead={teamLead} _id={_id} />
      </Flex> : <></>}
      {!child?.length ? <Flex align={"center"} gap={10}>
        Trình dược viên:{" "}
        {member ? (
          <Tooltip title={get(member, "employee.fullName", "")} placement="top">
            <AvatarShortOrName
              avatar={get(member, "employee.avatar")}
              name={get(member, "employee.fullName")}
            />
          </Tooltip>
        ) : (
          "(Chưa có)"
        )}
        <AssignMember member={member} _id={_id} />
      </Flex> : <></>}
    </Flex>
  );
}
