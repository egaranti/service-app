import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuthStore from "@/stores/useAuthStore";

const PrivateRoutes = () => {
  const { loading, isAuth } = useAuthStore((state) => state);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => await useAuthStore.getState().checkAuth();
    checkAuth();
  }, []);

  if (loading || isAuth) {
    console.log(isAuth);
    return loading ? (
      <div className="flex h-screen w-full items-center justify-center">
        <h1>Loading...</h1>
      </div>
    ) : (
      <Outlet />
    );
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoutes;
