import { concat, forIn, get } from "lodash";
import { PoliciesType, ResourceType } from "./policy.modal";


const staff = "staff";
const staffGroup = "staffGroup";
const RESOURCES = [
  staff,
  staffGroup
];

const READ = "read";
const WRITE = "write";
const UPDATE = "update";
const DELETE = "delete";
const DOWNLOAD = "download";
const ADMIN = "admin";

export const ACTIONS = [READ, WRITE, UPDATE, DELETE, DOWNLOAD, ADMIN];

const POLICIES: PoliciesType = RESOURCES?.reduce((policies, resource) => {
  const policy = ACTIONS.reduce(
    (actions, action) => ({
      ...actions,
      [`${action.toUpperCase()}_${resource.toUpperCase()}`]: [resource, action],
    }),
    {
      [resource.toUpperCase()]: [resource],
    }
  );

  return {
    ...policies,
    ...policy,
  };
}, {} as PoliciesType);

export default POLICIES;

const RESOURCE = (): ResourceType => {
  const AUTH : string[]= [
    staff,
    staffGroup
  ]
  return {
    AUTH
  }
};

/**
 *
 * @param {String} action CORE_ACTION [READ, WRITE, UPDATE, DELETE]
 * @returns {Array} [POLICIES.action_resources]
 */
export const GROUP_POLICY: any = (action: any): void => {
  return forIn(RESOURCE(), (value, key, object: any) => {
    object[key] = [];
    value.forEach((keyPermission: string | undefined) => {
      if (keyPermission) {
        object[key].push(
          get(POLICIES, `${action}_${keyPermission.toUpperCase()}`)
        );
      }
    });
    // }
  });
};
export const CORE_ACTION = {
  READ: "READ",
  WRITE: "WRITE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ADMIN: "ADMIN",
  DOWNLOAD: "DOWNLOAD",
};
export const CORE_ACTION_LOWER = {
  read: 'read',
  write: 'write',
  update: 'update',
  delete: 'delete',
  admin: 'admin',
  download: 'download',
}

export const CORE_ACTION_VI :any = {
  READ: 'Đọc',
  WRITE: 'Thêm mới',
  UPDATE: 'Chỉnh sửa',
  DELETE: 'Xoá',
  DOWNLOAD: 'Tải về',
  ADMIN: 'Quản trị',
};

export const ACTION = Object.keys(CORE_ACTION_VI).map((key) => ({
  key,
  name : CORE_ACTION_VI[key]
}));