import { Form } from "antd";
import { get } from "lodash";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


type typeCumulativeDiscount = {
  typeReward: string;
  value: string;
  name: string;
  valueType: string;
  target: string;
  targetId: string;
  typeDiscount: string;
  session: string;
  code: string;
};
type billItem = {
  cumulativeDiscount?: typeCumulativeDiscount[];
  productId: string;
  variantId: string;
  quantity: number;
  totalPrice: number;
  supplierId: string;
  lotNumber?: string;
  expirationDate?: string;
};
type DataItem = billItem & {
  key: number;
  name: string;
};
type Bill = {
  billItems : DataItem[];
  pharmacyId : string
}

export type GlobalCreateBill = {
  clonedDataSource: DataItem[];
  onSave: (newRow: DataItem) => void;
  onAdd: (newRow: Omit<DataItem, "key">) => void;
  form : any,
  onValueChange : (newValue: any,allValues : any) => void

};
const CreateBill = createContext<GlobalCreateBill>({
  clonedDataSource: [],
  onSave: () => {},
  onAdd: () => {},
  form : null,
  onValueChange : () => {}
});

type CreateBillProviderProps = {
  children: ReactNode;
  bill : Bill,
  onChangeBill : (newObjData:any) => void
};


export function CreateBillProvider({
  children,
  bill,
  onChangeBill ,
}: CreateBillProviderProps): JSX.Element {  
  const [clonedDataSource, setClonedDataSource] = useState<DataItem[]>([]);
  const [form] = Form.useForm();
  

  // Controller Data
  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...clonedDataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    const computedRow = {
      ...row,
    };

    newData.splice(index, 1, { ...item, ...computedRow });
    // setClonedDataSource(newData);
    onChangeBill({
      billItems : newData
    })
  };

  const onAdd = (row: Omit<DataItem, "key">) => {
    const newData = [
      ...clonedDataSource,
      { ...row, key: clonedDataSource.length + 1 },
    ];
    onChangeBill({
      billItems : newData
    })
  };

  useEffect(() => {
    setClonedDataSource(get(bill,'billItems',[]));
    form.setFieldsValue(bill)
  },[bill,form]);

  const onValueChange = (value : any,values : any) => {
    const key : any = Object.keys(value)[0];
    switch (key) {
      case 'pharmacyId':
        onChangeBill({
          pharmacyId : value[key]
        })
        break;
    
      default:
        break;
    }
    
  } ;
  
  return (
    <CreateBill.Provider
      value={{
        clonedDataSource,
        onSave,
        onAdd,
        form,
        onValueChange,
      }}
    >
      {children}
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
