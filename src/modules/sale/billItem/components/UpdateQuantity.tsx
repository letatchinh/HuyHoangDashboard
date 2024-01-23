import { CheckCircleTwoTone, CheckOutlined, EditTwoTone, SaveTwoTone } from "@ant-design/icons";
import { Button, Space, Typography } from "antd";
import React, { useCallback, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { formatter } from "~/utils/helpers";
type propsType = {
  value: number;
  onSave: () => void;
};
export default function UpdateQuantity({
  value,
  onSave,
}: propsType): React.JSX.Element {
    const [isEdit,setIsEdit] = useState(false);
    const toggleEdit = useCallback(() => setIsEdit(!isEdit),[isEdit]);
  return (
    <Space>
        {isEdit ? <InputNumberAnt value={value} /> : <Typography.Text>{formatter(value)}</Typography.Text>}
      {/* {isEdit ? <Button onClick={toggleEdit} type="primary">Lưu</Button> : <EditTwoTone onClick={toggleEdit}/>} */}
    </Space>
  );
}
