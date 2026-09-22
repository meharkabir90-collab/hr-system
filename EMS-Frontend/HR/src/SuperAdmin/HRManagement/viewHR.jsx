import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeePortalUsers } from "../../Services/superAdminService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function ViewHR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hrUser, setHRUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHRUser = async () => {
      try {
        const data = await getEmployeePortalUsers();
        const selectedHR = (data.hr || []).find((user) => user._id === id);

        if (!selectedHR) {
          setError("HR user not found.");
          return;
        }

        setHRUser(selectedHR);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load HR information.");
      } finally {
        setLoading(false);
      }
    };

    loadHRUser();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading HR information..." />;
  }

  if (error || !hrUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          type="button"
          onClick={() => navigate("/superadmin/hr-portal")}
          className="mb-5 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </button>
        <p className="rounded-md bg-red-100 p-4 text-red-700">{error || "HR user not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/superadmin/hr-portal")}
          className="mb-5 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Back
        </button>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center gap-4 border-b border-gray-200 pb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-2xl font-bold text-sky-700">
              {hrUser.name?.charAt(0).toUpperCase() || "H"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{hrUser.name}</h1>
              <p className="text-sky-600">{hrUser.role || "HRAdmin"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem label="Name" value={hrUser.name} />
            <InfoItem label="Username" value={hrUser.username} />
            <InfoItem label="Email" value={hrUser.email} />
            <InfoItem label="Role" value={hrUser.role || "HRAdmin"} />
            <InfoItem label="User ID" value={hrUser._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 break-words font-medium text-gray-800">{value || "Not available"}</p>
    </div>
  );
}

export default ViewHR;