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
  const isMatchEmployee = useMatchPolicy(POLICIES.READ_EMPLOYEE);
  const isMatchEmployeeGroup = useMatchPolicy(POLICIES.READ_EMPLOYEEGROUP);
  const onChange = (key: any) => {
    setCurrentTab(key);
    navigate(`/${key}`);
  };

  useEffect(() => {
    let urlPush = "/employee";
    if (pathname === "/employee/*" || pathname === "/employee") {
      if (isMatchEmployee) {
        urlPush = "/employee";
      } else if (isMatchEmployeeGroup) {
        urlPush += "/group";
      }
      const resultSubstring: string = urlPush.substring(1);
      setCurrentTab(resultSubstring);
      navigate(urlPush);
    };
  }, [pathname]);

  // useEffect(() => {
  //   let urlPush = "/employee";
  //     switch (true) {
  //       case isMatchEmployee:
  //         urlPush = "/employee";
  //         break;
  //       case isMatchEmployeeGroup:
  //         urlPush += "/group";
  //         break;
  //       default:
  //         break;
  //   };
  //   const resultSubstring: string = urlPush.substring(1);
  //   setCurrentTab(resultSubstring);
  //   navigate(urlPush);
  // }, [isMatchEmployeeGroup, isMatchEmployee]);
  return (
    <div>
      {(isMatchEmployeeGroup || isMatchEmployee) && (
        <>
          <Breadcrumb title={t("Quản lý trình dược viên")} />
          <WhiteBox>
            <Tabs
              activeKey={currentTab}
              onChange={(key) => onChange(key)}
              defaultActiveKey={pathname}
            >
              {isMatchEmployee && (
                <TabPane tab="Danh sách trình dược viên" key="employee" />
              )}
              {isMatchEmployeeGroup && (
                <TabPane tab="Nhóm trình dược viên" key="employee/group" />
              )}
            </Tabs>
            <Routes>
              {isMatchEmployee ? (
                <Route
                  path={``}
                  element={<Employee currentTab={currentTab} />}
                />
              ) : (
                <React.Fragment />
              )}
              {isMatchEmployeeGroup ? (
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
        </>
      )
    }
    </div>
  );
}
