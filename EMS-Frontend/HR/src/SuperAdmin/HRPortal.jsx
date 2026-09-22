import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  startImpersonation,
  exitImpersonation,
  isImpersonating,
  startHRView,
  getEmployeePortalUsers,
} from "../Services/superAdminService";

const HRPortal = () => {
  const [hr, setHR] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadHR = async () => {
      try {
        const data = await getEmployeePortalUsers();

        if (data?.success) {
          setHR(data.hr || []);
        }
      } catch (error) {
        console.error("Failed to load HR users:", error);
      }
    };

    loadHR();
  }, []);

  const handleHRClick = async (hrUser) => {
    setError("");
    setLoadingId(hrUser._id);

    try {
      const response = await startHRView(hrUser._id);

      if (!response?.success) {
        setError("Could not open this HR portal. Please try again.");
        return;
      }

      startImpersonation(response.token, hrUser.name || "HR Admin", {
        id: hrUser._id,
        name: hrUser.name,
        username: hrUser.username,
        email: hrUser.email,
        role: "HRAdmin",
      });
      navigate("/hr/dashboard");
    } catch (requestError) {
      console.error("Failed to open HR portal:", requestError);
      setError("Could not open this HR portal. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = () => {
    if (isImpersonating()) {
      exitImpersonation();
      window.location.href = "/superadmin/dashboard";
      return;
    }

    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">HR Portal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Select an HR admin to access their portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/superadmin/hr/add")}
            className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Add HR Admin
          </button>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">HR</h2>

          <p className="text-sm text-slate-500">
            {hr.length} HR available
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {hr.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hr.map((hrUser) => (
              <button
                key={hrUser._id}
                type="button"
                onClick={() => handleHRClick(hrUser)}
                disabled={loadingId === hrUser._id}
                className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl">
                  👤
                </div>
                <h3 className="font-semibold text-slate-800">{hrUser.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{hrUser.email}</p>
                <p className="mt-3 text-xs font-medium text-sky-600">
                  {loadingId === hrUser._id ? "Opening HR Portal..." : "Open HR Portal ->"}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No HR users found.</p>
        )}
      </div>
    </div>
  );
};

export default HRPortal;
