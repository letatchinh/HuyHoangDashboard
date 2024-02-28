export type UpdateBillItem = {
    id : string,
    status? : string,
    expirationDate? : any,
    lotNumber? : any,
    note? : any,

}
export  type PayloadSubmitUpdateBillItem = {
    [billItemId: string]: Omit<UpdateBillItem,"id">
}

export type StatusBillItemType = {
    ORDERING: string,
    ORDERED: string,
    RECEIVED: string,
    PROCESSING: string,
    PACKAGED: string,
    SHIPPING: string,
    COMPLETED: string,
    CANCELLED: string,
}
export type ParamGetNextStatus = {
    status: string;
    lotNumber?: any;
    expirationDate: any;
  }