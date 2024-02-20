import { DropboxOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import React from "react";
type propsType = {
  value: string;
  icon: any;
  onClick: () => void
};
export default function BtnAction({
  value,
  icon,
  onClick,
}: propsType): React.JSX.Element {
  return (
    <button onClick={onClick} className="homepage--btnAction">
      <Flex vertical justify={"center"} align="center">
        {icon}
        <span className="homepage--btnAction__text">{value}</span>
      </Flex>
    </button>
  );
}
