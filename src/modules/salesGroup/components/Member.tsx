import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, ConfigProvider, Flex, Modal, Popover, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { RULE_SALES_GROUP, SALES_GROUP_GEOGRAPHY } from "../constants";
import { MemberRulesInGroupType, TypeAreaType } from "../salesGroup.modal";
import AssignMember from "./AssignMember";
import AssignTeamLead from "./AssignTeamLead";
import CardEmployee from "./CardEmployee";
import ListMember from "./ListMember";
import PopoverCardEmployee from "./PopoverCardEmployee";
import ListMemberModal from "./ListMemberModal";
import useSalesGroupStore from "../salesGroupContext";
import {GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI } from "~/modules/reportSalary/benefitConfiguration/constants";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
type propsType = {
  _id?: string;
  typeArea?: TypeAreaType;
  data: MemberRulesInGroupType[];
  child ? : any[]
};
const CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI: any = EMPLOYEE_LEVEL_VI;

export default function Member({ _id, data, typeArea, child }: propsType): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { canUpdate } = useSalesGroupStore();
  const teamLead = useMemo(
    () =>
      data?.find((member) => get(member, "rule") === RULE_SALES_GROUP.LEADER),
    [data]
    );
    const member = useMemo(
      () => data?.filter((m) => get(m, "rule") === RULE_SALES_GROUP.MEMBER),
      [data]
    );

  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Flex vertical gap={10}>
        <Flex align={"center"} gap={5}>
          {teamLead ? (
            <>
              {/* {teamLead?.employee?.employeeLevel === 'ASM' || teamLead?.employee?.employeeLevel === 'LEADER'
                ?  <Typography.Text strong>{CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI[get(teamLead, "employee.employeeLevel", "")]}:</Typography.Text>
                : <></>
              } */}
              <PopoverCardEmployee employee={get(teamLead, "employee", "")}>
                <ConfigProvider
                  theme={{
                    token: {
                      fontSizeHeading5: 14
                    },
                  }}
                >
                  <Typography.Title style={{cursor : 'pointer', width: '176px'}} ellipsis level={5}>
                    {get(teamLead, "employee.fullName", "")}
                  </Typography.Title>
                </ConfigProvider>
            </PopoverCardEmployee>
            </>
          ) : (
            <span style={{ color: "red" }}>(Chưa có)</span>
          )}{" "}
          {canUpdate && <AssignTeamLead teamLead={teamLead} _id={_id} />}
        </Flex> 
      {/* {teamLead ?  <Flex align={"center"} gap={5} >
        <Button type="link" onClick={onOpen} style={{whiteSpace : 'nowrap'}}>Thành viên</Button>:
          {member ? (
            <ListMember member={member}/>
          ) : (
            "(Chưa có)"
          )}
          <AssignMember member={member} _id={_id} />
        </Flex>  : <></>} */}
      </Flex>
      <Modal
        title={`Danh sách thành viên`}
        open={isOpen}
        onCancel={onClose}
        footer={<h6>Tổng số thành viên: {member?.length || 0}</h6>}
        width={600}
      >
        <ListMemberModal member={member}/>
      </Modal>
    </>
  );
}
