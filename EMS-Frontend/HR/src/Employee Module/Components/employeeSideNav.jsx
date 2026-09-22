import {
  LayoutDashboard,
  User,
  CalendarCheck,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  LogIn,
  LogOut as LogOutIcon,
} from "lucide-react";

export const navData = [

  // Dashboard
  {
    title: "Dashboard",
    path: "/employee/dashboard",
    icon: <LayoutDashboard size={22} />,
  },

  // Check In
 {
  title: "Check In",
  icon: <LogIn size={22} />,
  action: "checkIn",
},

{
  title: "Check Out",
  icon: <LogOutIcon size={22} />,
  action: "checkOut",
},



  // Attendance
  {
    title: "My Attendance",
    path: "/employee/attendance",
    icon: <CalendarCheck size={22} />,
  },

  // Leave
  {
    title: "Leave",
    path: "/employee/leave",
    icon: <FileText size={22} />,
  },

  // Payroll
  {
    title: "My Payroll",
    path: "/employee/payroll",
    icon: <Briefcase size={22} />,
  },

  // Vacancies
  {
    title: "Vacancies",
    path: "/employee/vacancies",
    icon: <Briefcase size={22} />,
  },

    // Profile Overview
  {
    title: "Profile Overview",
    path: "/employee/profile",
    icon: <User size={22} />
    
  },

  // Logout
  {
    title: "Logout",
    action: "logout",
    icon: <LogOut size={22} />,
    logout: true,
  },
];

