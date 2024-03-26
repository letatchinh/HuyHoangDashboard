import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Popover, Table, Tooltip } from "antd";
import { TableRowSelection } from "antd/es/table/interface";
import { get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { useGetListMemberSalesGroups } from "../salesGroup.hook";
import { EmployeeType, MemberRulesInGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
    _id? : string,
    member? : MemberRulesInGroupType,
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI;
export default function AssignMember({_id,member}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    
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

  const rowSelection : TableRowSelection<any> = {
    selectedRowKeys,
    onSelect : (record, selected) => {
      if(selected){
        setSelectedRowKeys([get(record,'_id')]);
      }else{
        setSelectedRowKeys([])
      }
    },
    hideSelectAll : true,
  };

  useEffect(() => {
    // Init Selected Row key By Member in data
    setSelectedRowKeys([get(member,'employeeId','')])
  },[member]);

  const columns : any = [
    {
        title : "Tên nhân viên",
        key : "fullName",
        dataIndex : "fullName",
    },
    {
        title : "Vị trí",
        key : "employeeLevel",
        dataIndex : "employeeLevel",
        render : (employeeLevel : any) => CLONE_EMPLOYEE_LEVEL_VI[employeeLevel]
    },
  ];

  const onRemove = useCallback(() => {
    updateSalesGroup({
      _id,
      listUser: [],
    });
    hide();
  }, [_id]);

  return (
    <div>
      <Popover
        content={<Flex vertical gap={10}>
            <Table scroll={{y : 300}} style={{width : 500}} loading={isLoading} rowKey={(rc) => get(rc,'_id')} pagination={false} size='small' rowSelection={rowSelection} columns={columns} dataSource={data} />
            <Button loading={isSubmitLoading} onClick={onAssign} size="small" type="primary">Xác nhận</Button>
        </Flex>}
        title="Danh sách nhân viên sẵn sàng"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button icon={member ? <i className="fa-solid fa-repeat"></i> : <PlusCircleOutlined />}/>
      </Popover>
      {member ? (
          <Popconfirm title="Xác nhận gỡ trình dược viên" onConfirm={onRemove}>
          <Tooltip title="Gỡ trình dược viên">
          <Button danger icon={<DeleteOutlined />} />
          </Tooltip>
          </Popconfirm>
        ) : null}
    </div>
  );
}
