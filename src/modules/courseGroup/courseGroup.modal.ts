export type TypeProps = {
    
}

export interface CourseGroupBase extends WithTimeStamp,WithId,WithStatus {
        name: string;
        searchText: Array<Lowercase<string>>;
        slug?: string; 
}