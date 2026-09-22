import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteDepartment, getDepartment } from "../../Services/departmentService";
import LoadingSpinner from "../../Components/LoadingSpinner";

function Departments() {
  
  const navigate = useNavigate();
  const location = useLocation();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDepartment();

      setDepartments(data.departments || []);
    } catch (error) {
      console.error("Get departments error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading departments..." />
      </div>
    );
  }

  const handleAddDepartment = () => {
  if (location.pathname.startsWith("/superadmin")) {
    navigate("/superadmin/department/add");
  } else {
    navigate("/hr/department/add");
  }
};

const handleViewDepartment = (id) => {
  if (location.pathname.startsWith("/superadmin")) {
    return `/superadmin/departments/${id}`;
  }

  return `/hr/departments/${id}`;
};

const handleEditDepartment = (id) => {
  if (location.pathname.startsWith("/superadmin")) {
    return `/superadmin/departments/${id}/edit`;
  }

  return `/hr/departments/${id}/edit`;
};

const handleDeleteDepartment = async (id) => {
  if (!window.confirm("Are you sure you want to delete this department?")) return;

  try {
    await deleteDepartment(id);
    alert("Department deleted successfully");
    fetchDepartments();
  } catch (error) {
    console.error("Delete department error:", error);
    alert(error.response?.data?.message || "Failed to delete department");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Departments
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all departments
          </p>
        </div>

        <button
          onClick={handleAddDepartment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          + Add Department
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="max-w-6xl mx-auto mb-5 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Empty */}
      {!error && departments.length === 0 && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-10 text-center shadow">
          <p className="text-gray-500">
            No departments found.
          </p>
        </div>
      )}

      {/* Department List */}
      {departments.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 bg-gray-800 text-white px-6 py-4 font-semibold">

            <div>Department Name</div>
            <div>Description</div>
            <div>Manager</div>
            <div>Actions</div>
            <div>Action</div>

          </div>

          {/* Departments */}
          {departments.map((department) => (

            <div
              key={department._id}
              className="grid grid-cols-5 gap-4 items-center px-6 py-5 border-b hover:bg-gray-50"
            >

              {/* Name */}
              <div className="font-semibold text-gray-800">
                {department.name}
              </div>

              {/* Description */}
              <div className="text-gray-600">
                {department.description || "N/A"}
              </div>

              {/* Manager */}
              <div className="text-gray-600">
                {department.manager?.name || "Not Assigned"}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => navigate(handleEditDepartment(department._id))}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteDepartment(department._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>

              {/* Action */}
              <div>
                <button
                  onClick={() =>
                    navigate(handleViewDepartment(department._id))
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  View
                </button>
              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Departments;