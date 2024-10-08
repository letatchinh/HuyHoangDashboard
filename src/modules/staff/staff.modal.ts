export type TypeProps = {
    
}
export interface UserInterface {
  fullName: string;
  phoneNumber: string;
  birthDate?: Date;
  userRole?: string;
  email: string;
  status: 'ACTIVE' | "INACTIVE";
  searchText?: Array<Lowercase<string>>;
  deletedAt?: Date;
  _id : string
};