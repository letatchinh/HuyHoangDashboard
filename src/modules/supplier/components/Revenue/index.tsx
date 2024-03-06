import React, {  useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSupplier, useResetActionInRevenue} from '../../supplier.hook';
import { get } from 'lodash';
import POLICIES from '~/modules/policy/policy.auth';
import RenderTotalRevenue from './TotalRevenue';
import HistoryLogs from './HistoryLogs';
import WithPermission from '~/components/common/WithPermission';
import RevenueProducts from './RevenueProducts';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import RevenueProductsGroup from './RevenueProductsGroup';
type propsType = {

};

export default function RevenueSupplier(props: propsType): React.JSX.Element {
  const { id } = useParams();
  const [totalRevenueId, setTotalRevenueId] = useState<any>(null);
  const [supplier, loading] = useGetSupplier(id);
  
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  useResetActionInRevenue();
  return (
    <div>
      <h4>{loading ? "Đang tải..." :  `Doanh số khoán của nhà cung cấp ${get(supplier,'name','')}`}</h4>
      <RenderTotalRevenue
        setTotalRevenueId = {setTotalRevenueId}
        totalRevenueId = {totalRevenueId}
        setHistoryLogs = {setHistoryLogs}
      />
      <Tabs>
        <TabPane key={'1'} tab='Nhóm sản phẩm' >
          <RevenueProductsGroup
          totalRevenueId = {totalRevenueId}
          />
        </TabPane>
        <TabPane key={'2'} tab='Sản phẩm' >
          <RevenueProducts
          totalRevenueId = {totalRevenueId}
        />
        </TabPane>
      </Tabs>
      {
        <WithPermission permission={POLICIES.READ_HISTORYSUPPLIERMINERRAL}>
          <HistoryLogs historyLogs={historyLogs} />
        </WithPermission>
      }
    </div>
  )
};
