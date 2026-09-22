import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Users,
  User,
  LogIn,
  LogOut as LogOutIcon,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const navData = [

  // =========================
  // MAIN
  // =========================

  {
    title: "Dashboard",
    path: "/manager/dashboard",
    icon: <LayoutDashboard size={22} />,
  },


  // =========================
  // MY ATTENDANCE
  // =========================

  {
    title: "MY ATTENDANCE",
    type: "section",
  },

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

  {
    title: "My Attendance",
    path: "/manager/attendance",
    icon: <CalendarCheck size={22} />,
  },

  {
    title: "Apply for Leave",
    path: "/manager/leave",
    icon: <FileText size={22} />,
  },

  {
    title: "My Payroll",
    path: "/manager/payroll",
    icon: <Users size={22} />,
  },

  {
    title: "Vacancies",
    path: "/manager/vacancies",
    icon: <Users size={22} />,
  },


  // =========================
  // TEAM
  // =========================

  {
    title: "TEAM",
    type: "section",
  },

  {
    title: "Team Attendance",
    path: "/manager/team-attendance",
    icon: <Users size={22} />,
  },

  {
    title: "Pending Leaves",
    path: "/manager/pending-leaves",
    icon: <Clock size={22} />,
  },

  {
    title: "Approved Leaves",
    path: "/manager/approved-leaves",
    icon: <CheckCircle size={22} />,
  },

  {
    title: "Rejected Leaves",
    path: "/manager/rejected-leaves",
    icon: <XCircle size={22} />,
  },


  // =========================
  // ACCOUNT
  // =========================

  {
    title: "ACCOUNT",
    type: "section",
  },

  {
    title: "Profile Overview",
    path: "/manager/profile",
    icon: <User size={22} />,
  },

  {
    title: "Logout",
    action: "logout",
    icon: <LogOut size={22} />,
    logout: true,
  },
];

