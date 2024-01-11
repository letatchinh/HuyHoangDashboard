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
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";

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
          {/* <WithOrPermission permission={[POLICIES.READ_USER]}> */}
              <TabPane  tab="Người dùng" key="user/list">
                <UserEmployee currentTab = {currentTab}/>
              </TabPane>
          {/* </WithOrPermission> */}
          {/* <WithOrPermission permission={[POLICIES.READ_USERGROUP]}> */}
              <TabPane tab="Nhóm người dùng" key="user/group">
              <UserGroup currentTab = {currentTab} />
              </TabPane>
            {/* </WithOrPermission> */}
        </Tabs>
      </WhiteBox>
    </div>
  );
}
