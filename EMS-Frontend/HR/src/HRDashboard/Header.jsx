import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from "../Services/authService";

function Header({ onMenuClick }) {

  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);


  // =========================
  // GET HR USER
  // =========================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      try {

        const parsedUser = JSON.parse(storedUser);

        console.log("SUPERADMIN HEADER USER:", parsedUser);

        setUser(parsedUser);

      } catch (error) {

        console.error(
          "Failed to parse user:",
          error
        );

      }

    }

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {

    try {

      // Call backend logout API
      await logout();

      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Close dropdown
      setShowProfile(false);

      // Go to login
      navigate("/login");

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

      // Clear authentication even if API fails
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      setShowProfile(false);

      navigate("/login");

    }

  };


  // =========================
  // SUPERADMIN DATA
  // =========================

  const userName =
    user?.name ||
    user?.username ||
    "SuperAdmin";

  const userRole =
    user?.role ||
    "SuperAdmin";

  const userEmail =
    user?.email ||
    user?.username ||
    "";

  const avatarLetter =
    userName.charAt(0).toUpperCase();


  return (

    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white shadow-sm">

      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">


        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}

          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 lg:hidden"
          >
            ☰
          </button>


          {/* Title */}

          <div>

            <h1 className="text-lg font-bold text-sky-700 sm:text-xl">
              HR Portal
            </h1>

            <p className="hidden text-xs text-gray-500 sm:block">
              HR Dashboard
            </p>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="flex items-center gap-3">


          {/* Notification */}

          <button
            className="rounded-full p-2 text-gray-600 transition hover:bg-sky-50 hover:text-sky-600"
          >
            🔔
          </button>


          {/* =========================
              PROFILE
          ========================== */}

          <div className="relative">

            <button
              onClick={() =>
                setShowProfile(!showProfile)
              }
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-sky-50"
            >

              {/* Avatar */}

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">

                {avatarLetter}

              </div>


              {/* User Information */}

              <div className="hidden text-left sm:block">

                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>

                <p className="text-xs text-gray-500">
                  {userRole}
                </p>

              </div>


              {/* Arrow */}

              <span className="text-gray-500">
                ▾
              </span>

            </button>


            {/* =========================
                PROFILE DROPDOWN
            ========================== */}

            {showProfile && (

              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">


                {/* SuperAdmin Info */}

                <div className="border-b border-gray-100 px-3 py-3">

                  <p className="font-semibold text-gray-800">
                    {userName}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {userRole}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {userEmail}
                  </p>

                </div>


                {/* My Profile */}

                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/hr/myprofile");
                  }}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                >
                  My Profile
                </button>


                <div className="my-1 border-t border-gray-100" />


                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;
