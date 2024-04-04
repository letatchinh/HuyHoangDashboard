import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, List, Popconfirm, Popover, Tooltip } from "antd";
import Search from "antd/es/input/Search";
import { debounce, get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import AvatarShortOrName from "~/components/common/AvatarShortOrName";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { getShortName } from "~/utils/helpers";
import { useGetListTeamLeadSalesGroups } from "../salesGroup.hook";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
  _id?: string;
  teamLead: any;
};
export default function AssignTeamLead({
  _id,
  teamLead,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const { isSubmitLoading, updateSalesGroup } = useSalesGroupStore();
  const [keyword,setKeyword] = useState("");
  const query = useMemo(() => (open ? { keyword } : null), [keyword, open]);
  const [data, isLoading] = useGetListTeamLeadSalesGroups(query);
  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const onAssign = useCallback(
    (item: any) => {
      updateSalesGroup({
        _id,
        manager: get(item, "_id"),
      });
      hide();
    },
    [_id]
  );
  const onRemove = useCallback(() => {
    updateSalesGroup({
      _id,
      manager: null,
    });
    hide();
  }, [_id]);
  const debounceFetcher = debounce(setKeyword, 300);
  return (
    <div>
      <Flex gap={5}>
      
        <Popover
          content={
          <>
          <Search onSearch={(value) => setKeyword(value)} onChange={({target}) => debounceFetcher(target.value)}/>
          <List
            className="scrollList"
            style={{width : 300}}
              dataSource={data}
              loading={isLoading}
              renderItem={(item) => (
                <List.Item key={get(item, "_id")}>
                  <List.Item.Meta
                    style={{ alignItems: "center" }}
                    avatar={
                      <AvatarShortOrName
                        src={get(item, "avatar")}
                        name={get(item, "fullName")}
                      />
                    }
                    title={<span>{get(item, "fullName", "")}</span>}
                    description={get(
                      EMPLOYEE_LEVEL_VI,
                      get(item, "employeeLevel", ""),
                      ""
                    )}
                  />
                  <Button
                    loading={isSubmitLoading}
                    onClick={() => onAssign(item)}
                    type="link"
                  >
                    Chọn
                  </Button>
                </List.Item>
              )}
            />
          </>
          }
          title="Danh sách người quản lý sẵn sàng"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Tooltip title={teamLead ? "Thay đổi trưởng nhóm" : "Thêm trưởng nhóm"}>
          <Button
            icon={
              teamLead ? (
                <i className="fa-solid fa-repeat"></i>
              ) : (
                <PlusCircleOutlined />
              )
            }
          />
          </Tooltip>
        </Popover>
        {teamLead ? (
          <Popconfirm title="Xác nhận gỡ trưởng nhóm" onConfirm={onRemove}>
          <Tooltip title="Gỡ trưởng nhóm">
          <Button danger icon={<DeleteOutlined />} />
          </Tooltip>
          </Popconfirm>
        ) : null}
      </Flex>
    </div>
  );
}
