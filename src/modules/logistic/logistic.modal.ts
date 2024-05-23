
export type TRANSPORT_NAME_TYPE = 'VIETNAMPOST' | 'VIETTELPOST';
export type TRANSPORT_TYPE_OBJECT = {
  VIETNAMPOST: string,
  VIETTELPOST: string
};


export type transportUnitType = {
  label: string,
  value: TRANSPORT_NAME_TYPE
};