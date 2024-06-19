import { compact, get, split } from "lodash";
import requester from "~/api/requester";

const compactAndSplit = (data?: string) =>
    compact(split(data, ",")) as string[];
  
const convertParam = (data: { [key: string]: any }) => {
    return {
      ...data,
      getByRanger: data.getByRanger,
    //   sellerId: [...compactAndSplit(data.sellerId)],
      rangerTime: data.rangerTime ? [...compactAndSplit(data.rangerTime)]: null,
      rangerType: data.rangerType,
      productId: [...compactAndSplit(data.productId)],
    };
  };
  
const apis = {
    getAll: (query?: any) => requester.post(`/api/v1/report-of-team-tdv-bill-and-debt`, convertParam(query)),
    getProducts: (query?: any) => requester.post(`/api/v1/report-of-team-tdv-product`, convertParam(query)),
    getById: (id?: any) => requester.get(`/api/v1/reportGroupEmployeeSeller/${id}`),
    create: (data?: any) => requester.post(`/api/v1/reportGroupEmployeeSeller`, data),
    update: (data?: any) => requester.put(`/api/v1/reportGroupEmployeeSeller/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportGroupEmployeeSeller/${id}`),
}
export default apis;
