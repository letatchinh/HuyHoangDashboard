export const SALES_GROUP_GEOGRAPHY = {
    REGION: 'REGION',
    GROUP: 'GROUP',
    ZONE: 'ZONE',
  }
export const SALES_GROUP_GEOGRAPHY_VI = {
    REGION: 'Vùng',
    GROUP: 'Nhóm',
    ZONE : 'Nhóm cá nhân',
} as any;
export const SALES_GROUP_GEOGRAPHY_COLOR = {
    REGION: 'orange',
    GROUP: 'blue',
    ZONE : 'purple',
} as any;
export const OPTIONS_SALES_GROUP_GEOGRAPHY = Object.keys(SALES_GROUP_GEOGRAPHY).map((key) => ({
    label : SALES_GROUP_GEOGRAPHY_VI[key],
    value : key
}));

export const RULE_SALES_GROUP = {
    LEADER : "LEADER",
    MEMBER : "MEMBER",
}