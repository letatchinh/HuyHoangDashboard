export type TypeProps = {
    
};
export type ResourceType = {
  GROUP_USER: string[]
GROUP_WHBILL:string[]
// GROUP_WHSETTING:
}

export type PoliciesType = {
  // BRANCH
  READ_BRANCH : string[],
  WRITE_BRANCH : string[],
  UPDATE_BRANCH : string[],
  DELETE_BRANCH : string[],
  DOWNLOAD_BRANCH : string[],
  ADMIN_BRANCH : string[],
  BRANCH: string[],

  // USER
  READ_USER : string[],
  WRITE_USER : string[],
  UPDATE_USER : string[],
  DELETE_USER : string[],
  DOWNLOAD_USER : string[],
  ADMIN_USER : string[],
  USER: string[],
  
  // USERGROUP
  READ_USERGROUP : string[],
  WRITE_USERGROUP : string[],
  UPDATE_USERGROUP : string[],
  DELETE_USERGROUP : string[],
  DOWNLOAD_USERGROUP : string[],
  ADMIN_USERGROUP : string[],
  USERGROUP: string[],
  
  // ORTHER
}