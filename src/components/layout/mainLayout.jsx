import { Outlet } from "react-router-dom";

import Footer from "./footer";
import Navigation from "./navigation";
import TopSection from "./topSection";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopSection />
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
