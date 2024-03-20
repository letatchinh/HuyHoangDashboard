import { get } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/board`, query),
    getById: (id?: any) => requester.get(`/api/v1/board/${id}`),
    create: (data?: any) => requester.post(`/api/v1/board`, data),
    update: (data?: any) => requester.put(`/api/v1/board/${get(data,'id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/board/${id}`),
    // 
    getListBoard: (query?:any) => requester.get(`/api/v1/group-board/`),
    //
        getAllManagers: (query?:any) => requester.get(`/api/v1/manager-user-board`,query),
    getAllEmployee: (query?:any) => requester.get(`/api/v1/member-user-board`,query),
    getAllManagersByIdBoard: (id?:any) => requester.get(`/api/v1/auth-todo-list-role-admin/${id}`),
    getAllEmployeeByIdBoard: (id?:any) => requester.get(`/api/v1/auth-todo-list-role-user/${id}`),
}
export default apis;
