import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/mainLayout";
import PrivateRoutes from "@/components/layout/privateRoutes";

import JwtLogin from "@/pages/auth/jwt";
import LoginPage from "@/pages/auth/login";
import FormsListPage from "@/pages/forms";
import EditFormPage from "@/pages/forms/editForm";
import NewFormPage from "@/pages/forms/newForm";
import RequestsListPage from "@/pages/requests";
import NewRequestPage from "@/pages/requests/new";
import RequestDetailPage from "@/pages/requests/requestDetailPage";
import TechnicalServicePage from "@/pages/technical-service";
import UsersPage from "@/pages/users";

const routes = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/login/jwt", element: <JwtLogin /> },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <RequestsListPage /> },
          { path: "/requests", element: <RequestsListPage /> },
          { path: "/forms", element: <FormsListPage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/technical-services", element: <TechnicalServicePage /> },
        ],
      },
      { path: "/forms/new", element: <NewFormPage /> },
      { path: "/forms/edit/:id", element: <EditFormPage /> },
      { path: "/requests/:id", element: <RequestDetailPage /> },
      { path: "/requests/new", element: <NewRequestPage /> },
    ],
  },
]);

export default routes;
