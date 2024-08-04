export type ItemStatusWarehouseType = {
  name: string
  color: string
  colorStyle: string
};
export type STATUS_LINK_WAREHOUSE_TYPE = {
  LINKED: string,
  NOT_LINKED: string
};
export type STATUS_LINK_WAREHOUSE_TYPE_VI = {
  LINKED: ItemStatusWarehouseType
  NOT_LINKED: ItemStatusWarehouseType
};