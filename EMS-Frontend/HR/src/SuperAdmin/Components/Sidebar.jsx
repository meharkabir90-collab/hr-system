import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";


// =====================================================
// DESKTOP SIDEBAR
// =====================================================

export function NavDesktop({ data }) {
  return (
    <aside
      className="
        hidden lg:flex
        fixed top-0 left-0 z-50
        h-screen w-64
        flex-col
        border-r border-sky-100
        bg-white
        px-4 py-6
      "
    >
      <NavContent data={data} />
    </aside>
  );
}


// =====================================================
// MOBILE SIDEBAR
// =====================================================

export function NavMobile({
  data,
  open,
  onClose,
}) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/30
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-white
          border-r border-sky-100
          px-4 py-6
          transform transition-transform duration-300
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <NavContent
          data={data}
          onClose={onClose}
        />
      </aside>
    </>
  );
}


// =====================================================
// SIDEBAR CONTENT
// =====================================================

export function NavContent({
  data,
  onClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openItems, setOpenItems] = useState({});

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* =================================================
          LOGO / HEADER
      ================================================= */}

      <div className="mb-6 px-3">

        <h2 className="text-xl font-bold text-sky-600">
          SuperAdmin Portal
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          HR Management System
        </p>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          pr-1
          scrollbar-thin
        "
      >

        <div className="space-y-6">

          {data.map((section, sectionIndex) => (

            <div key={section.title || sectionIndex}>

              {/* Section Heading */}

              {section.title && (
                <p
                  className="
                    mb-2
                    px-3
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  {section.title}
                </p>
              )}


              {/* Section Items */}

              <div className="space-y-1">

                {section.items?.map((item) => {

                  // =====================================
                  // LOGOUT
                  // =====================================

                  if (item.action === "logout") {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex w-full
                          items-center gap-3
                          rounded-lg
                          px-3 py-3
                          text-left
                          text-sm font-medium
                          text-red-600
                          transition-all duration-200
                          hover:bg-red-50
                        "
                      >

                        <span
                          className="
                            flex h-6 w-6
                            items-center justify-center
                          "
                        >
                          {item.icon && <item.icon size={19} />}
                        </span>

                        <span className="flex-1">
                          {item.label}
                        </span>

                      </button>
                    );
                  }

                  if (item.children?.length) {
                    const isChildActive = item.children.some(
                      (child) => location.pathname === child.path
                    );
                    const isOpen = openItems[item.label] ?? isChildActive;

                    return (
                      <div key={item.label}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenItems((current) => ({
                              ...current,
                              [item.label]: !isOpen,
                            }))
                          }
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition-all duration-200 ${
                            isChildActive
                              ? "bg-sky-100 text-sky-600"
                              : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                          }`}
                        >
                          <span className="flex h-6 w-6 items-center justify-center">
                            {item.icon && <item.icon size={19} />}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          <span aria-hidden="true">{isOpen ? "-" : "+"}</span>
                        </button>

                        {isOpen && (
                          <div className="ml-9 mt-1 space-y-1 border-l border-sky-100 pl-3">
                            {item.children.map((child) => (
                              <NavLink
                                key={child.label}
                                to={child.path}
                                onClick={onClose}
                                className={({ isActive }) =>
                                  `block rounded-md px-3 py-2 text-sm transition-colors ${
                                    isActive
                                      ? "bg-sky-50 font-medium text-sky-600"
                                      : "text-gray-500 hover:bg-sky-50 hover:text-sky-600"
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }


                  // =====================================
                  // NORMAL NAVIGATION
                  // =====================================

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3
                        rounded-lg
                        px-3 py-3
                        text-sm font-medium
                        transition-all duration-200

                        ${
                          isActive
                            ? "bg-sky-100 text-sky-600"
                            : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                        }
                        `
                      }
                    >

                      {/* Icon */}

                      <span
                        className="
                          flex h-6 w-6
                          items-center justify-center
                        "
                      >
                        {item.icon && <item.icon size={19} />}
                      </span>


                      {/* Label */}

                      <span className="flex-1">
                        {item.label}
                      </span>

                    </NavLink>
                  );

                })}

              </div>

            </div>

          ))}

        </div>

      </nav>

    </div>
  );
}
