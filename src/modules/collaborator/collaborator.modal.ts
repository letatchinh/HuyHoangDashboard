export type TypeProps = {
    
}
export type DiscountType = {discountType: 'PERCENT' | 'VALUE', value: number};
export type ItemSubmitDataProductPartner = {
    productId: string,
    discount:DiscountType
    }
export type SubmitDataProductPartner = {
    partnerId: string,
    items: ItemSubmitDataProductPartner[]
    }