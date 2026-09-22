import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmployeePortalUsers } from "../../Services/superAdminService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function HRAdmins() {
  const navigate = useNavigate();
  const [hr, setHR] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHR = async () => {
      try {
        const data = await getEmployeePortalUsers();
        setHR(data.hr || []);
      } catch (requestError) {
        console.error("Failed to load HR users:", requestError);
        setError(requestError.response?.data?.message || "Failed to load HR users.");
      } finally {
        setLoading(false);
      }
    };

    loadHR();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading HR administrators..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">HR Administrators</h1>
          <p className="mt-1 text-gray-500">Manage HR administrator accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/superadmin/hr/add")}
          className="rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white hover:bg-sky-700"
        >
          Add HR Admin
        </button>
      </div>

      {error && (
        <div className="mx-auto mb-5 max-w-6xl rounded-md bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {!error && hr.length === 0 && (
        <div className="mx-auto max-w-6xl rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500">No HR administrators found.</p>
        </div>
      )}

      {hr.length > 0 && (
        <div className="mx-auto max-w-6xl overflow-x-auto rounded-xl bg-white shadow">
          <div className="grid min-w-[650px] grid-cols-5 gap-4 bg-gray-800 px-6 py-4 font-semibold text-white">
            <div>Name</div>
            <div>Username</div>
            <div>Email</div>
            <div>Role</div>
            <div className="text-right">Action</div>
          </div>

          {hr.map((hrUser) => (
            <div
              key={hrUser._id}
              className="grid min-w-[650px] grid-cols-5 items-center gap-4 border-b px-6 py-5 last:border-b-0 hover:bg-gray-50"
            >
              <div className="font-semibold text-gray-800">{hrUser.name}</div>
              <div className="break-words text-gray-600">{hrUser.username || "N/A"}</div>
              <div className="break-words text-gray-600">{hrUser.email}</div>
              <div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">
                  {hrUser.role || "HRAdmin"}
                </span>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate(`/superadmin/hr/${hrUser._id}`)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  View Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HRAdmins;
