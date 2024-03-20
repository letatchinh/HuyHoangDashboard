export interface UpdateOrderItem {
  id: string;
  status?: string;
  expirationDate?: any;
  lotNumber?: any;
  note?: any;
  unitPrice?: number,
  quantity?: number,
};
export interface PayloadSubmitUpdateOrderItem extends Omit<UpdateOrderItem, "id">  {
  orderItemId?: string
};


export type StatusOrderItemType = {
  NEW: string;
  CONFIRM: string;
  ORDERING: string;
  RECEIVED: string;
  PACKAGED: string;
  COMPLETED: string;
  CANCELLED: string;
};
