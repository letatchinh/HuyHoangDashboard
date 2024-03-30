import { EMPLOYEE_LEVEL } from '~/modules/employee/constants';
import { EmployeeLevelType } from '~/modules/employee/employee.modal';
import { STATUS_REPORT_EMPLOYEE } from './constants';

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
  employeeId: string,
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

export type SubmitDataUpdatePreview = {
  employeeId : string,
  targetsTeam? : {
    targetSupplier : TargetsSupplierItem[]
  },
  targetsSelf? : {
    targetSupplier : TargetsSupplierItem[]
  },
}
export type SalaryType = {
  base : number,
  bonus: {
    overMonth: number,
    overQuarter: number,
    overYear: number,
    workingBenefit: number,
    cover_pos: number,
    exclusive_product: number,
    targetsLeader: number,
  },
  benefit: number,
  totalSalary: number
};
export type ReportEmployeeType = {
    _id: string,
    startDate: string,
    endDate: string,
    session: string,
    daysWorkingInfo?: {
      daysWorking?: number,
      daysWorkingCond?: number,
      priceBillCond?: number
    },
    createById: string,
    employee: {
      fullName: string,
      employeeNumber: number,
      employeeId: string,
      employeeLevel: EmployeeLevelType,
      baseSalary: string,
      baseSalaryValue: number,
    },
    salary: SalaryType,
    status: keyof typeof STATUS_REPORT_EMPLOYEE,
    detailSalary: DetailSalary,
    createdAt: string,
    updatedAt: string,
    targetsSelf : Targets,
    targetsTeam : Targets,
}