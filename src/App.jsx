import { Toaster } from "@egaranti/components";

import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import routes from "./routes";

import { getUserCountry } from "@/services/country";

const App = () => {
  useEffect(() => {
    getUserCountry();
  }, []);

  return (
    <>
      <Toaster />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
