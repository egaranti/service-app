import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/mainLayout";

import LoginPage from "@/pages/auth/login";
import FormsListPage from "@/pages/forms";
import EditFormPage from "@/pages/forms/editForm";
import NewFormPage from "@/pages/forms/newForm";
import RequestsListPage from "@/pages/requests";
import NewRequestPage from "@/pages/requests/new";
import RequestDetailPage from "@/pages/requests/requestDetailPage";

const routes = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/requests", element: <RequestsListPage /> },
      { path: "/forms", element: <FormsListPage /> },
    ],
  },
  { path: "/forms/new", element: <NewFormPage /> },
  { path: "/forms/edit/:id", element: <EditFormPage /> },
  { path: "/requests/:id", element: <RequestDetailPage /> },
  { path: "/requests/new", element: <NewRequestPage /> },
]);

export default routes;
