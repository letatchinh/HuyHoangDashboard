import { CSSProperties } from "@ant-design/cssinjs/lib/hooks/useStyleRegister";
import { get } from "lodash";
import { DetailSalary, DetailSalaryItem } from "./reportEmployee.modal";
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
    title: `Thưởng sản phẩm ${itemBenefit?.supplierName || ""} nhận được ${itemBenefit?.rateBenefit > 0 ? `(${itemBenefit?.rateBenefit || ""}%)` : ""}`,
    value: itemBenefit?.value || 0,
    styleTitle : styleChildren,
  }));

export interface ItemDataSource  {
  title: string;
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
}: {
  detailSalary: DetailSalary;
  baseSalary: number;
  benefit: number;
  bonus: number;
  totalSalary: number;
  daysWorking: number;
}): ItemDataSource[] => {
    
  let A: ItemDataSource,
    B: ItemDataSource,
    C: ItemDataSource,
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

  B = {
    title: "2. Hoa hồng bán hàng (B)",
    styleTitle : styleTitle,
    children: ConvertChild(get(detailSalary, "benefit", [])),
    key: "B",
    value : benefit
  };
  const overMonth: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'overMonth',
    title: "Thưởng vượt trên doanh số khoán theo tháng",
    children: ConvertChild(get(detailSalary, "bonus.overMonth", [])),
  };

  const workingBenefit: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'workingBenefit',
    title: `Thưởng theo làm việc hiệu quả (thực tế: ${daysWorking} ngày)`,
    children: ConvertChild(get(detailSalary, "bonus.workingBenefit", [])),
  };
  const cover_pos: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'cover_pos',
    title: `Thưởng đạt Độ phủ thị trường`,
    children: ConvertChild(get(detailSalary, "bonus.cover_pos", [])),
  };
  const exclusive_product: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'exclusive_product',
    title: `Thưởng theo SP độc quyền`,
    children: ConvertChild(get(detailSalary, "bonus.exclusive_product", [])),
  };
  const team: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'team',
    title: `Thưởng TeamLeader`,
    children: ConvertChild(get(detailSalary, "bonus.team", [])),
  };
  const overQuarter: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
    // key : 'overQuarter',
    title: `Thưởng Vượt Doanh số Quý`,
    children: ConvertChild(get(detailSalary, "bonus.overQuarter", [])),
  };
  const overYear: ItemDataSource = {
    styleTitle : styleSubTitle,
    value : undefined,
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
      team,
      overQuarter,
      overYear,
    ],
    key: "C",
    value : bonus
  };

  FOOTER = [
    {
      title: "TỔNG THU NHẬP TRONG THÁNG",
      value: totalSalary,
      key: "FOOTER_1",
      styleTitle : styleFooter,
    },
  ];
  const dataSource: ItemDataSource[] = [A, B, C, ...FOOTER];
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
    rateSelf = 0,
    name,
    rateTarget = 0,
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
    return Math.ceil((value * this.rateTarget) / this.rateSelf);
  }
}


