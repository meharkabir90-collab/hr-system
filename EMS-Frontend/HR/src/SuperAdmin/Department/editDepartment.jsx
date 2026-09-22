import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getDepartmentById,
  updateDepartment,
} from "../../Services/departmentService";

function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const departmentsPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/departments"
    : "/hr/departments";

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await getDepartmentById(id);
        setFormData({
          name: response.department?.name || "",
          description: response.department?.description || "",
        });
      } catch (fetchError) {
        console.error("Get department error:", fetchError);
        setError(fetchError.response?.data?.message || "Failed to load department");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      const response = await updateDepartment(id, formData);
      alert(response.message || "Department updated successfully");
      navigate(departmentsPath);
    } catch (submitError) {
      console.error("Update department error:", submitError);
      alert(submitError.response?.data?.message || "Failed to update department");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading department...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => navigate(departmentsPath)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Department</h1>
        <p className="text-gray-500 mt-1">Update department information.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-3 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-3 text-black"
              rows="4"
              maxLength="200"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(departmentsPath)}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDepartment;
