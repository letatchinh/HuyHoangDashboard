import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { get } from "lodash";
import { MIN_AFTER_CHANGE } from "./constants";
import { DetailSalary, DetailSalaryItem, ReportEmployeeType, SalaryType, Targets, TargetsSupplierItem } from "./reportEmployee.modal";
import BaseAdminBtn from "./components/BaseAdminBtn";
import { BonusOtherType } from "../reportSupplier/reportSupplier.modal";
import BonusOtherForm from "./components/BonusOtherForm";
import { EmployeeLevelType } from "~/modules/employee/employee.modal";
import { EMPLOYEE_LEVEL } from "~/modules/employee/constants";
import { Popover } from "antd";
import UpdateAndDelete from "./components/UpdateAndDelete";
const styleChildren :CSSProperties= {
    fontStyle : 'italic',
}
const styleSubTitle :CSSProperties= {
    fontWeight : 600,
    fontSize : 14
}
const styleTitle :CSSProperties= {
    fontWeight : 600,
    fontSize : 16
}
const styleFooter :CSSProperties= {
    fontWeight : 800,
    fontSize : 18
}
export const service = {};
const ConvertChild = (DetailSalary: DetailSalaryItem[]) =>
  DetailSalary?.map((itemBenefit: DetailSalaryItem) => ({
    title: `Thưởng sản phẩm ${itemBenefit?.supplierName || ""} nhận được ${itemBenefit?.rateBenefit > 0 ? `(${get(itemBenefit,'rateBenefit',0) || ""}%)` : ""}`,
    value: itemBenefit?.value || 0,
    styleTitle : styleChildren,
  }));

export interface ItemDataSource  {
  title: any;
  afterTitle? : any;
  beforeTitle? : any;
  value?: number | undefined; // set undefined To prevent Show String at Title
  children?: ItemDataSource[];
  styleTitle? : CSSProperties;
  key?: string;
};

export const handleConvertDataSourceDetailSalary = ({
  detailSalary,
  baseSalary,
  daysWorking,
  totalSalary,
  bonus,
  benefit,
  salary,
  _id,
  bonusOther,
  totalBonusOther,
  employeeId,
  employeeLevel,
}: {
  detailSalary: DetailSalary;
  baseSalary: number;
  benefit: number;
  bonus: number;
  totalSalary: number;
  daysWorking: number;
  salary: SalaryType;
  _id?: string;
  bonusOther : BonusOtherType[],
  totalBonusOther : number,
  employeeId : string,
  employeeLevel : EmployeeLevelType,
}): ItemDataSource[] => {
  let A: ItemDataSource,
    B: ItemDataSource,
    C: ItemDataSource,
    D: ItemDataSource,
    FOOTER: ItemDataSource[];
  A = {
    title: "1. Lương cơ bản (A)",
    styleTitle : styleTitle,
    children: [
      {
        title: "Lương cơ bản",
        value: baseSalary,
        styleTitle : styleChildren,
      },
    
    ],
    key: "A",
    value : baseSalary
  };
  // Salary = 0 Will Add This
  if(baseSalary === 0){
    A?.children?.push({
      title: "Lương cơ bản (Thầm quyền)",
      value: get(salary,'baseAdmin',0),
      styleTitle : styleChildren,
      afterTitle : <BaseAdminBtn employeeId={employeeId} _id={_id}/>
    },)
  };
  
  B = {
    title: "2. Hoa hồng bán hàng (B)",
    styleTitle : styleTitle,
    children: ConvertChild(get(detailSalary, "benefit", [])),
    key: "B",
    value : benefit
  };
  const overMonth: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.overMonth',0),
    // key : 'overMonth',
    title: "Thưởng vượt trên doanh số khoán theo tháng",
    children: ConvertChild(get(detailSalary, "bonus.overMonth", [])),
  };

  const workingBenefit: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.workingBenefit',0),
    // key : 'workingBenefit',
    title: `Thưởng theo làm việc hiệu quả (thực tế: ${daysWorking} ngày)`,
    children: ConvertChild(get(detailSalary, "bonus.workingBenefit", [])),
  };
  const cover_pos: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.cover_pos',0),
    // key : 'cover_pos',
    title: `Thưởng đạt Độ phủ thị trường`,
    children: ConvertChild(get(detailSalary, "bonus.cover_pos", [])),
  };
  const exclusive_product: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.exclusive_product',0),
    // key : 'exclusive_product',
    title: `Thưởng theo SP độc quyền`,
    children: ConvertChild(get(detailSalary, "bonus.exclusive_product", [])),
  };
  const team: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.targetsLeader',0),
    // key : 'team',
    title: `Thưởng TeamLeader`,
    children: ConvertChild(get(detailSalary, "bonus.team", [])),
  };
  const overQuarter: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.overQuarter',0),
    // key : 'overQuarter',
    title: `Thưởng Vượt Doanh số Quý`,
    children: ConvertChild(get(detailSalary, "bonus.overQuarter", [])),
  };
  const overYear: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : get(salary,'bonus.overYear',0),
    // key : 'overYear',
    title: `Thưởng Vượt Doanh số Năm`,
    children: ConvertChild(get(detailSalary, "bonus.overYear", [])),
  };

  C = {
    title: "3. Thưởng bán hàng (C)",
    styleTitle : styleTitle,
    children: [
      overMonth,
      workingBenefit,
      cover_pos,
      exclusive_product,
      // team,
      overQuarter,
      overYear,
    ],
    key: "C",
    value : bonus
  };

  if(employeeLevel === EMPLOYEE_LEVEL.LEADER ){
    C.children?.splice(4,0,team)
  }
  const ItemAddBonusMethod = {
    title: "",
      value: undefined,
      styleTitle : styleChildren,
      afterTitle : <BonusOtherForm employeeId={employeeId} bonusOther={bonusOther} _id={_id}/>
  }
  D = {
    title: "4. Thưởng/phạt (D)",
    styleTitle : styleTitle,
    children:   [
      ItemAddBonusMethod,
      ...bonusOther?.map((item: BonusOtherType,index:number) => ({
        title: get(item,'content',''),
        value: get(item,'value') * get(item,'mathMethod'),
        styleTitle : {
          ...styleChildren,
          color : get(item,'mathMethod') === 1 ? 'green' : 'red'
        },
        beforeTitle : <UpdateAndDelete employeeId={employeeId} bonusOther={bonusOther} _id={_id} indexUpdate={index}/>
      }))
    ],
    key: "D",
    value : totalBonusOther,
  }

  FOOTER = [
    {
      title: "TỔNG THU NHẬP TRONG THÁNG",
      value: totalSalary,
      key: "FOOTER_1",
      styleTitle : styleFooter,
    },
  ];
  const dataSource: ItemDataSource[] = [A, B, C, D, ...FOOTER];
  return dataSource;
};

