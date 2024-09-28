export type TypeProps = {
    
}
export interface ScheduleItemBase extends WithTimeStamp,WithId,WithStatus {
    name: string;
    searchText: Array<Lowercase<string>>;
    slug?: string; 
    scheduleId : string;
    contentType : "document" | "video";
    contentSrc : string;
}