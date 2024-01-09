import React, { useEffect } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { Tabs } from "antd";
import { useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import UserEmployee from "../components/UserEmployee";
import UserGroup from "~/modules/userGroup/screens/UserGroup";
import { Routes, Route, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import PermissionGate from "~/routes/middleware/PermissionGate";

export default function User() {
  const { t }: any = useTranslate();
  const [currentTab, setCurrentTab] = useState("user/list");
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const onChange = (key: string) => {
    setCurrentTab(key);
    navigate(`/${key}`);
  };
  useEffect(() => {
    navigate(`/user/list`);// refetch page is reset route default
  }, []);

  return (
    <div>
      <WhiteBox>
        <Tabs activeKey={currentTab} onChange={(key) => onChange(key)} defaultActiveKey="user/list">
          <TabPane tab="Người dùng" key="user/list">
            <UserEmployee currentTab = {currentTab}/>
          </TabPane>
          <TabPane tab="Nhóm người dùng" key="user/group">
            <UserGroup currentTab = {currentTab} />
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