export class SwapStructure {
  id;
  rateSelf;
  name;
  rateTarget;
  maxValue;
  constructor({
    id,
    rateSelf = 1,
    name,
    rateTarget = 1,
    maxValue = 0,
  }: {
    id: string;
    rateSelf: number;
    name: string;
    rateTarget: number;
    maxValue: number;
  }) {
    this.id = id;
    this.rateSelf = rateSelf;
    this.name = name;
    this.rateTarget = rateTarget;
    this.maxValue = maxValue;
  }
  handleExchange(value: number): number {
    if(!value) return 0;
    return Math.ceil((value * this.rateTarget) / this.rateSelf);
  }
}



export const handleCalculateReducer = (payload:ReportEmployeeType) => {
  let keyWatchChange : any = [];
  const dataReturn =  ({
    ...payload,
    salary: {
      ...get(payload, "salary"),
      totalBonus: [
        get(payload, "salary.bonus.overMonth", 0),
        get(payload, "salary.bonus.overQuarter", 0),
        get(payload, "salary.bonus.overYear", 0),
        get(payload, "salary.bonus.workingBenefit", 0),
        get(payload, "salary.bonus.cover_pos", 0),
        get(payload, "salary.bonus.exclusive_product", 0),
        get(payload, "salary.bonus.targetsLeader", 0),

      ].reduce((sum, cur) => sum + cur, 0),
      totalBonusOther : (payload?.bonusOther || [])?.reduce((sum : number, cur : BonusOtherType) => sum + (get(cur,'value') * get(cur,'mathMethod',0)),0)
    },
    targetsTeam: {
      ...get(payload, "targetsTeam", {}),
      targetSupplier: get(payload, "targetsTeam.targetSupplier", [])?.map(
        (target: TargetsSupplierItem,i:number) => {
          keyWatchChange.push(`targetsTeam.targetSupplier.[${i}].afterExchangeSale`); // Register Key Watch Change
          return ({
            ...target,
            saleCanChange: Math.max(
              get(target, "afterExchangeSale", 0) -
                get(target, "targetTeam", 0),
              0
            ),
          })
        }
      ),
    },
    targetsSelf: {
      ...get(payload, "targetsSelf", {}),
      targetSupplier: get(payload, "targetsSelf.targetSupplier", [])?.map(
        (target: TargetsSupplierItem,i:number) => {
          keyWatchChange.push(`targetsSelf.targetSupplier.[${i}].afterExchangeSale`); // Register Key Watch Change
          return ({
            ...target,
            saleCanChange: Math.max(
              get(target, "afterExchangeSale", 0) -
                get(target, "minSale", 0),
              0
            ),
          })
        }
      ),
    },
  });
  return {
    ...dataReturn,
    keyWatchChange,
  }
};