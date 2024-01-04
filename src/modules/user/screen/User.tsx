import { ColumnsType } from "antd/es/table/InternalTable";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";

import { Tabs } from "antd";
import { useState } from "react";
import TabPane from "antd/es/tabs/TabPane";
import UserEmployee from "../components/UserEmployee";
import UserGroup from "../components/UserGroup";


export default function User() {
  const { t }: any = useTranslate();
  const [id, setId] = useState(null)
  const [isActive, setIsActice] = useState('1')

  return (
    <div>
      {/* <Breadcrumb title={t("Người dùng")} /> */}
      <WhiteBox>
        <Tabs
          defaultValue={isActive}
          onChange={(key) => setIsActice(key)}
        >
          <TabPane tab="Nguời dùng" key="1">
            <UserEmployee setId={setId} id={id} />
          </TabPane>
          <TabPane tab="Nhóm người dùng" key="2">
            <UserGroup/>
          </TabPane>
        </Tabs>
      </WhiteBox>
    </div>
  );
}
