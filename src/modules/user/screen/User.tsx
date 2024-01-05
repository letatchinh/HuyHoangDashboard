import React from "react";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { Tabs } from "antd";
import { useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import UserEmployee from "../components/UserEmployee";
import UserGroup from "~/modules/userGroup/screens/UserGroup";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import PermissionGate from "~/routes/middleware/PermissionGate";

export default function User() {
  const { t }: any = useTranslate();
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const onChange = (key: string) => {
    setActiveTab(key);
    navigate(`/${key}`);
  };

  return (
    <div>
      <WhiteBox>
        <Tabs activeKey={activeTab} onChange={(key) => onChange(key)}>
          <TabPane tab="Người dùng" key="user">
            <Routes>
              <Route path="/" element={<UserEmployee />} />
            </Routes>
          </TabPane>
          <TabPane tab="Nhóm người dùng" key="user/group">
            <Routes>
              <Route path = "/group" element={<UserGroup />} />
            </Routes>
          </TabPane>
        </Tabs>
        {/* <PermissionGate
          path={`${pathname}/user`}
          component={UserEmployee}
          // permission={POLICY.READ_USER}
        />
        <PermissionGate
          path={`${pathname}/user-group`}
          component={UserGroup}
          // permission={POLICY.READ_USERGROUP}
        /> */}
      </WhiteBox>
    </div>
  );
}
