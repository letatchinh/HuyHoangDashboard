import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React, { useState } from 'react';
import ProductList from './ProductList';
import Vouchers from './Vouchers';
type propsType = {
  supplierId: string | null
};
export default function Description(props: propsType): React.JSX.Element {
  const { supplierId } = props;
  const [activeTab, setActiveTab] = useState('1');
  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };
  return (
    <Tabs onChange={(e)=> onChangeTab(e)} destroyInactiveTabPane activeKey={activeTab} defaultActiveKey='1'>
      <TabPane key={'1'} tab = 'Danh sách sản phẩm' >
        <ProductList supplierId = {supplierId}/>
      </TabPane>
      <TabPane key={'2'} tab = 'Danh sách phiếu chi' >
        <Vouchers supplierId = {supplierId}/>
      </TabPane>
    </Tabs>
  )
}