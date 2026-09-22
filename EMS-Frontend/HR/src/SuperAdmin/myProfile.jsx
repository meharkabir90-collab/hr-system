import { useEffect, useState } from "react";

const SuperAdminProfile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      try {

        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);

      } catch (error) {

        console.error("Failed to load SuperAdmin profile:", error);

      }

    }

  }, []);


  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }


  const userName =
    user?.name ||
    user?.username ||
    "SuperAdmin";

  const userEmail =
    user?.email ||
    user?.username ||
    "No email available";

  const userRole =
    user?.role ||
    "SuperAdmin";

  const avatarLetter =
    userName.charAt(0).toUpperCase();


  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your SuperAdmin account information.
        </p>

      </div>


      {/* =========================
          PROFILE CARD
      ========================== */}

      <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        {/* Profile Header */}

        <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row">

          {/* Avatar */}

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-bold text-sky-700">

            {avatarLetter}

          </div>


          {/* Name + Role */}

          <div className="text-center sm:text-left">

            <h2 className="text-xl font-bold text-slate-800">
              {userName}
            </h2>

            <p className="mt-1 text-sm text-sky-600">
              {userRole}
            </p>

          </div>

        </div>


        {/* =========================
            ACCOUNT INFORMATION
        ========================== */}

        <div className="mt-6">

          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Account Information
          </h3>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">


            {/* Name */}

            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {userName}
              </p>

            </div>


            {/* Email */}

            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 break-words font-medium text-slate-800">
                {userEmail}
              </p>

            </div>


            {/* Username */}

            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Username
              </p>

              <p className="mt-1 break-words font-medium text-slate-800">
                {user?.username || "Not available"}
              </p>

            </div>


            {/* Role */}

            <div className="rounded-lg bg-slate-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Role
              </p>

              <p className="mt-1 font-medium text-sky-600">
                {userRole}
              </p>

            </div>


          </div>

        </div>


        {/* =========================
            ACCESS INFORMATION
        ========================== */}

        <div className="mt-6 rounded-lg border border-sky-100 bg-sky-50 p-4">

          <h3 className="font-semibold text-sky-800">
            Portal Access
          </h3>

          <p className="mt-1 text-sm text-sky-700">
            As a SuperAdmin, you have administrative access to the
            HR Management System and can access Employee, Manager,
            and HR portals.
          </p>

        </div>

      </div>

    </div>
  );
};

export default SuperAdminProfile;
