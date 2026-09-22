import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

export const navData = [
  {
    title: "Main",
    items: [

      {
        label: "My Profile",
        path: "/hr/myprofile",
        icon: UsersIcon,
      },
      {
        label: "Dashboard",
        path: "/hr/dashboard",
        icon: HomeIcon,
      },

      {
        label: "Employees",
        path: "/hr/employees",
        icon: UsersIcon,
      },

      {
        label: "Departments",
        path: "/hr/departments",
        icon: BuildingOfficeIcon,
      },

      {
        label: "Attendance",
        path: "/hr/get-all-attendance",
        icon: CalendarDaysIcon,
      },

      {
        label: "Leave Management",
        icon: ClipboardDocumentListIcon,
        children: [
          {
            label: "Pending",
            path: "/hr/pending-leaves",
          },
          {
            label: "Approved",
            path: "/hr/approved-leaves",
          },
          {
            label: "Rejected",
            path: "/hr/rejected-leaves",
          },
        ],
      },

      {
        label: "Payroll",
        path: "/hr/payroll",
        icon: BanknotesIcon,
      },

      {
        label: "Generate Payroll",
        path: "/hr/generate-payroll",
        icon: BanknotesIcon,
      },

      {
        label: "Recruitment",
        path: "/hr/recruitment",
        icon: UserPlusIcon,
      },

      {
        label: "Job Applications",
        path: "/hr/job-applications",
        icon: ClipboardDocumentListIcon,
      },
    ],
  },

  {
    title: "Account",
    items: [
      {
        label: "Logout",
        action: "logout",
        icon: ArrowRightOnRectangleIcon,
      },
    ],
  },
];