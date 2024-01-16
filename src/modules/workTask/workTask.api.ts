import { get, pick } from "lodash";
import requester from "~/api/requester";

const apis = {
    getAll: (query?: any) => requester.get(`/api/v1/task-item`, query),
    
    getById: (id?: any) => requester.get(`/api/v1/task-item/${id}`),
    create: (data?: any) =>{
        console.log(data)
       return requester.post(`/api/v1/task-item`, data)
    },
    update: (data?: any) => requester.put(`/api/v1/task-item/${get(data,'_id')}`, data),
    delete: (id?: any) => requester.delete(`/api/v1/task-item/${id}`),
    copyTask: ({id,...data}:any) => requester.post(`/task-item-copy/${id}`,data),
    pushComment:({taskId,content}:any)=> requester.post(`/process-add-comment-task-item/${taskId}`,{content}),
    pushEmotion:({taskId,user,commentId}:any)=> requester.put(`/process-emotion-comment-task-item/${taskId}?commentId=${commentId}`,user),
    deleteComment:({taskId,commentId}:any)=> requester.delete(`/process-delete-comment-task-item/${taskId}?commentId=${commentId}`),
    updateCommentById:({taskId,content,commentId}:any)=> requester.put(`/process-update-comment-task-item/${taskId}?commentId=${commentId}`,{content}),
    getHistoryTaskById: (id:any) => requester.get(`history-todo-task/${id}`),
    searchTaskByBoardId:({boardId,keyword,taskId}:any)=> requester.post(`/search-board-task-item/${boardId}`,{keyword,taskId}),
    getRelationTask: (taskId:any) => requester.get(`/relation-task-item/${taskId}`),
    //taskId in body main task relation with task current
    updateRelationTask: (body:any) => requester.put(`/update-relation-task-item/${body.taskItemId}`,pick(body,['typeRequest','taskId'])),

}
export default apis;
