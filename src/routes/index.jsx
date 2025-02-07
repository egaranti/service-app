import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/mainLayout";

import LoginPage from "@/pages/auth/login";
import FormsListPage from "@/pages/forms";
import NewFormPage from "@/pages/forms/newForm";
import RequestsListPage from "@/pages/requests";

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/requests",
        element: <RequestsListPage />,
      },
      {
        path: "/forms",
        element: <FormsListPage />,
      },
    ],
  },
  {
    path: "/forms/new",
    element: <NewFormPage />,
  },
]);

export default routes;
