export type TypeProps = {
    
};
export type ResourceType = {
  GROUP_USER: string[],
  GROUP_EMPLOYEE: string[],
  GROUP_WHBILL: string[],
  GROUP_WHSETTING: string[]
  GROUP_WORK_MANAGERMENT: string[],
};

export type policyType = 'write' | 'read' | 'update' | 'delete' | 'download' | 'admin';

export type PoliciesType = {
  [key in
  //BRANCH
  "READ_BRANCH" |
  "WRITE_BRANCH" |
  "UPDATE_BRANCH" |
  "DELETE_BRANCH" |
  "DOWNLOAD_BRANCH" |
  "ADMIN_BRANCH" |
  "BRANCH" |
  //EMPLOYEE
  "READ_EMPLOYEE" |
  "WRITE_EMPLOYEE" |
  "UPDATE_EMPLOYEE" |
  "DELETE_EMPLOYEE" |
  "DOWNLOAD_EMPLOYEE" |
  "ADMIN_EMPLOYEE" |
  "EMPLOYEE" |
  //USER
  "READ_USER" |
  "WRITE_USER" |
  "UPDATE_USER" |
  "DELETE_USER" |
  "DOWNLOAD_USER" |
  "ADMIN_USER" |
  "USER" |
  //USERGROUP
  "READ_USERGROUP" |
  "WRITE_USERGROUP" |
  "UPDATE_USERGROUP" |
  "DELETE_USERGROUP" |
  "DOWNLOAD_USERGROUP" |
  "ADMIN_USERGROUP" |
  "USERGROUP" | 
  
  //WORK_MANAGERMENT
  'READ_WORKMANAGERMENT' |
  'WRITE_WORKMANAGERMENT' |
  'UPDATE_WORKMANAGERMENT' |
  'DELETE_WORKMANAGERMENT' |
  'DOWNLOAD_WORKMANAGERMENT' |
  'ADMIN_WORKMANAGERMENT' 
  ]: [string, policyType];
};
