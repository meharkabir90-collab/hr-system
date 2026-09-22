import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  startImpersonation,
  exitImpersonation,
  isImpersonating,
  startManagerView,
  getEmployeePortalUsers,
} from "../Services/superAdminService";

const ManagerPortal = () => {
  const [managers, setManagers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const data = await getEmployeePortalUsers();

        if (data?.success) {
          setManagers(data.managers || []);
        }
      } catch (error) {
        console.error("Failed to load managers:", error);
      }
    };

    loadManagers();
  }, []);

  const handleManagerClick = async (manager) => {
    setError("");
    try {
      setLoadingId(manager._id);

      const res = await startManagerView(manager._id);

      if (res?.success) {
        startImpersonation(res.token, manager?.name || manager?.user?.name || "Manager", {
          id: manager?._id,
          name: manager?.name,
          email: manager?.email,
          role: "Manager",
        });
        navigate("/manager/dashboard");
      } else {
        setError("Could not open this manager's portal. Please try again.");
      }
    } catch (error) {
      console.error("Failed to open manager portal:", error);
      setError("Could not open this manager's portal. Please try again.");
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manager Portal</h1>
          <p className="mt-1 text-sm text-slate-500">
            Select a manager to access their portal.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Managers</h2>
          <p className="text-sm text-slate-500">
            {managers.length} managers available
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {managers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {managers.map((manager) => (
              <button
                key={manager._id}
                onClick={() => handleManagerClick(manager)}
                disabled={loadingId === manager._id}
                type="button"
                className="rounded-xl border border-sky-200 bg-sky-50 p-5 text-left transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-2xl">
                  👤
                </div>

                <h3 className="font-semibold text-slate-800">{manager.name}</h3>

                <p className="mt-1 text-sm text-slate-500">{manager.email}</p>

                <p className="mt-3 text-xs font-medium text-sky-600">
                  {loadingId === manager._id
                    ? "Opening Manager Portal..."
                    : "Open Manager Portal →"}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No managers found.</p>
        )}
      </div>
    </div>
  );
};

export default ManagerPortal;
