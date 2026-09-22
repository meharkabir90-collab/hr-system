import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  ClipboardList,
  UserPlus,
  Wallet,
  BarChart3,
  Bot,
  Settings,
  ShieldCheck,
  UserCog,
  UserRound,
  LogOut,
  
} from "lucide-react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

export const navData = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: "/superadmin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "MANAGEMENT",
    items: [
      {
        label: "Employees",
        path: "/superadmin/employees",
        icon: Users,
      },
      {
        label: "Managers",
        path: "/superadmin/managers",
        icon: Users,
      },
      {
        label: "HR",
        path: "/superadmin/hr-admins",
        icon: Users,
      },
      {
        label: "Departments",
        path: "/superadmin/departments",
        icon: Building2,
      },
      {
        label: "Attendance",
        path: "/superadmin/get-all-attendance",
        icon: CalendarCheck,
      },
       {
              label: "Leave Management",
              icon: ClipboardDocumentListIcon,
              children: [
                {
                  label: "Pending",
                  path: "/superadmin/pending-leaves",
                },
                {
                  label: "Approved",
                  path: "/superadmin/approved-leaves",
                },
                {
                  label: "Rejected",
                  path: "/superadmin/rejected-leaves",
                },
              ],
         },
      {
        label: "Payroll",
        path: "/superadmin/payroll",
        icon: Wallet,
      },
      {
        label: "Generate Payroll",
        path: "/superadmin/generate-payroll",
        icon: Wallet,
      },
      {
        label: "Recruitment",
        path: "/superadmin/recruitment",
        icon: UserPlus,
      },
      {
        label: "Job Applications",
        path: "/superadmin/job-applications",
        icon: ClipboardList,
      },
      {
        label: "Reports",
        path: "/superadmin/reports",
        icon: BarChart3,
      },
      {
        label: "AI",
        path: "/superadmin/ai",
        icon: Bot,
      },
      {
        label: "Settings",
        path: "/superadmin/settings",
        icon: Settings,
      },
    ],
  },

  {
    title: "PORTAL ACCESS",
    items: [
      {
        label: "Manager Portal",
        path: "/superadmin/manager-portal",
        icon: ShieldCheck,
      },
      {
        label: "Employee Portal",
        path: "/superadmin/employee-portal",
        icon: UserRound,
      },
      {
        label: "HR Portal",
        path: "/superadmin/hr-portal",
        icon: UserCog,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        label: "Profile",
        path: "/superadmin/profile",
        icon: UserRound,
      },
      {
        label: "Logout",
        action: "logout",
        icon: LogOut,
      },
    ],
  },
];

