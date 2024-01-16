import { get, pick } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/task-item`, query),
    getById: (id?: any) => requester.get(`/api/v1/task-item/${id}`),
    create: (data?: any) => requester.post(`/api/v1/task-item`, data),
    update: (data?: any) => requester.put(`/api/v1/task-item/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/task-item/${id}`),
    copyTask: ({id,...data}:any) => requester.post(`/task-item-copy/${id}`,data),
    pushComment:({taskId,content}:any)=> requester.post(`/process-add-comment-task-item/${taskId}`,{content}),
    pushEmotion:({taskId,user,commentId}:any)=> requester.put(`/process-emotion-comment-task-item/${taskId}?commentId=${commentId}`,user),
    updateRelationTask: (body:any) => requester.put(`/update-relation-task-item/${body.taskItemId}`,pick(body,['typeRequest','taskId'])),
    updateTask: ({ id, ...data }: any) => requester.put(`/task-item/${id}`, data),
    updateCommentById: ({ taskId, content, commentId }: any) => requester.put(`/process-update-comment-task-item/${taskId}?commentId=${commentId}`, { content }),
    updateProgressTask: ({id,...data}: any) => requester.put(`/task-item-progress/${id}`, data),
    
    //DELETE
    deleteComment:({taskId,commentId}:any)=> requester.delete(`/process-delete-comment-task-item/${taskId}?commentId=${commentId}`),

}
export default apis;
