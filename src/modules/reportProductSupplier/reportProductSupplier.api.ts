import { compact, get, split } from "lodash";
import requester from "~/api/requester";
const compactAndSplit = (data?: string) =>
  compact(split(data, ",")) as string[];

const convertParam = (data: { [key: string]: any }) => {
  return {
    ...data,
    supplierId: [...compactAndSplit(data.supplierId)],
    customerId: [...compactAndSplit(data.customerId)],
    productId: [...compactAndSplit(data.productId)],
    cityId: [...compactAndSplit(data.cityId)],
    areaId: [...compactAndSplit(data.areaId)],
    salerId: [...compactAndSplit(data.salerId)],
    rangerTime: data.rangerTime ? [...compactAndSplit(data.rangerTime)]: null,
    rangerType: data.rangerType ? [...compactAndSplit(data.rangerType)]: null,
    reportSize: Number(data?.reportSize ?? 10),
    page: Number.isFinite(data?.page) ? Number(data?.page):1,
    limit: Number(data?.limit ?? 10),
  };
};
const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/reportProductSupplier`, query),
    getById: (id?: any) => requester.get(`/api/v1/reportProductSupplier/${id}`),
    getListChart: (data?: any) => requester.post(`/api/v1/report-product`, convertParam(data)),
    getListData: (data?: any) => requester.post(`/api/v1/report-product-table`, convertParam(data)),
    update: (data?: any) => requester.put(`/api/v1/reportProductSupplier/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/reportProductSupplier/${id}`),
}
export default apis;
