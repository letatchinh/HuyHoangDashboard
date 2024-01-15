import React, { createContext, useContext, useState, ReactNode } from "react";
type typeCumulativeDiscount = {
  typeReward : string,
  value : string,
  name : string,
  valueType : string,
  target : string,
  targetId : string,
  typeDiscount : string,
  session : string,
  code : string,
}
type billItem = {
  cumulativeDiscount? : typeCumulativeDiscount[],
  productId : string,
  variantId : string,
  quantity : number,
  totalPrice : number,
  supplierId : string,
  lotNumber? : string,
  expirationDate? : string,
}
type DataItem = billItem & {
  key: number;
  name: string;
};

export type GlobalCreateBill = {
  clonedDataSource: DataItem[];
  onSave: (newRow: DataItem) => void;
  onAdd: (newRow: Omit<DataItem, 'key'>) => void;
};

const CreateBill = createContext<GlobalCreateBill>({
  clonedDataSource: [],
  onSave: () => {},
  onAdd: () => {},
});

type CreateBillProviderProps = {
  children: ReactNode;
};

export function CreateBillProvider({ children }: CreateBillProviderProps): JSX.Element {
  const [clonedDataSource, setClonedDataSource] = useState<DataItem[]>([]);

  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...clonedDataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    const computedRow = {
      ...row,
    };

    newData.splice(index, 1, { ...item, ...computedRow });
    setClonedDataSource(newData);
  };

  const onAdd = (row: Omit<DataItem, 'key'>) => {    
    setClonedDataSource([...clonedDataSource, { ...row, key: clonedDataSource.length + 1 }]);
  };

  return (
    <CreateBill.Provider value={{ 
      clonedDataSource,
      onSave,
      onAdd,
    }}>
      {children}
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
