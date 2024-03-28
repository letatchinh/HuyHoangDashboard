import { DropboxOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import React from "react";
type propsType = {
  value: string;
  title:string;
  icon: any;
  onClick: () => void
};
export default function CostManagementCard({
  value,
  title,
  icon,
  onClick,
}: propsType): React.JSX.Element {
  return (
    <button onClick={onClick}  style={{   marginLeft: '60px',
    height: '200px',
    width: '180px',
    backgroundColor: '#DFE9EF',
    outline: 'none',
    border: 'none',
    borderRadius: '5px', // Nếu bạn sử dụng biến CSS
    transition: '0.3s ease'}}>
      <Flex vertical justify={"center"} align="center">
        {icon}
        <p className="homepage--btnAction__text">{title}</p>
        <p>{value} VND</p>
      </Flex>
    </button>
  );
}
