import { useEffect, useState } from "react";

function HRProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load HR profile:", error);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Profile information is unavailable.</p>
      </div>
    );
  }

  const name = user.name || user.username || "HR Admin";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          View your HR administrator account information.
        </p>
      </div>

      <div className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 sm:flex-row">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-3xl font-bold text-sky-700">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800">{name}</h2>
            <p className="mt-1 text-sm text-sky-600">
              {user.role || "HRAdmin"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Account Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ProfileItem label="Name" value={name} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Username" value={user.username} />
            <ProfileItem label="Role" value={user.role || "HRAdmin"} />
            <ProfileItem label="User ID" value={user.id} />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-sky-100 bg-sky-50 p-4">
          <h3 className="font-semibold text-sky-800">Portal Access</h3>
          <p className="mt-1 text-sm text-sky-700">
            Your account has access to HR administration features.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words font-medium text-slate-800">
        {value || "Not available"}
      </p>
    </div>
  );
}

export default HRProfile;
