export type TypeProps = {};

export type DetailSalaryItem = {
  rateBenefit: number;
  supplierId: string;
  supplierName: string;
  value: number;
};

export type DetailSalary = {
  benefit: DetailSalaryItem[];
  bonus: {
    overMonth: DetailSalaryItem[];
    overQuarter: DetailSalaryItem[];
    overYear: DetailSalaryItem[];
    workingBenefit: DetailSalaryItem[];
    cover_pos: DetailSalaryItem[];
    exclusive_product: DetailSalaryItem[];
    team: DetailSalaryItem[];
  };
};
export interface TargetsSupplierItem  {
  minSale: number;
  mineralSale: number;
  targetTeam?: number;
  actuallySale: number;
  afterExchangeSale : number;
  saleCanChange?:number;
  supplier: {
    _id: string;
    name: string;
    code: string;
  };
};

export type EmployeeType = {
  fullName: string,
  employeeNumber: string,
  employeeLevel: string,
  baseSalary : string,
  salesGroupName : string
}

export type DataSwapType = {
  resourceValue?: number;
  resourceSupplierId?: string;
  targetValue?: number;
  targetSupplierId?: string;
  type : 'team' | 'self'
};

export type ExchangeRateType = {
  supplierAId: string,
  supplierBId: string,
  exchangeRateA: number,
  exchangeRateB: number,
}

export type Targets = {
  salesGroupId: string,
  salesGroupName: string,
  salesGroupAlias: string,
  targetSupplier: TargetsSupplierItem[],
  exchangeRateOverride: ExchangeRateType[]
}