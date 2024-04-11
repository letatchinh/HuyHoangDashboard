import { DownOutlined } from "@ant-design/icons";
import { Row, Tree, Col, Button, Flex, Space, Select, Form, Modal } from "antd";
import { get, omit, update } from "lodash";
import React, { ReactNode, useMemo, useState } from "react";
import useSalesGroupStore from "../salesGroupContext";
import ModalAnt from "~/components/Antd/ModalAnt";
import TargetSalesGroup from "./TargetSalesGroup";
import Member from "./Member";
import Action from "./Action";
import Address from "./Address";
import { GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI } from "~/modules/reportSalary/benefitConfiguration/constants";
import { RULE_SALES_GROUP } from "../constants";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import AssignMember from "./AssignMember";
import ListMember from "./ListMember";
type propsType = {
  dataSource: any[];
};

const CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI: any =
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI;

export default function SalesGroupTree({
  dataSource,
}: propsType): React.JSX.Element {
  const {
    onOpenFormRelation,
    onOpenFormTarget,
    onCloseFormTarget,
    isOpenTarget,
    id,
    onOpenFormExchangeRate,
    setParentNear,
    setGroupInfo,
    setId
  } = useSalesGroupStore();
  const [modal, contextHolder] = Modal.useModal();
  const optionConvertToArrayBenefit = Object.entries(omit(EMPLOYEE_LEVEL_VI,['CTV']))
    .map(([key, value]) => ({
    value: key,
    label: value,
    }));
  // const openModel = (id?: string) => {
  //   setId(id)
  //   let a;
  //   a = modal.info({
  //     icon: <></>,
  //     content:  <TargetSalesGroup other={a} _id={id as any} />,
  //     width: "auto",
  //     mask: true,
  //     maskClosable:true,
  //     className: "modalScroll",
  //     centered: true,
  //      onCancel: () => setId(null),
  //     footer: <></>,
  //  })
  // }

  const [typeEmployeeLevel, setTypeEmployeeLevel] = useState(null);
  const TitleRender = (item: any) => {
    const { _id } = item;
    const data = get(item, "salesGroupPermission", []);
    const teamLead = data?.find(
      (member: any) => get(member, "rule") === RULE_SALES_GROUP.LEADER
    );
    const member = data?.filter(
      (m: any) => get(m, "rule") === RULE_SALES_GROUP.MEMBER
    );
    return (
      <div className="sale-tree__title">
        <Flex>
          <Flex className="sale-tree__title--flex__name ">  
            <h6>{item?.name}</h6>
            <Address managementArea={get(item, "managementArea", [])} />
          </Flex>

          <Flex className="sale-tree__title--flex">
            <Button size="small" onClick={() => {
              // openModel(item?._id)
              onOpenFormTarget(item?._id)
            }}>
              Xem chỉ tiêu
            </Button>
          </Flex>

          <Flex className="sale-tree__title--flex">
            <Flex style={{ marginRight: "5px" }}>Loại nhân sự: </Flex>
              <Select
                disabled={teamLead?._id || member?.length ? true : false}
                style={{ width: 160 }}
                options={optionConvertToArrayBenefit}
                value={teamLead?.employee?.employeeLevel || ( member?.[0]?.rule === RULE_SALES_GROUP.MEMBER ? EMPLOYEE_LEVEL_VI.TDV : typeEmployeeLevel)}
                onSelect={setTypeEmployeeLevel}
              />
          </Flex>

          <Flex className="sale-tree__title--flex">
            {
              !teamLead && typeEmployeeLevel === 'TDV' ||  member?.[0]?.rule === RULE_SALES_GROUP.MEMBER ? 
              <Flex align={"center"} gap={5} >
                {member ? (
                  <ListMember member={member}/>
                ) : (
                  "(Chưa có)"
                )}
                <AssignMember member={member} _id={_id} />
              </Flex> 
                :
            <Member
              _id={_id}
              data={get(item, "salesGroupPermission", [])}
              typeArea={get(item, "typeArea", "")}
              child={get(item, "children", [])}
            />
            }
          </Flex>

          <Flex className="sale-tree__title--flex">
            <Button
              type="link"
              onClick={() => {
                onOpenFormExchangeRate(_id);
                setParentNear(item?.parent);
                setGroupInfo(item);
              }}
            >
              Nhập quy đổi
            </Button>
          </Flex>

          <Flex className="sale-tree__title--flex">
            {/* <Space>Thao tác:</Space> */}
            <Action _id={_id} rc={item} />
          </Flex>
        </Flex>
        <ModalAnt
          onCancel={onCloseFormTarget}
          open={isOpenTarget}
          footer={null}
          destroyOnClose
          width={"auto"}
          className="modalScroll"
          centered
        >
          <TargetSalesGroup _id={id} />
        </ModalAnt>
        { contextHolder}
      </div>
    );
  };

  return (
        <Tree
          className="sale-tree"
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={["0-0-0"]}
          treeData={dataSource}
          titleRender={(item: any) => TitleRender(item)}
          fieldNames={{
            title: "name",
          }}
          blockNode	= {true}
          // onSelect={(keys,{node}) => {
          //   onOpenFormRelation(get(node,'_id'))
    
          // }}
        />
  );
}
