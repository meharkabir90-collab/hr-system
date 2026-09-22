import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../Header";
import { NavDesktop, NavMobile } from "../Components/Sidebar";
import { navData } from "../Components/superAdminSideNav";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}

      <NavDesktop
        data={navData}
      />


      {/* =========================
          MOBILE SIDEBAR
      ========================== */}

      <NavMobile
        data={navData}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />


      {/* =========================
          MAIN AREA
      ========================== */}

      <div className="lg:ml-64">

        {/* Header */}

        <Header
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
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
