export type TypeProps = {
    
};
export type ResourceType = {
  GROUP_USER: string[],
  GROUP_EMPLOYEE: string[],
  GROUP_WHBILL: string[],
  GROUP_WHSETTING:  string[]
  GROUP_MANUFACTURER: string[],
  UNIT: string[],
  GROUP_PRODUCTGROUP: string[],
  GROUP_RANKING: string[],
  MEDICINE: string[]
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
  //MANUFACTURER
  "READ_MANUFACTURER" |
  "WRITE_MANUFACTURER" |
  "UPDATE_MANUFACTURER" |
  "DELETE_MANUFACTURER" |
  "DOWNLOAD_MANUFACTURER" |
  "ADMIN_MANUFACTURER" |
  "MANUFACTURER"|
  //UNIT
  "READ_UNIT" |
  "WRITE_UNIT" |
  "UPDATE_UNIT" |
  "DELETE_UNIT" |
  "DOWNLOAD_UNIT" |
  "ADMIN_UNIT" |
  "UNIT"|
  //PRODUCTGROUP
  "READ_PRODUCTGROUP" |
  "WRITE_PRODUCTGROUP" |
  "UPDATE_PRODUCTGROUP" |
  "DELETE_PRODUCTGROUP" |
  "DOWNLOAD_PRODUCTGROUP" |
  "ADMIN_PRODUCTGROUP" |
  "PRODUCTGROUP"|
  //RANKING
  "READ_RANKING" |
  "WRITE_RANKING" |
  "UPDATE_RANKING" |
  "DELETE_RANKING" |
  "DOWNLOAD_RANKING" |
  "ADMIN_RANKING" |
  "RANKING"|
  //MEDICINE
  "READ_MEDICINE" |
  "WRITE_MEDICINE" |
  "UPDATE_MEDICINE" |
  "DELETE_MEDICINE" |
  "DOWNLOAD_MEDICINE" |
  "ADMIN_MEDICINE" |
  "MEDICINE"
  ]: [string, policyType];
};