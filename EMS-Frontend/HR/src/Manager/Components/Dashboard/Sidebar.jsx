import { NavLink } from "react-router-dom";

// Desktop Sidebar
export function NavDesktop({
  data,
  onCheckIn,
  onCheckOut,
  onLogout,
}) {
  return (
    <aside
      className="
        hidden lg:flex
        fixed top-0 left-0 z-50
        h-screen w-64
        flex-col
        border-r border-sky-100
        bg-white
      "
    >
      <NavContent
        data={data}
        onCheckIn={onCheckIn}
        onCheckOut={onCheckOut}
        onLogout={onLogout}
      />
    </aside>
  );
}


// Mobile Sidebar
export function NavMobile({
  data,
  open,
  onClose,
  onCheckIn,
  onCheckOut,
  onLogout,
}) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-white
          border-r border-sky-100
          transform transition-transform duration-300
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <NavContent
          data={data}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
}


// Sidebar Content
export function NavContent({
  data,
  onCheckIn,
  onCheckOut,
  onLogout,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">

      {/* =========================
          LOGO
      ========================= */}
      <div className="shrink-0 px-4 pt-6 pb-5">
        <h2 className="text-xl font-bold text-sky-600">
          Manager Portal
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          HR Management System
        </p>
      </div>


      {/* =========================
          NAVIGATION - SCROLLABLE
      ========================= */}
      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-4
          pb-6
          scrollbar-thin
        "
      >

        {data.map((item, index) => {

          // =========================
          // SECTION TITLE
          // =========================
          if (item.type === "section") {
            return (
              <div
                key={`${item.title}-${index}`}
                className="
                  mt-6
                  mb-2
                  px-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-400
                "
              >
                {item.title}
              </div>
            );
          }


          // =========================
          // CHECK IN
          // =========================
          if (item.action === "checkIn") {
            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={onCheckIn}
                className="
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-3
                  text-left text-sm font-medium
                  text-green-600
                  transition-all duration-200
                  hover:bg-green-50
                "
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  {item.icon}
                </span>

                <span className="flex-1">
                  {item.title}
                </span>
              </button>
            );
          }


          // =========================
          // CHECK OUT
          // =========================
          if (item.action === "checkOut") {
            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={onCheckOut}
                className="
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-3
                  text-left text-sm font-medium
                  text-red-600
                  transition-all duration-200
                  hover:bg-red-50
                "
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  {item.icon}
                </span>

                <span className="flex-1">
                  {item.title}
                </span>
              </button>
            );
          }


          // =========================
          // LOGOUT
          // =========================
          if (item.action === "logout") {
            return (
              <button
                key={`${item.title}-${index}`}
                type="button"
                onClick={onLogout}
                className="
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-3
                  text-left text-sm font-medium
                  text-gray-600
                  transition-all duration-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                <span className="flex h-6 w-6 items-center justify-center">
                  {item.icon}
                </span>

                <span className="flex-1">
                  {item.title}
                </span>
              </button>
            );
          }


          // =========================
          // NORMAL NAVIGATION
          // =========================
          return (
            <NavLink
              key={`${item.title}-${index}`}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                rounded-lg px-3 py-3
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
              <span className="flex h-6 w-6 items-center justify-center">
                {item.icon}
              </span>

              <span className="flex-1">
                {item.title}
              </span>
            </NavLink>
          );
        })}

      </nav>

    </div>
  );
}

