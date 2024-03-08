import React, {  createContext, useContext, useState } from 'react';
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
import RevenueChart from './ReportRevenue';
type propsType = {

};

// Define the context
type RevenueContextType = {
  totalRevenueId: any;
  setTotalRevenueId: React.Dispatch<React.SetStateAction<any>>;
  dateTime: any;
  setDateTime: React.Dispatch<React.SetStateAction<any>>;
  totalRevenue: any;
  setTotalRevenue: React.Dispatch<React.SetStateAction<any>>;
  listMineralByMonth: any;
  setListMineralByMonth: React.Dispatch<React.SetStateAction<any>>;
};

const RevenueContext = createContext<RevenueContextType>({
  totalRevenueId: null,
  setTotalRevenueId: () => { },
  dateTime: null,
  setDateTime: () => { },
  totalRevenue: 0,
  setTotalRevenue: () => { },
  listMineralByMonth: null,
  setListMineralByMonth: () => { },
});

export default function RevenueSupplier(props: propsType): React.JSX.Element {
  const { id } = useParams();
  const [totalRevenueId, setTotalRevenueId] = useState<any>(null);
  const [supplier, loading] = useGetSupplier(id);
  const [dateTime, setDateTime] = useState<any>();
  const [totalRevenue, setTotalRevenue] = useState<any>(0);
  const [listMineralByMonth, setListMineralByMonth] = useState<any>();
  
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('1');

  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };

  useResetActionInRevenue();
  return (
    <RevenueContext.Provider value={{
      totalRevenueId,
      setTotalRevenueId,
      dateTime,
      setDateTime,
      totalRevenue,
      setTotalRevenue,
      listMineralByMonth,
      setListMineralByMonth
    }}>
    <div>
      <h4>{loading ? "Đang tải..." :  `Doanh số khoán của nhà cung cấp ${get(supplier,'name','')}`}</h4>
      <RenderTotalRevenue
        setTotalRevenueId = {setTotalRevenueId}
        totalRevenueId = {totalRevenueId}
        setHistoryLogs = {setHistoryLogs}
      />
      <Tabs onChange={(e)=> onChangeTab(e)} destroyInactiveTabPane activeKey={activeTab}>
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
        <TabPane key={'3'} tab='Báo cáo' >
          <RevenueChart
          totalRevenueId = {totalRevenueId}
        />
        </TabPane>
      </Tabs>
      { activeTab !== '3' &&
        <WithPermission permission={POLICIES.READ_HISTORYSUPPLIERMINERRAL}>
          <HistoryLogs historyLogs={historyLogs} />
        </WithPermission>
      }
      </div>
      </RevenueContext.Provider>
  )
};
const useRevenueContext = () => useContext(RevenueContext);
export { useRevenueContext };
