export type TypeProps = {
    
}
export type ContentSrcType = {
    document : string;
    video : string;
    html : string;
}
export interface ScheduleItemBase extends WithTimeStamp,WithId,WithStatus {
    name: string;
    searchText: Array<Lowercase<string>>;
    slug?: string; 
    scheduleId : string;
    contentType : "document" | "video" | "html";
    contentSrc : ContentSrcType;
    contentSrcOfficial : ContentSrcType;
    
}