import React, { useEffect, useMemo } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { Tabs } from "antd";
import { useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import Employee from "./Employee";
import Breadcrumb from "~/components/common/Breadcrumb";
import EmployeeGroup from "~/modules/employeeGroup/screens/EmployeeGroup";


export default function User() {
  const { t }: any = useTranslate();
  const [currentTab, setCurrentTab] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMatchUser = useMatchPolicy(POLICIES.READ_EMPLOYEE);
  const isMatchUserGroup = useMatchPolicy(POLICIES.READ_EMPLOYEEGROUP);

  const onChange = (key: any) => {
    console.log(key,'key')
    setCurrentTab(key);
    navigate(`/${key}`);
  };

  useEffect(() => {
    let urlPush = "/employee";
    if (pathname === "/employee/*" || pathname === "/employee") {
      if(isMatchUser) {
        urlPush = "/employee";
      } else if(isMatchUserGroup) {
        urlPush += "-group";
      };
      const resultSubstring: string = urlPush.substring(1);
      setCurrentTab(resultSubstring);
      navigate(urlPush);
    };
  }, [pathname]);

  useEffect(() => {
    let urlPush = "/employee";
      switch (true) {
        case isMatchUser:
          urlPush = "/employee";
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
    <div>
      <Breadcrumb title={t("Quản lý nhân viên")} />
      <WhiteBox>
        <Tabs
          activeKey={currentTab}
          onChange={(key) => onChange(key)}
          defaultActiveKey={pathname}
        >
          {isMatchUser &&  <TabPane tab="Nhân viên" key="employee"/>}
          {isMatchUserGroup &&  <TabPane tab="Nhóm nhân viên" key="employee/group" />}
        </Tabs>
        <Routes>
          {isMatchUser ? (
            <Route
              path={``}
              element={<Employee currentTab={currentTab} />}
            />
          ) : (
            <React.Fragment />
          )}
          {isMatchUserGroup ? (
            <Route
              path={`group`}
              element={<EmployeeGroup currentTab={currentTab} />}
            >
               <Route
                path={`:groupId`}
                element={<EmployeeGroup currentTab={currentTab} />}
              />
            </Route>
          ) : (
            <React.Fragment />
          )}
        </Routes>
      </WhiteBox>
    </div>
  );
}
