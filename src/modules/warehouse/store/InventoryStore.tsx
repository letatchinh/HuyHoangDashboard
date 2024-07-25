import { createContext, useContext, useEffect, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import CreateOrderSupplierForm from "../components/Inventory/CreateOrderSupplierForm";
import { useGetInventory, useGetWarehouseByBranchLinked, useInventoryWarehouseQueryParams, useUpdateInventoryWarehouseParams } from "../warehouse.hook";
import { DataTypeSelected } from "../warehouse.modal";

type propsInventoryWarehouse = {
  children: React.ReactNode;
};
export type GlobalInventoryWarehouse = {
  listWarehouse: any[];
  setActiveTab: (key: any) => void;
  activeTab: string | undefined;
  isLoading: boolean;
  loading: boolean;
  data: any[];
  onParamChange: (param: any) => void;
  onSearch: (param: any) => void;
  keyword: string;
  setKeyword: (param: any) => void;
  onOpen: () => void;
  onClose: () => void;
  setSupplierId: (param: any) => void;
  supplierId: any;
};
const InventoryWarehouse = createContext<GlobalInventoryWarehouse>({
  listWarehouse: [],
  setActiveTab: () => { },
  activeTab: undefined,
  isLoading: false,
  loading: false,
  data: [],
  onParamChange: () => { },
  onSearch: () => { },
  keyword: '',
  setKeyword: () => { },  
  onOpen: () => { },
  onClose: () => { },
  setSupplierId: () => { },
  supplierId: undefined,
});

export function InventoryWarehouseProvider({
  children,
}: propsInventoryWarehouse): React.JSX.Element {
  const [listWarehouse, isLoading] = useGetWarehouseByBranchLinked();
  const [isOpen, setIsOpen] = useState<any>(false);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [query] = useInventoryWarehouseQueryParams(activeTab ? Number(activeTab) : null);
  const [keyword, { setKeyword, onParamChange }] = useUpdateInventoryWarehouseParams(activeTab && query);
  const [data, loading] = useGetInventory(activeTab && query);
  const [supplierId, setSupplierId] = useState<string | null>(null);

  useEffect(() => {
    if (listWarehouse?.length) {
      setActiveTab(parseFloat(listWarehouse[0]?._id))
    };
  }, [listWarehouse]);
  //HANDLE FORM
  const onOpen = () => {
    setIsOpen(true);
  };
  
  const onClose = () => {
    setIsOpen(false);
  };

  const onSearch = (value: any) => {
    onParamChange({
      ...query,
      ...value
    });
  };

  
  return (
    <InventoryWarehouse.Provider
      value={{
        listWarehouse,
        activeTab,
        setActiveTab,
        isLoading,
        loading,
        data,
        onParamChange,
        onSearch,
        keyword,
        setKeyword,
        onOpen,
        onClose,
        supplierId,
        setSupplierId
      }}
    >
      {children}
      <ModalAnt
        title='Tạo phiếu mua hàng'
        open={isOpen}
        onCancel={onClose}
        onOk={onClose}
        footer={false}
        width={1300}
        destroyOnClose
      >
        <CreateOrderSupplierForm/>
      </ModalAnt>
    </InventoryWarehouse.Provider>
  );
}

const useInventoryWarehouseStore = (): GlobalInventoryWarehouse => useContext(InventoryWarehouse);

export default useInventoryWarehouseStore;
