import { Popconfirm } from "antd";
import React from "react";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
type propsType = {
  delete: (id?: any) => void;
  _id: string;
  onOpenForm: (id?: any, isUpdate?: boolean) => void;
};
export default function ColumnsActions({
  delete: deleteAction,
  _id,
  onOpenForm,
}: propsType): React.JSX.Element {
  return (
    <div className="custom-table__actions">
      <WithOrPermission permission={[POLICIES.UPDATE_STAFF]}>
      <p onClick={()=> onOpenForm(_id, false)}>Phân quyền </p>
      </WithOrPermission>
      <p style={{ margin: "0 10px" }}>|</p>
      <WithOrPermission permission={[POLICIES.DELETE_STAFF]}>
      <Popconfirm
        title="Bạn muốn xoá người dùng này?"
        onConfirm={() => {
          deleteAction(_id);
        }}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <p>Xóa</p>
      </Popconfirm>{" "}
      </WithOrPermission>
    </div>
  );
}
