import { Button, Col, Row, Select } from "antd";
import React, { useMemo } from "react";
import { useGetRoleByUser, useGetStaffGroups } from "~/modules/staffGroups/staffGroups.hook";
type propsType = {
  id?: string | null;
  handleUpdate?: any;
};
export default function AddStaffGroup({
  id,
  handleUpdate
}: propsType): React.JSX.Element {
  const [groups, isLoadingGroup] = useGetStaffGroups();
  const userId = useMemo(() => ({userId: id}), [id]);
  const [data, isLoading] = useGetRoleByUser(userId);
  return (
    <>
      <Select allowClear style={{ width: "50%" }}>
        {groups?.map(({ _id, name }: any) => (
          <Select.Option value={_id} key={_id}>
            {name}
          </Select.Option>
        ))}
      </Select>
      {
        <Row
          style={{ width: "100%", margin: " 0 auto" , marginTop: "10px"}}
          gutter={10}
          align="middle"
          justify={"end"}
        >
          <Col>
            <Button type="primary" htmlType="submit" disabled>
              Cập nhật
            </Button>
          </Col>
        </Row>
      }
    </>
  );
}
