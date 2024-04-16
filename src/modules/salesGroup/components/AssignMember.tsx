import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Popover, Table, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { TableRowSelection } from "antd/es/table/interface";
import { debounce, get } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { useGetListMemberSalesGroups } from "../salesGroup.hook";
import { EmployeeType, MemberRulesInGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
    _id? : string,
    member? : MemberRulesInGroupType[],
};
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI;
export default function AssignMember({_id,member}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [keyword,setKeyword] = useState("");
  const {isSubmitLoading,updateSalesGroup, canDelete, canUpdate} = useSalesGroupStore();
  const query = useMemo(() => open ? ({salesGroupId : _id,keyword}) : null,[open,_id,keyword]);
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
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  useEffect(() => {
    // Init Selected Row key By Member in data
    setSelectedRowKeys(member?.map((mem) => get(mem,'employeeId','')) || [])
  },[]);

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
  const debounceFetcher = debounce(setKeyword, 300);

  return (
    <div>
      <Popover
        content={
          <Flex vertical gap={10}>
            <Search placeholder="Tìm kiếm..." onSearch={(value) => setKeyword(value)} onChange={({target}) => debounceFetcher(target.value)}/>
            <Table
              scroll={{ y: 300 }}
              style={{ width: 500}}
              loading={isLoading}
              rowKey={(rc) => get(rc, "_id")}
              pagination={false}
              size="small"
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
            <Button
              loading={isSubmitLoading}
              onClick={onAssign}
              size="small"
              type="primary"
            >
              Xác nhận
            </Button>
          </Flex>
        }
        title="Danh sách nhân viên sẵn sàng"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button
          icon={
            <PlusCircleOutlined />
          }
        />
      </Popover>
      {/* {canDelete &&(member ? (
          <Popconfirm title="Xác nhận gỡ trình dược viên" onConfirm={onRemove}>
          <Tooltip title="Gỡ trình dược viên">
            <Button danger icon={<DeleteOutlined />} />
          </Tooltip>
          </Popconfirm>
        ) : null)} */}
    </div>
  );
}
