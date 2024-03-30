export type TypeProps = {
    
}
export type SearchByType = "date" | "month" | "quarter" | "year"

export type FormFieldSearch = {
    startDate?: any,
    endDate?: any,
    searchBy?: SearchByType,
  }