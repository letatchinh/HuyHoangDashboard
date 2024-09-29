import { Popconfirm } from "antd";
import React from "react";
import WithOrPermission from "~/components/common/WithOrPermission";
type propsType = {
  delete: (id?: any) => void;
  _id: string;
  onOpenForm: (id?: any) => void;
};
export default function ColumnsActions({
  delete: deleteAction,
  _id,
  onOpenForm,
}: propsType): React.JSX.Element {
  return (
    <div className="custom-table__actions">
      {/* <WithOrPermission permission={[POLICIES.UPDATE_USER]}> */}
      <p onClick={()=> onOpenForm(_id)}>Sửa </p>
      {/* </WithOrPermission> */}
      <p style={{ margin: "0 10px" }}>|</p>
      {/* <WithOrPermission permission={[POLICIES.DELETE_USER]}> */}
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
      {/* </WithOrPermission>} */}
    </div>
  );
}
