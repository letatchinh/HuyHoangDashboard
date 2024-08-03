type BillItemSplit = {
  quantity: number;
  variantId: string;
  id: string;
};
type Item = {
  billItems: BillItemSplit[];
  totalPrice: number;
  pair: number;
}
export type CreateSplitBill = {
  id: string;
  billSplit: Item[];
};