import { TYPE_BENEFIT, TYPE_KPI } from "./constants";

export type TypeProps = {
    
}
export type TypeBenefit = keyof typeof TYPE_BENEFIT;
export type TypeKpi = keyof typeof TYPE_KPI

export interface BenefitType {
    supplierId?: string,
    typeBenefit?: TypeBenefit
    kpiType?: TypeKpi
}
export type TypeOver = 'month' | 'quarter' | 'year';