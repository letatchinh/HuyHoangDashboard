import { Button, Flex, Popover, Table } from "antd";
import { get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { useGetListMemberSalesGroups } from "../salesGroup.hook";
import { EmployeeType, MemberRulesInGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
    _id? : string,
    members? : MemberRulesInGroupType[],
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI;
export default function AssignMember({_id,members}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    console.log(selectedRowKeys,'selectedRowKeys');
    
  const {isSubmitLoading,updateSalesGroup} = useSalesGroupStore();
  const query = useMemo(() => open ? ({salesGroupId : _id}) : null,[open,_id]);
  const [data,isLoading] : [EmployeeType[],boolean] = useGetListMemberSalesGroups(query);
  const hide = useCallback(() => {
    setOpen(false);
  },[])
  
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const onAssign = useCallback(() => {    
    updateSalesGroup({
        _id,
        listUser : selectedRowKeys?.join(',')
    });
    hide();
  },[_id,selectedRowKeys]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    // Init Selected Row key By Member in data
    const initSelected : any = members?.map((member : any) => get(member,'employeeId'));
    setSelectedRowKeys(initSelected)
  },[members]);

  const columns : any = [
    {
        title : "Tên nhân viên",
        key : "fullName",
        dataIndex : "fullName",
    },
    {
        title : "Chức vụ",
        key : "employeeLevel",
        dataIndex : "employeeLevel",
        render : (employeeLevel : any) => CLONE_EMPLOYEE_LEVEL_VI[employeeLevel]
    },
  ]
  return (
    <div>
      <Popover
        content={<Flex vertical gap={10}>
            <Table loading={isLoading} rowKey={(rc) => get(rc,'_id')} pagination={false} size='small' rowSelection={rowSelection} columns={columns} dataSource={data} />
            <Button loading={isSubmitLoading} onClick={onAssign} size="small" type="primary">Xác nhận</Button>
        </Flex>}
        title="Danh sách nhân viên đang rảnh"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button>+</Button>
      </Popover>
    </div>
  );
}
