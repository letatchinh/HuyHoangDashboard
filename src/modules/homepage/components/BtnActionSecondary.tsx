import { Flex } from "antd";
import React from "react";
type propsType = {
  value: string;
  icon?: any;
  onClick: () => void,
  className? : string;
};
export default function BtnActionSecondary({
  value,
  icon,
  onClick,
  className = ''
}: propsType): React.JSX.Element {
  return (
    <button onClick={onClick} className={"homepage--btnActionSecondary " + className}>
      <Flex vertical justify={"center"} align="center">
        {icon && icon}
        <span className="homepage--btnActionSecondary__text">{value}</span>
      </Flex>
    </button>
  );
}
