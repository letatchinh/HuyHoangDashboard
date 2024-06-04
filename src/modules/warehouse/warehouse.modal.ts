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