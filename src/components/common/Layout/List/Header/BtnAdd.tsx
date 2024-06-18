import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { ButtonProps } from "antd";
export default function BtnAdd(props: ButtonProps): React.JSX.Element {
  return (
    <Button
      icon={<PlusOutlined />}
      type="primary"
      {...props}
    >
      Thêm mới
    </Button>
  );
}
