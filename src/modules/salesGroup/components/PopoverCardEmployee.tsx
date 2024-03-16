import { Popover } from "antd";
import { PopoverProps } from "antd/lib/index";
import React from "react";
import CardEmployee from "./CardEmployee";
interface PopoverPropsExtend extends PopoverProps{
    employee? : any
}
export default function PopoverCardEmployee({
  children,
  employee,
  ...props
}: PopoverPropsExtend): React.JSX.Element {
  return (
    <Popover trigger={["hover"]} content={<CardEmployee employee={employee}/>} {...props}>
      {children}
    </Popover>
  );
}
