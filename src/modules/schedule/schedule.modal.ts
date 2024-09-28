import { ScheduleItemBase } from "../scheduleItem/scheduleItem.modal";

export type TypeProps = {
    
}

export interface ScheduleBase extends WithTimeStamp,WithId,WithStatus {
        name: string;
        searchText: Array<Lowercase<string>>;
        slug?: string; 
        courseId: string;
        scheduleItemIds: string[];
        scheduleItem : ScheduleItemBase[]
}