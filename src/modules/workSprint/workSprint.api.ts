import { get, omit } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/board-sprint/${query?.boardId}`,omit(query,['boardId'])),
    getById: (body?: any) => requester.get(`/api/v1/board-sprint-info/${get(body,'_id',get(body,'id',body))}`),
    create: (data?: any) => requester.post(`/api/v1/board-sprint/sprint-create`, data),
    update: (body?: any)=>requester.put(`/api/v1/board-sprint/update/${get(body,'_id',get(body,'id'))}`,body),
    delete: (body: any)=>requester.delete(`/api/v1/board-sprint/delete/${get(body,'_id',get(body,'id',body))}`),
}
export default apis;
