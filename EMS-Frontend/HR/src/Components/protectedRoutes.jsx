import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;

  console.log("PROTECTED ROUTE ROLE:", role);
  console.log("ALLOWED ROLES:", allowedRoles);

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // User is allowed to access this route
  if (allowedRoles.includes(role)) {
    return <Outlet />;
  }

  // User is not allowed, send them to THEIR dashboard
  if (role === "SuperAdmin") {
    return <Navigate to="/superadmin/dashboard" replace />;
  }

  if (role === "Manager") {
    return <Navigate to="/manager/dashboard" replace />;
  }

  if (role === "Employee") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  if (role === "HRAdmin") {
    return <Navigate to="/hr/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;