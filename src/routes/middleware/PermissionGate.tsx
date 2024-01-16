import React, { useMemo } from "react";
import { Route, Navigate } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
interface PermissionGateProps {
  path?: string;
  component?: any;
  permission?: any;
}

const PermissionGate = ({ component: Component, permission, ...rest }: PermissionGateProps) => {
  const isMatchPolicy = useMatchPolicy(permission);
  const render = useMemo(() => {
    if (isMatchPolicy) {
      return <Component />;
    } else {
      return <Navigate to="/" replace={true} />;
    }
  }, [isMatchPolicy, Component]);

  return <Route {...rest} element={render} />;
};

export default PermissionGate;
