import { get } from "lodash";
import requester from "~/api/requester";
import { TypeBenefit } from "./benefitConfiguration.modal";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/benefitConfiguration`, query),
    getById: (id?: any) => requester.get(`/api/v1/benefitConfiguration/${id}`),
    getConfigBenefitTable: (type?: TypeBenefit) => requester.get(`/api/v1/report-config-benefit-table/${type}`),
    getConfigBenefitData: (type?: TypeBenefit) => requester.get(`/api/v1/report-config-benefit-data/${type}`),
    getSupplierToAddBenefit: (type?: TypeBenefit) => requester.get(`/api/v1/report-config-benefit-supplier-not-exists/${type}`),
    create: (data?: any) => requester.post(`/api/v1/benefitConfiguration`, data),
    createCondition: (data?: any) => requester.post(`/api/v1/report-condition-create`, data),
    updateCondition: (data?: any) => requester.put(`/api/v1/report-condition-update/${get(data,'_id')}`, data),
    deleteCondition: ({id}:any) => requester.delete(`/api/v1/report-condition-delete/${id}`),
    createBenefit: (data?: any) => requester.post(`/api/v1/report-benefit-create`, data),
    deleteBenefit: ({id}:any) => requester.delete(`/api/v1/report-benefit-delete/${id}`),
    createConfig: (data?: any) => requester.post(`/api/v1/report-config-create`, data),
    updateConfig: (data?: any) => requester.put(`/api/v1/report-config-update/${get(data,'_id')}`, data),

    update: (data?: any) => requester.put(`/api/v1/benefitConfiguration/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/benefitConfiguration/${id}`),
    
}
export default apis;
