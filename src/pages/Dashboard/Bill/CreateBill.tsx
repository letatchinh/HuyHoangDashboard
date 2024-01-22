import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, ConfigProvider, Row, Space, Tabs, TabsProps } from "antd";
import { concat, forIn, get, unset } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { default as Bill, default as BillModule } from "~/modules/sale/bill";
import { billItem } from "~/modules/sale/bill/bill.modal";
import SelectProduct from "~/modules/sale/bill/components/SelectProduct";
import logo from '~/assets/images/header/logo-white.svg';

export const KEY_DATA_PHARMACY = "bill-pharmacy";
export const KEY_PRIORITY = "key-priority"; // Tab Will Use this key and Remove then (If Have)
type DataUpdateQuotationType = {
  billItems : billItem[],
  id : string,
  code : string
}
export type ItemDataSource = {
  typeTab : "createQuotation" | "updateQuotation",
  billItems: billItem[];
  pharmacyId: string | null;
  dataUpdateQuotation? : DataUpdateQuotationType;
};
export type DataSourceType = {
  [key: string]: ItemDataSource;
};
const initData: ItemDataSource = {
  typeTab : "createQuotation",
  billItems: [],
  pharmacyId: null,
};

const Label = ({ label, onRemove }: { label?: any; onRemove: () => void }) => (
  <Row justify={"space-between"} align="middle" gutter={16}>
    <Col>{label}</Col>
    <Col
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
    >
      <CloseCircleOutlined style={{ fontSize: 18, padding: 0 }} />
    </Col>
  </Row>
);

const CreateBillPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState<TabsProps["items"]>();
  const [activeKey, setActiveKey]: any = useState();
  const [dataSource, setDataSource]: any = useState<DataSourceType>({});
  const initDatSource = useCallback(() => {
    const newKey = v4();
    let newDataSource: DataSourceType = {
      [newKey]: {
        typeTab : "createQuotation",
        billItems: [],
        pharmacyId: null,
      },
    };
    setDataSource(newDataSource);
    setTabs([
      {
        label: `Đơn hàng 1`,
        key: newKey,
      },
    ]);
    setActiveKey(newKey);
  }, [setDataSource, setTabs]);
  // Controller DataSource
  const onAddDataSource = (key: any) => {
    setDataSource({ ...dataSource, [key]: initData });
  };

  const onRemoveDataSource = (key: any) => {
    let newDataSource = { ...dataSource };
    if (newDataSource.hasOwnProperty(key)) {
      unset(newDataSource, key);
    }
    if (Object.keys(newDataSource).length === 0) {
      initDatSource();
    } else {
      setDataSource(newDataSource);
    }
  };
  // Controller Tabs
  const onAddTab = () => {
    const nextTab = tabs ? tabs.length + 1 : 1;
    const key = v4();
    const newTabs: any = {
      label: `Đơn hàng ${nextTab}`,
      key,
    };
    const newTab = concat(tabs, newTabs);
    setTabs(newTab);
    onAddDataSource(key);
  };

  const onRemoveTab = (targetKey: any) => {
    console.log(targetKey, "targetKey");

    const newPanes = tabs?.filter((item) => item.key !== targetKey);
    if (!newPanes?.length) {
      const newId = v4();
      setTabs([
        {
          label: `Đơn hàng 1`,
          key: newId,
        },
      ]);
      onAddDataSource(newId);
      setActiveKey(newId);
    } else {
      setTabs(newPanes);
      if (activeKey === targetKey) {
        const newActiveKey = newPanes?.[0].key;
        setActiveKey(newActiveKey);
      }
    }
    onRemoveDataSource(targetKey);
  };
  const onChangeBill = (activeKey: any, newData: ItemDataSource) => {
    const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY);
    const dataReady = JSON.parse(dataFromLocalStorage || "");
    const newDataSource = {
      ...dataReady,
      [activeKey]: {
        // Change Data of key is activeKey
        ...dataReady[activeKey], // Inherited from Old Data
        ...newData, // Change New Data Source
      },
    };
    setDataSource(newDataSource);
  };
  const verifyData = (newActiveKey: string, callback?: () => void) => {
    const billCurrent = dataSource[newActiveKey];
    BillModule.service.onVerifyData({
      bill: billCurrent,
      keyActive: newActiveKey,
      onChangeBill,
      callback,
    });
  };
  const onChangeTab = (newActiveKey: string) => {
    setActiveKey(newActiveKey);

    // ReVerify when onChangeTab is called
    verifyData(newActiveKey);
  };

  // Initialize DataSource
  useEffect(() => {
    try {
      // Not Have DataSource  initialize new Data
      const dataFromLocalStorage : any  = localStorage.getItem(KEY_DATA_PHARMACY);
      const isInValidDataSource : boolean = BillModule.service.validateDataStorage(dataFromLocalStorage);
      if (
        isInValidDataSource
        ) {
        initDatSource();
      } else {
        // Data source is Ready
        const dataReady: DataSourceType = JSON.parse(dataFromLocalStorage);
        let newTabs: TabsProps['items'] = [];
        forIn(dataReady, (value, key) => {
          switch (get(value,'typeTab')) {
            case 'createQuotation':
              newTabs?.push({
                key,
                label: `Đơn hàng ${newTabs?.length + 1}`,
              });
              break;
            case 'updateQuotation':
              const {dataUpdateQuotation} = value;
              newTabs?.push({
                key,
                label: `Cập nhật ĐHT ${get(dataUpdateQuotation,'code','')}`,
              });
              break;
          
            default:
              break;
          }

        });
        setTabs(newTabs);

        const keyFirst = Object.keys(dataReady)[0];
        const dataFirst = dataReady[keyFirst];
        setDataSource(dataReady);
        // Verify when Initialize DataSource
        BillModule.service.onVerifyData({
          bill: dataFirst,
          keyActive: keyFirst,
          onChangeBill,
        });
      }
    } catch (error) {
      // Catch Will Reset all DataSource
      initDatSource();
    }
  }, []);

  // Auto setData For Local Storage When Data Source Change
  useEffect(() => {
    localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(dataSource));
  }, [dataSource]);


  useEffect(() => {
    // If Have key Priority will Set Key and Remove Then
    const keyPriorityStorage = localStorage.getItem(KEY_PRIORITY);
    if(keyPriorityStorage){
      const keyPriority = JSON.parse(keyPriorityStorage);
      setActiveKey(keyPriority);
      localStorage.removeItem(KEY_PRIORITY); // Remove after set 
      return;
    };
      // Auto Set Active key if First tabs
    if (!activeKey) {
      setActiveKey(tabs?.[0].key);
      return;
    }
  }, [activeKey, tabs]);
  return (
    <div>
      <div className="createBill">
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemColor: "white",
                itemHoverColor: "white",
                cardBg: "#0A64CF",
              },
            },
          }}
        >
          <Tabs
            destroyInactiveTabPane
            className="createBill__tabs"
            tabBarExtraContent={{
              left: (
                <Space>
                  <div className='layoutVertical--header__row__logo' onClick={() => navigate("/")}>
              <img src={logo}/>
            </div>
                  <SelectProduct
                  dataCurrent={dataSource?.[activeKey]}
                  onChangeBill={(newData: any) =>
                    onChangeBill(activeKey, newData)
                  }
                />
                </Space>
              ),
              right: (
                <PlusOutlined
                  onClick={onAddTab}
                  style={{
                    fontSize: 24,
                    color: "white",
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                />
              ),
            }}
            type="card"
            onChange={onChangeTab}
          >
            {tabs?.map((tab) => (
              <Tabs.TabPane
                active={activeKey === get(tab, "key")}
                key={tab.key}
                tab={
                  <Label
                    label={get(tab, "label", "")}
                    onRemove={() => {
                      onRemoveTab(get(tab, "key"));
                    }}
                  />
                }
              >
                <BillModule.storeProvider.CreateBillProvider
                  bill={get(dataSource, activeKey)}
                  onChangeBill={(newData: any) =>
                    onChangeBill(get(tab, "key"), newData)
                  }
                  verifyData={(callback?: () => void) =>
                    verifyData(activeKey, callback)
                  }
                  onRemoveTab={() => onRemoveTab(get(tab, "key"))}
                >
                  <Bill.page.create />
                </BillModule.storeProvider.CreateBillProvider>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default CreateBillPage;
