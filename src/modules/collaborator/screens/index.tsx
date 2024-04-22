import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import Collaborator from "./Collaborator";
import CollaboratorGroup from "~/modules/collaboratorGroup/screens/CollaboratorGroup";
type propsType = {};
export default function CollaboratorScreen(props: propsType): React.JSX.Element {
  const { t }: any = useTranslate();
  const [currentTab, setCurrentTab] = useState("");
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const isCollatorabor = useMatchPolicy(POLICIES.READ_PARTNER);
  const isCollatoraborGroup = useMatchPolicy(POLICIES.READ_PARTNERGROUP);

  useEffect(() => {
    let urlPush = '/collaborator';
    if (
      pathname === '/collaborator' + "/*" ||
      pathname === '/collaborator'
    ) {
      if (isCollatorabor) {
        urlPush = '/collaborator';
      } else if (isCollatoraborGroup) {
        urlPush += '/collaborator' + "/group";
      }
      const resultSubstring: string = urlPush.substring(1);
      setCurrentTab(resultSubstring);
      navigate(urlPush);
    }
  }, [pathname]);

  const onChange = (key: any) => {
    setCurrentTab(key);
    navigate(`/${key}`);
  };

  return (
    <div>
      {(isCollatoraborGroup || isCollatorabor) && (
        <>
          <WhiteBox>
            <Tabs
              activeKey={currentTab}
              onChange={(key) => onChange(key)}
              defaultActiveKey={pathname}
              destroyInactiveTabPane
              
            >
              {isCollatorabor && (
                <TabPane tab="Danh sách cộng tác viên" key="collaborator" />
              )}
              {isCollatoraborGroup && (
                <TabPane tab="Nhóm cộng tác viên" key="collaborator/group" />
              )}
            </Tabs>
            <Routes>
              {isCollatorabor ? (
                <Route
                  path={``}
                  element={<Collaborator currentTab={currentTab} />}
                />
              ) : (
                <React.Fragment />
              )}
              {isCollatoraborGroup ? (
                <Route
                path={`group`}
                element={<CollaboratorGroup currentTab={currentTab} />}
              >
                <Route
                  path={`:groupId`}
                  element={<CollaboratorGroup currentTab={currentTab} />}
                />
              </Route>
            ) : (
              <React.Fragment />
              )}
            </Routes>
          </WhiteBox>
        </>
      )}
    </div>
  );
}
