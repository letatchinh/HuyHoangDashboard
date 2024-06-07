
export type TRANSPORT_NAME_TYPE = 'VIETNAMPOST' | 'VIETTELPOST';
export type TRANSPORT_TYPE_OBJECT = {
  VIETNAMPOST: string,
  VIETTELPOST: string
};


export type transportUnitType = {
  label: string,
  value: TRANSPORT_NAME_TYPE
};

export const PAYER_OPTION = {
  SYSTEM: 'SYSTEM',
  CUSTOMER: 'CUSTOMER',
};
export type payerType = 'SYSTEM' | 'CUSTOMER';
export type payerTypeOption ={
    label: string;
    value: payerType;
  };