import React, { useEffect, useMemo } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { head, omit } from "lodash";
import path from "path";
import StaffManagement from "./StaffManagement";
interface propsType {}
interface TabPaneProps extends TabsProps {
  permission?: boolean;
  key: string;
  label: string;
  children: React.ReactNode;
}
export default function Staff(props: propsType): React.JSX.Element {
  const items: any["items"] = [
    {
      key: "/staff",
      label: "Nhân viên",
      children: <StaffManagement/>,
      permission: true,
    },
    {
      key: "/staff-group",
      label: "Nhóm quyền",
      children: "Content of Tab Pane 2",
      permission: true,
    },
  ];
    const newItems = useMemo(() => items?.filter((item: any) => item?.permission) ,[items]);
    const activeKey = useMemo(() => (head(newItems) as any)?.key, [newItems]);
    const [activeTab, setActiveTab] = React.useState(activeKey);
  
    const onChange = (key: string) => {
      setActiveTab(key);
    };
    useEffect(() => {
      setActiveTab(activeKey);
    }, [activeKey]);
  
  return  items?.length ? <Tabs activeKey= {activeTab} items={newItems as any} onChange={onChange} /> : <div>Không quyền</div>
}
