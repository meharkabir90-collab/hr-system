import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDepartment } from "../../../Services/departmentService";
import {
  getEmployeeById,
  updateEmployee,
} from "../../../Services/employeeService";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const employeesPath = location.pathname.startsWith("/superadmin")
    ? "/superadmin/employees"
    : "/hr/employees";

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    salary: "",
    department: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [employeeResponse, departmentResponse] = await Promise.all([
          getEmployeeById(id),
          getDepartment(),
        ]);
        const employee = employeeResponse.employee;

        setFormData({
          name: employee?.name || "",
          email: employee?.email || "",
          phone: employee?.phone || "",
          position: employee?.position || "",
          salary: employee?.salary ?? "",
          department: employee?.department?._id || employee?.department || "",
        });
        setDepartments(departmentResponse.departments || []);
      } catch (fetchError) {
        console.error("Get employee data error:", fetchError);
        setError(fetchError.response?.data?.message || "Failed to load employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
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
      const response = await updateEmployee(id, {
        ...formData,
        salary: Number(formData.salary),
      });
      alert(response.message || "Employee updated successfully");
      navigate(employeesPath);
    } catch (submitError) {
      console.error("Update employee error:", submitError);
      alert(submitError.response?.data?.message || "Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading employee...</p>
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
          onClick={() => navigate(employeesPath)}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Employee</h1>
        <p className="text-gray-500 mt-1">Update employee information.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Full Name
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
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position">
                Position
              </label>
              <input
                id="position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="salary">
                Salary
              </label>
              <input
                id="salary"
                type="number"
                name="salary"
                min="0"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border rounded-md p-3 text-black bg-white"
                required
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(employeesPath)}
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

export default EditEmployee;
