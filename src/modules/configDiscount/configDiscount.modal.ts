const typeKey = {
  'DISCOUNT_SOFT': 'DISCOUNT_SOFT',
  'DISCOUNT_CORE': 'DISCOUNT_CORE',
  'PRICE': 'PRICE',
  'DISCOUNT_LK': 'DISCOUNT_LK',
  'REWARD_PRODUCT': 'REWARD_PRODUCT',
  'REWARD_ITEM': 'REWARD_ITEM'
} as const;

export interface ConfigItem {
  "name": string,
  "key": keyof typeof typeKey,
  "status": boolean,
  "sortType": 1 | -1
};

export interface ConfigDiscount {
  "config": ConfigItem[]
};