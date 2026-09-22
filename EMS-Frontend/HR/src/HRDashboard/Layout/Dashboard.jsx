import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../Header";

import {
  NavDesktop,
  NavMobile,
} from "../Components/Dashboard/Sidebar";

import { navData } from "../Components/Dashboard/HRSideNav";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Desktop Sidebar */}
      <NavDesktop
        data={navData}
      />

      {/* Mobile Sidebar */}
      <NavMobile
        data={navData}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Area */}
      <div className="lg:ml-64">

        {/* Header */}
        <Header
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Current Page */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;