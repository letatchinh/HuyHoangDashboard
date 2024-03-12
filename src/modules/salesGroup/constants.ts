export const SALES_GROUP_GEOGRAPHY = {
    REGION: 'REGION',
    GROUP: 'GROUP',
  }
export const SALES_GROUP_GEOGRAPHY_VI = {
    REGION: 'Vùng',
    GROUP: 'Nhóm',
} as any
export const OPTIONS_SALES_GROUP_GEOGRAPHY = Object.keys(SALES_GROUP_GEOGRAPHY).map((key) => ({
    label : SALES_GROUP_GEOGRAPHY_VI[key],
    value : key
}));

export const RULE_SALES_GROUP = {
    LEADER : "LEADER",
    MEMBER : "MEMBER",
}