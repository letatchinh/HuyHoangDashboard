import { UserInterface } from "../staff/staff.modal";

export type TypeProps = {
    
}

export interface TeacherBase extends UserInterface {
    portfolio: string[]; 
    rating: number;
}