export interface ItemProduct{
  name: string;
  manufacturer: {
    name: string;
  };
  unit: {
    name: string;
  };
  category: string;
  quantity: number;
  barcode: string;
};
export interface DataCheckWarehouse {
  listProduct: ItemProduct[];
  warehouseId: number;
};

export interface itemType {
  variantWarehouseId: string;
  productWarehouseId: string;
  batchId: string;
  quantity: number;
  cost: number;
  price: number;
  discountValue: number;
  discountType: number;
}
export interface dataBillSentToWarehouse {
  warehouseId: number;
  discountValue: number;
  discountPercent: number;
  payment: {
    method: 'CASH' | 'CARD';
    totalPayment: number;
    amount: number
  };
  items: itemType[]; 
};