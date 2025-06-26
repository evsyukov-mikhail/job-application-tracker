import { NavLink, Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <nav className="w-full bg-white shadow-md mb-6 py-3 px-4 sm:px-6 rounded-lg max-w-md mx-auto">
        <ul className="flex justify-around sm:justify-center space-x-0 sm:space-x-8 text-gray-700 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive
                ? 'pb-2 transition-colors duration-200 ease-in-out border-b-2 border-blue-600 text-blue-600'
                : 'pb-2 transition-colors duration-200 ease-in-out hover:text-gray-900'
              }
            >
              Job Applications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reminders"
              className={({ isActive }) => isActive
                ? 'pb-2 transition-colors duration-200 ease-in-out border-b-2 border-blue-600 text-blue-600'
                : 'pb-2 transition-colors duration-200 ease-in-out hover:text-gray-900'
              }
            >
              Reminders
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}