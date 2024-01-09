import React from 'react';
import { useMatchOrPolicy } from '~/modules/policy/policy.hook';

interface WithOrPermissionProps {
  children: React.ReactNode;
  permission: string[][];
};
const WithOrPermission = ({ children, permission }: WithOrPermissionProps) => {
  const isMatchPolicy = useMatchOrPolicy(permission);
  return <>{isMatchPolicy && children}</>;
};

export default WithOrPermission;
