import { get, pick } from "lodash";
import requester from "~/api/requester";

const apis = {

    //GET
    getAll: (query?: any) => requester.get(`/api/v1/workTask`, query),
    getById: (id?: any) => requester.get(`/api/v1/workTask/${id}`),
    getRelationTask: (taskId:any) => requester.get(`/relation-task-item/${taskId}`),
    getHistoryTaskById: (id: any) => requester.get(`history-todo-task/${id}`),
    searchTaskByBoardId: ({ boardId, keyword, taskId }: any) => requester.post(`/search-board-task-item/${boardId}`, { keyword, taskId }),
    getAllManagersByIdBoard: (id : any) => requester.get(`/auth-todo-list-role-admin/${id}`),
    //CREATE
    create: (data?: any) => requester.post(`/api/v1/workTask`, data),
    copyTask: ({ id, ...data }: any) => requester.post(`/task-item-copy/${id}`, data),

    //UPDATE
    update: (data?: any) => requester.put(`/api/v1/workTask/${get(data,'_id')}`, data),
    pushComment:({taskId,content}:any)=> requester.post(`/process-add-comment-task-item/${taskId}`,{content}),
    pushEmotion:({taskId,user,commentId}:any)=> requester.put(`/process-emotion-comment-task-item/${taskId}?commentId=${commentId}`,user),
    updateRelationTask: (body:any) => requester.put(`/update-relation-task-item/${body.taskItemId}`,pick(body,['typeRequest','taskId'])),
    updateTask: ({ id, ...data }: any) => requester.put(`/task-item/${id}`, data),
    updateCommentById: ({ taskId, content, commentId }: any) => requester.put(`/process-update-comment-task-item/${taskId}?commentId=${commentId}`, { content }),
    updateProgressTask: ({id,...data}: any) => requester.put(`/task-item-progress/${id}`, data),
    
    //DELETE
    delete: (id?: any) => requester.delete(`/api/v1/workTask/${id}`),
    deleteComment:({taskId,commentId}:any)=> requester.delete(`/process-delete-comment-task-item/${taskId}?commentId=${commentId}`),

}
export default apis;
