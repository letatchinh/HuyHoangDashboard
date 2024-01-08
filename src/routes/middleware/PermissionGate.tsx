import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useMatchPolicy } from '~/modules/policy/policy.hook';

const RedirectTo = ({ path }: any) => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(path, { state: { from: window.location.pathname } });
  }, [navigate, path]);
  return null;
};

const PermissionGate = ({ component: Component, permission, ...rest }: any) => {
  const isMatchPolicy = useMatchPolicy(permission);

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (!isMatchPolicy) {
          return <RedirectTo path="/" {...props} />;
        };
        return <Component {...props} />;
      }}
    />
  );
};

export default PermissionGate;
