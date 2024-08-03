export interface BaseData {
    branchId? : number,
    createdAt : string,
    updatedAt : string,
    _id : string
}

export interface ErrorAntBase {
    errors : string[],
    name : string[],
    warning : string[]
}