export type TypeProps = {};
export type DiscountType = { discountType: "PERCENT" | "VALUE"; value: number };
export type ItemSubmitDataProductPartner = {
  productId: string;
  discount: DiscountType;
};
export type SubmitDataProductPartner = {
  partnerId: string;
  items: ItemSubmitDataProductPartner[];
};
export type AddressPartnerType = {
    hash?: string;
    street: string;
    wardId: string;
    districtId: string;
    cityId: string;
    isDefault: boolean;
};

export type PayloadSubmitUpdateAddressPartner = {
    method : 'add' | 'update' | 'delete',
    data : AddressPartnerType[],
    id : any
}