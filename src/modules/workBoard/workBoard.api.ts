import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/workBoard`, query),
    getById: (id?: any) => requester.get(`/api/v1/workBoard/${id}`),
    create: (data?: any) => requester.post(`/api/v1/workBoard`, data),
    update: (data?: any) => requester.put(`/api/v1/workBoard/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/workBoard/${id}`),
    // 
    getListBoard: (query?:any) => requester.get(`/api/v1/group-board/`),
    //
        getAllManagers: (query?:any) => requester.get(`/api/v1/manager-user-board`,query),
    getAllEmployee: (query?:any) => requester.get(`/api/v1/member-user-board`,query),
    getAllManagersByIdBoard: (id?:any) => requester.get(`/api/v1/auth-todo-list-role-admin/${id}`),
    getAllEmployeeByIdBoard: (id?:any) => requester.get(`/api/v1/auth-todo-list-role-user/${id}`),
}
export default apis;
