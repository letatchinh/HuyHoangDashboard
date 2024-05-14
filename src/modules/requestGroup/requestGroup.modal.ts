import { STATUS_REQUEST_GROUP } from "./constants"

export type TypeProps = {
    
}

export const enumRef = {
    partner: 'partner',
    staff: 'staff',
    employee: 'employee',
}

  interface historyItem {
    editorById: string,
    editorBy: string,
    editorRef: keyof typeof enumRef,
    timestamp: Date
}
interface resultChange {
    groupId: string,
    group : string,
    groupRef: keyof typeof enumRef
}

export interface RequestChangeGroupModalBase {
    requestOfId: string,
    requestRef: keyof typeof enumRef,
    contentRequest: string,
    status: keyof typeof STATUS_REQUEST_GROUP,
    historyStatus: Partial<{
        [STATUS_REQUEST_GROUP.NEW]: historyItem,
        [STATUS_REQUEST_GROUP.PROCESSING]: historyItem,
        [STATUS_REQUEST_GROUP.COMPLETED]: historyItem,
        [STATUS_REQUEST_GROUP.CANCELLED]: historyItem,
    }>,
    resultChange?:Partial<{
        before:resultChange,
        after:resultChange,
    }>
    createdAt: Date,
    updatedAt: Date,
}
export type RequestGroupSubmitType = Pick<RequestChangeGroupModalBase, "status" | "contentRequest" | "requestOfId" >;
export type ResultChangeType = Pick<RequestChangeGroupModalBase,"resultChange">;
    export type ChangeGroupSubmitType = {
        _id : any,
        isRequestTeam : boolean,
        before:resultChange,
        after:resultChange,

    }