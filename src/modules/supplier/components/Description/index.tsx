import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React, { useState } from 'react';
type propsType = {

};
export default function Description(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('1');
  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };
  return (
    <Tabs onChange={(e)=> onChangeTab(e)}>
      <TabPane key={'1'} tab = 'Danh sách sản phẩm' >

      </TabPane>
      <TabPane key={'2'} tab = 'Danh sách phiếu chi' >

      </TabPane>
    </Tabs>
  )
}