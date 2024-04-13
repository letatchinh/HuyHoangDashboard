import React from "react";
import {Navigate } from "react-router-dom";
import { PATH_APP } from "../allPath";
interface RedirectToProps {
  path: string;
}

const RedirectTo = ({ path }: RedirectToProps) => {
  return <Navigate to={path} replace />;
};

interface AuthMiddlewareProps  {
  children : React.JSX.Element;
  Layout: React.FC<any>; // Specify that Layout is a React component
  isAuthProtected?: boolean;
  permissions?: any; // Adjust the type as per your actual permissions structure
}

const AuthMiddleware = ({
  children,
  Layout,
  isAuthProtected,
  permissions,
}: AuthMiddlewareProps) => {
  const isNotLoginYet = false;
  return (
    (isNotLoginYet && isAuthProtected) ? <RedirectTo path={PATH_APP.auth.login}  /> : 
    <Layout>
      {children}
    </Layout>
  );
};

export default AuthMiddleware;
