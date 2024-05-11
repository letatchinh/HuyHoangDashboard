import React, { useEffect } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { Tabs } from "antd";
import { useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import UserEmployee from "../components";
import UserGroup from "~/modules/userGroup/screens/UserGroup";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";


export default function User() {
  const [currentTab, setCurrentTab] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMatchUser = useMatchPolicy(POLICIES.READ_USER);
  const isMatchUserGroup = useMatchPolicy(POLICIES.READ_USERGROUP);

  const onChange = (key: any) => {
    setCurrentTab(key);
    navigate(`/${key}`);
  };

  useEffect(() => {
    let urlPush = "/user";
    if (pathname === "/user/*" || pathname === "/user") {
      if(isMatchUser) {
        urlPush += "/list";
      } else if(isMatchUserGroup) {
        urlPush += "/group";
      };
      const resultSubstring: string = urlPush.substring(1);
      setCurrentTab(resultSubstring);
      navigate(urlPush);
    };
  }, [pathname]);
  useEffect(() => {
    let urlPush = "/user";
      switch (true) {
        case isMatchUser:
          urlPush += "/list";
          break;
        case isMatchUserGroup:
          urlPush += "/group";
          break;
        default:
          break;
    };
    const resultSubstring: string = urlPush.substring(1);
    setCurrentTab(resultSubstring);
    navigate(urlPush);
  }, [isMatchUserGroup, isMatchUser]);
  return (
      <WhiteBox>
        <Tabs
          activeKey={currentTab}
          onChange={(key) => onChange(key)}
          defaultActiveKey={pathname}
        >
          {isMatchUser &&  <TabPane tab="Người dùng" key="user/list"/>}
          {isMatchUserGroup &&  <TabPane tab="Nhóm người dùng" key="user/group" />}
        </Tabs>
        <Routes>
          {isMatchUser ? (
            <Route
              path={`list`}
              element={<UserEmployee currentTab={currentTab} />}
            >
              <Route
                path={`:id`}
                element={<UserEmployee currentTab={currentTab} />}
              />
            </Route>
          ) : (
            <React.Fragment />
          )}
          {isMatchUserGroup ? (
            <Route
              path={`group`}
              element={<UserGroup currentTab={currentTab} />}
            >
              <Route
                path={`:groupId`}
                element={<UserGroup currentTab={currentTab} />}
              />
            </Route>
          ) : (
            <React.Fragment />
          )}
        </Routes>
      </WhiteBox>
  );
}
