import React, { useEffect, useMemo } from "react";
import { ConfigProvider, Tabs } from "antd";
import type { TabsProps } from "antd";
import { head, omit } from "lodash";
import path from "path";
import StaffManagement from "./StaffManagement";
import StaffGroups from "~/modules/staffGroups/screens/StaffGroups";
import { useLocation, useNavigate } from "react-router-dom";
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
      children: <StaffManagement />,
      permission: true,
    },
    {
      key: "/staff-group",
      label: "Nhóm quyền",
      children: <StaffGroups />,
      permission: true,
    },
  ];
  const newItems = useMemo(
    () => items?.filter((item: any) => item?.permission),
    [items]
  );
  const activeKey = useMemo(() => (head(newItems) as any)?.key, [newItems]);
  const [activeTab, setActiveTab] = React.useState(activeKey);
  const location = useLocation();
  const navigate = useNavigate();

  const onChange = (key: string) => {
    setActiveTab(key);
  };
  useEffect(() => {
    setActiveTab(activeKey);
  }, [activeKey]);

  useEffect(() => {
    navigate("/staff"); // clear search query
  }, [activeTab]);

  return items?.length ? (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            /* here is your component tokens */
          },
        },
        token: {
        }
      }}
    >
      <Tabs
        type="editable-card"
        activeKey={activeTab}
        items={newItems as any}
        onChange={onChange}
        hideAdd
      />
    </ConfigProvider>
  ) : (
    <div>Không quyền</div>
  );
}
