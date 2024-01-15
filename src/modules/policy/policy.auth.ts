// import { userGroup } from '~/modules/userGroup';
import { concat, forIn, get } from 'lodash';
import { PoliciesType, ResourceType } from './policy.modal';

const branch = 'branch';
const company = 'company';
const employee = 'employee';
const user = 'user';
const userGroup = 'userGroup';
const pharmacy = 'pharmacy';
const bill = 'bill';
const configDiscount = 'configDiscount';

const RESOURCES = [
  //Setting
  configDiscount,

  //User
  branch,
  // company,
  // employee,
  user,
  userGroup,


  // pharmacy,
  // bill,
];

//ACTIONS
const READ = 'read';
const WRITE = 'write';
const UPDATE = 'update';
const DELETE = 'delete';
const DOWNLOAD = 'download';
const ADMIN = 'admin';


export const ACTIONS = [READ, WRITE, UPDATE, DELETE, DOWNLOAD, ADMIN];


const POLICIES : PoliciesType = RESOURCES.reduce((policies, resource) => {
  const policy = ACTIONS.reduce(
    (actions, action) => ({
      ...actions,
      [`${action.toUpperCase()}_${resource.toUpperCase()}`]: [resource, action]
    }),
    {
      [resource.toUpperCase()]: [resource]
    }
  );

  return {
    ...policies,
    ...policy
  };
}, {} as PoliciesType);

export default POLICIES;
const RESOURCE = (): ResourceType => {
  const GROUP_WHSETTING: string[] = [
    configDiscount,
  ];
  
  const GROUP_USER : string[] = [
    user,
    userGroup
  ];
  const GROUP_WHBILL: string[] = [
    bill
  ];
  const GROUP_EMPLOYEE : string[] = [
    employee
  ];

  return {
    GROUP_USER,
    GROUP_EMPLOYEE,
    GROUP_WHBILL,
    GROUP_WHSETTING,
  };
};

/**
 *
 * @param {String} action CORE_ACTION [READ, WRITE, UPDATE, DELETE]
 * @returns {Array} [POLICIES.action_resources]
 */
export const GROUP_POLICY : any = (action: any): void => {
  forIn(RESOURCE(), (value, key, object : any) => {
    object[key] = [];
    if (Array.isArray(value)) {
      value.forEach((keyPermission: string | undefined) => {
        if (keyPermission) {
          object[key].push(
            get(POLICIES, `${action}_${keyPermission.toUpperCase()}`)
          );
        }
      });
    }
  });
};

export const CORE_ACTION = {
  READ: 'READ',
  WRITE: 'WRITE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ADMIN: 'ADMIN',
  DOWNLOAD: 'DOWNLOAD',
};

