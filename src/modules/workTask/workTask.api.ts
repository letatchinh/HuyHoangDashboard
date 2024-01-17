import { get, pick } from "lodash";
import requester from "~/api/requester";

const apis = {

    //GET
    getAll: (query?: any) => requester.get(`/api/v1/task-item`, query),
    getById: (id?: any) => requester.get(`/api/v1/task-item/${id}`),
    getRelationTask: (taskId: any) => requester.get(`/api/v1/relation-task-item/${taskId}`),
    getHistoryTaskById: (id: any) => requester.get(`/api/v1/history-todo-task/${id}`),
    searchTaskByBoardId: ({ boardId, keyword, taskId }: any) => requester.post(`/api/v1/search-board-task-item/${boardId}`, { keyword, taskId }),
    getAllManagersByIdBoard: (id: any) => requester.get(`/api/v1/auth-todo-list-role-admin/${id}`),

    //CREATE
    create: (data?: any) => requester.post(`/api/v1/task-item`, data),
    update: (data?: any) => requester.put(`/api/v1/task-item/${get(data, '_id')}`, data),
    copyTask: ({ id, ...data }: any) => requester.post(`/task-item-copy/${id}`, data),
    
    //UPDATE
    pushComment: ({ taskId, content }: any) => requester.post(`/api/v1/process-add-comment-task-item/${taskId}`, { content }),
    pushEmotion: ({ taskId, user, commentId }: any) => requester.put(`/api/v1/process-emotion-comment-task-item/${taskId}?commentId=${commentId}`, user),
    updateRelationTask: (body: any) => requester.put(`/api/v1/update-relation-task-item/${body.taskItemId}`, pick(body, ['typeRequest', 'taskId'])),
    updateTask: ({ id, ...data }: any) => requester.put(`/api/v1/task-item/${id}`, data),
    updateCommentById: ({ taskId, content, commentId }: any) => requester.put(`/api/v1/process-update-comment-task-item/${taskId}?commentId=${commentId}`, { content }),
    updateProgressTask: ({ id, ...data }: any) => requester.put(`/api/v1/task-item-progress/${id}`, data),
    
    //DELETE
    delete: (id?: any) => requester.delete(`/api/v1/task-item/${id}`),
    deleteComment: ({ taskId, commentId }: any) => requester.delete(`/api/v1/process-delete-comment-task-item/${taskId}?commentId=${commentId}`),

};
export default apis;
