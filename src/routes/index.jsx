import { createBrowserRouter } from "react-router-dom";

import PrivateRoutes from "@/components/layout/privateRoutes";

import LoginPage from "@/pages/auth/login";
import NewWarrantyPage from "@/pages/extendedWarranty/new";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/extended-warranty/new",
    element: <NewWarrantyPage />,
  },
]);

export default routes;
