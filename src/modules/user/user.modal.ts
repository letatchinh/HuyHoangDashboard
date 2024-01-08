export interface UserResponseOne {
  "_id": string,
  "fullName": string,
  "phoneNumber": string,
  "email": string,
  "status": "ACTIVE" | "INACTIVE",
  "branchId": number,
  "gender": "M" | "F",
  "createdAt"?: string | Date,
  "updatedAt"?: string | Date,
  "deletedAt"?: string | Date,
  "__v"?: number,
  "address"?:{
      "wardId": string,
      "districtId": string,
      "cityId": string,
      "street":string
  },
  "adapater"?: {
      "_id": string,
      "groups"?: any[],
      "managementArea"?: any[],
      "userId": string,
      "user"?: {
          "username": string,
          "isActive": boolean,
          "isSuperAdmin": boolean
      }
  }

};