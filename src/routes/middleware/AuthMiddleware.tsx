import React from "react";
interface AuthMiddlewareProps  {
  children : React.JSX.Element;
  Layout: React.FC<any>; // Specify that Layout is a React component
}

const AuthMiddleware = ({
  children,
  Layout,
}: AuthMiddlewareProps) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default AuthMiddleware;
