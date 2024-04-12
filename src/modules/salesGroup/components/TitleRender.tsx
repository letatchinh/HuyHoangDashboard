import { Button, ConfigProvider, Flex, Modal, Select } from "antd";
import { get, omit } from "lodash";
import { useState } from "react";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { RULE_SALES_GROUP } from "../constants";
import useSalesGroupStore from "../salesGroupContext";
import Action from "./Action";
import Address from "./Address";
import AssignMember from "./AssignMember";
import ListMember from "./ListMember";
import Member from "./Member";
import TargetSalesGroup from "./TargetSalesGroup";
import ModalAnt from "~/components/Antd/ModalAnt";
import ExchangeRate from "./ExchangeRate";

export default function TitleRender(item: any) {
  const {
    onOpenFormExchangeRate,
    setParentNear,
    setGroupInfo,
    setId,
    onCloseFormExchangeRate,
    id,
    isOpenFormExchangeRate,
  } = useSalesGroupStore();
  
  const optionConvertToArrayBenefit = Object.entries(omit(EMPLOYEE_LEVEL_VI,['CTV']))
  .map(([key, value]) => ({
    value: key,
    label: value,
  }));
  
  const [modal, contextHolder] = Modal.useModal();
  const [typeEmployeeLevel, setTypeEmployeeLevel] = useState(null);
  const { _id } = item;
  const data = get(item, "salesGroupPermission", []);
  const teamLead = data?.find(
    (member: any) => get(member, "rule") === RULE_SALES_GROUP.LEADER
  );
  const member = data?.filter(
    (m: any) => get(m, "rule") === RULE_SALES_GROUP.MEMBER
  );
  const openModel = (id?: string) => {
    setId(id)
 
    modal.info({
        icon: <></>,
        content: <TargetSalesGroup _id={id as any} />,
        width: "auto",
        mask: true,
        maskClosable: true,
        closable: true,
        className: "modalScroll",
        centered: true,
        title: `Nhóm: ${item.name}`,
        footer: <></>,
        open: true,
        type: "info",
        afterClose: () => {
          setId(null)
        }
    });
  };
  const openModelExchange = (idItem?: string) => {
    setId(idItem)
    modal.info({
        icon: <></>,
        content:   <ExchangeRate id={idItem} />,
        width: "auto",
        mask: true,
        maskClosable: true,
        className: "modalScroll",
        centered: true,
        title: `Thiết lập quy đổi nhà cung cấp cho nhóm : ${item.name}`,
        footer: <></>,
        open: true,
          type:"info"
    });
  };
  return (
    <div className="sale-tree__title">
      <Flex className="sale-tree__flex--container">
        <div className="sale-tree__title--flex__name ">  
          <div style={{fontSize: '16px', fontWeight: '500'}}>{item?.name}</div>
          <Address managementArea={get(item, "managementArea", [])} />
        </div>
        <Flex className="sale-tree__flex--content">
          <Flex className="sale-tree__title--flex__type--group">
            <Flex style={{ marginRight: "5px" }}>Loại nhân sự: </Flex>
              <Select
                disabled={teamLead?._id || member?.length ? true : false}
                style={{ width: 160 }}
                options={optionConvertToArrayBenefit}
                value={teamLead?.employee?.employeeLevel || ( member?.[0]?.rule === RULE_SALES_GROUP.MEMBER ? EMPLOYEE_LEVEL_VI.TDV : typeEmployeeLevel)}
                onSelect={setTypeEmployeeLevel}
              />
          </Flex>

          <Flex className="sale-tree__title--flex__member">
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

          <Flex className="sale-tree__title--flex__exchange">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    paddingBlock: "5px",
                  },
                }
              }}
            >
                <Button
                style={{width:'100%'}}
                size="small"
                type="primary"
                htmlType="button"
                onClick={() => {
                  
                  openModel(item?._id)
              }}>
                Xem chỉ tiêu
              </Button>

              <Button
                style={{width:'100%', backgroundColor: '#7BC9FF'}}
                type="primary"
                size="small"
                htmlType="button"
                onClick={() => {
                  openModelExchange(item?._id);
                  setParentNear(item?.parent);
                  setGroupInfo(item);
                }}
              >
                Nhập quy đổi
              </Button>
            </ConfigProvider>
          </Flex>

          <Flex className="sale-tree__title--flex__action">
            {/* <Space>Thao tác:</Space> */}
            <Action _id={_id} rc={item} />
          </Flex>
        </Flex>
      </Flex>
      { contextHolder}
    </div>
  );
};