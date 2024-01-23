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