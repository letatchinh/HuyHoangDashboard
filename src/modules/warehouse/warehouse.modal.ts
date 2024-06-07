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

export interface  itemType {
  quantity: number;
  discountValue: number;
  discountType: number;
  isCreateOrder: boolean;
  totalPrice: number;
}
export interface dataBillSentToWarehouse {
  warehouseId: number;
  discountValue: number;
  discountPercent: number;
  items: itemType[]; 
};