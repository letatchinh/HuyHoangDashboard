import { compact, get, split } from "lodash";
import requester from "~/api/requester";

const compactAndSplit = (data?: string) =>
    compact(split(data, ",")) as string[];
  
const convertParam = (data: { [key: string]: any }) => {
    return {
      ...data,
      getByRanger: data.getByRanger,
      sellerId: [...compactAndSplit(data.sellerId)],
      rangerTime: data.rangerTime ? [...compactAndSplit(data.rangerTime)]: null,
      rangerType: data.rangerType,
      productId: [...compactAndSplit(data.productId)],
    };
  };
const apis = {
    getAll: (data?: any) => requester.post(`/api/v1/report-of-team-ctv-bill-and-debt`, convertParam(data)),
    getAllBill: (data?: any) => requester.post(`/api/v1/report-of-team-ctv-product`, convertParam(data)),
    getById: (id?: any) => requester.get(`/api/v1/reportGroup/${id}`),
    create: (data?: any) => requester.post(`/api/v1/reportGroup`, data),
    update: (data?: any) => requester.put(`/api/v1/reportGroup/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportGroup/${id}`),
}
export default apis;
