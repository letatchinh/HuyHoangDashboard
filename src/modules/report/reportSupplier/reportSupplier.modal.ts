export type TypeProps = {
    
}
export type SearchByType = "date" | "month" | "quarter" | "year"

export type FormFieldSearch = {
    startDate?: any,
    endDate?: any,
    searchBy?: SearchByType,
  }

export type BonusOtherType = {
  value : number,
  content : string,
  mathMethod : 1 | -1
}