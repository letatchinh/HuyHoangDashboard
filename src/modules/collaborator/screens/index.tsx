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
  const isCollaborator = useMatchPolicy(POLICIES.READ_PARTNER);
  const isCollaboratorGroup = useMatchPolicy(POLICIES.READ_PARTNERGROUP);

  useEffect(() => {
    let urlPush = '/collaborator';
    if (
      pathname === '/collaborator' + "/*" ||
      pathname === '/collaborator'
    ) {
      if (isCollaborator) {
         urlPush = '/collaborator';
      };
      if (!isCollaborator && isCollaboratorGroup) {
        urlPush += '/group';
      };
      const resultSubstring: string = urlPush.substring(1);
      setCurrentTab(resultSubstring);
      navigate(urlPush);
    };
  }, [pathname,isCollaborator,isCollaboratorGroup]);

  const onChange = (key: any) => {
    setCurrentTab(key);
    navigate(`/${key}`);
  };

  return (
    <div>
      {(isCollaboratorGroup || isCollaborator) && (
        <>
          <WhiteBox>
            <Tabs
              activeKey={currentTab}
              onChange={(key) => onChange(key)}
              defaultActiveKey={pathname}
              destroyInactiveTabPane
              
            >
              {isCollaborator && (
                <TabPane tab="Danh sách cộng tác viên" key="collaborator" />
              )}
              {isCollaboratorGroup && (
                <TabPane tab="Nhóm cộng tác viên" key="collaborator/group" />
              )}
            </Tabs>
            <Routes>
              {isCollaborator ? (
                <Route
                  path={``}
                  element={<Collaborator currentTab={currentTab} />}
                />
              ) : (
                <React.Fragment />
              )}
              {isCollaboratorGroup ? (
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
