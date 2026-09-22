import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../Header";
import { NavDesktop, NavMobile } from "../Components/Sidebar";
import { navData } from "../Components/employeeSideNav";

import {
  checkIn as checkInService,
  checkOut as checkOutService,
} from "../../Services/attendanceService";

function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // =========================
  // CHECK IN
  // =========================
  const handleCheckIn = async () => {
    try {
      const response = await checkInService();

      console.log("CHECK IN RESPONSE:", response);

      alert(response?.message || "Check-in successful");
    } catch (error) {
      console.error("CHECK IN ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Check-in failed"
      );
    }
  };


  // =========================
  // CHECK OUT
  // =========================
  const handleCheckOut = async () => {
    try {
      const response = await checkOutService();

      console.log("CHECK OUT RESPONSE:", response);

      alert(response?.message || "Check-out successful");
    } catch (error) {
      console.error("CHECK OUT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Check-out failed"
      );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}

      <NavDesktop
        data={navData}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />


      {/* =========================
          MOBILE SIDEBAR
      ========================== */}

      <NavMobile
        data={navData}
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
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

