import React from 'react';
import { useMatchPolicy } from '~/modules/policy/policy.hook';

interface WithPermissionProps {
  children: React.ReactNode;
  permission: string | any;
}
const WithPermission = ({ children, permission }: WithPermissionProps) => {
  const isMatchPolicy = useMatchPolicy(permission);
  return <>{isMatchPolicy && children}</>;
};

export default WithPermission;
