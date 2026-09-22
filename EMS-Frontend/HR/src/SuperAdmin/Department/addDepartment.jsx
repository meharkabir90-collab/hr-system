import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createDepartment } from "../../Services/departmentService";
import API from "../../Services/API";

function AddDepartment() {
  const navigate = useNavigate();
  const location = useLocation();
  const departmentsPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/departments"
    : "/hr/departments";

  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
    
  });

  

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
        console.log("DEPARTMENT FORM DATA:", formData);
      const data = await createDepartment(formData);

      alert(data.message || "Department created successfully");

      navigate(departmentsPath);

    } catch (error) {
      console.error("Create department error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to create department"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">

        <button
          onClick={() => navigate(departmentsPath)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Add Department
        </h1>

        <p className="text-gray-500 mt-1">
          Create Department and Information
        </p>

      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Account Information */}
          <div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Department Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Department name"
                  className="w-full border rounded-md p-3 text-black"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <input
                  type="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="description"
                  className="w-full border rounded-md p-3 text-black"
                  required
                />
              </div>

            

           </div>
          </div>
           {/* Buttons */}
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
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Department"}
            </button>

          </div>

        </form>

    </div>

</div>
  );
}

export default AddDepartment;

