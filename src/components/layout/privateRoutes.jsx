import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  let isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
