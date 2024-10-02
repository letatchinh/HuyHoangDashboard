import { Button, Col, Row, Select } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGetRoleByUser,
  useGetStaffGroups,
} from "~/modules/staffGroups/staffGroups.hook";
import useNotificationStore from "~/store/NotificationContext";
type propsType = {
  id?: string | null;
  handleAdd?: any;
  handleRemove?: any;
  isLoadingSubmit?: boolean;
};
interface SubmitData {
  userId: string | null;
  roleId: string;
}
export default function AddStaffGroup({
  id,
  handleRemove,
  handleAdd,
  isLoadingSubmit,
}: propsType): React.JSX.Element {
  const [groups, isLoadingGroup] = useGetStaffGroups();
  const userId = useMemo(() => ({ userId: id }), [id]);
  const [data, isLoading] = useGetRoleByUser(userId);
  const [newData, setNewData] = useState<string[]>([]);
  const { onNotify } = useNotificationStore();
  useEffect(() => {
    if (data) {
      setNewData(data);
    } else {
      setNewData([]);
    }
  }, [data]);
  const onUpdate = (value: any, type: "add" | "remove") => {
    try {
      if (id) {
        const SubmitData: SubmitData = {
          userId: id,
          roleId: value,
        };
        if (type === "add") {
          handleAdd(SubmitData);
        } else {
          handleRemove(SubmitData);
        }
      }
    } catch (error: any) {
      onNotify?.error(get(error, "message", "Some error"));
    }
  };

  return (
    <>
      <Select
        loading={isLoading || isLoadingGroup}
        // allowClear = {f}
        style={{ width: "70%", margin: "0 auto" }}
        mode="multiple"
        onSelect={(value) => onUpdate(value, "add")}
        onDeselect={(value) => onUpdate(value, "remove")}
        value={data?.map(({ _id }: any) => _id)}
      >
        {groups?.map(({ _id, name }: any) => (
          <Select.Option value={_id} key={_id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
