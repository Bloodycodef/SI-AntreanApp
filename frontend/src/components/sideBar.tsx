import { useState, useEffect } from "react";
import {
  Menu,
  BarChart3,
  Users,
  Calendar,
  UserPlus,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, getMe } = useAuthStore();

  // Fetch user when sidebar mounts
  useEffect(() => {
    if (!user) {
      getMe().catch(() => console.log("Not authenticated"));
    }
  }, [user, getMe]);

  // Compute display name based on role
  const displayName =
    user?.role === "user"
      ? user?.fullName || "User"
      : user?.role === "company"
        ? user?.companyName || "Company"
        : "User";

  // Menu items based on role
  const menuItems =
    user?.role === "user"
      ? [
          { label: "Dashboard", icon: <BarChart3 />, to: "/users/dashboard" },
          { label: "Antrean", icon: <Users />, to: "/users/antrean" },
          { label: "Jadwal", icon: <Calendar />, to: "/users/jadwal" },
          { label: "Layanan", icon: <UserPlus />, to: "/users/layanan" },
          { label: "Pengaturan", icon: <Settings />, to: "/users/pengaturan" },
        ]
      : user?.role === "company"
        ? [
            {
              label: "Dashboard",
              icon: <BarChart3 />,
              to: "/company/dashboard",
            },
            { label: "Antrean", icon: <Users />, to: "/company/antrean" },
            { label: "Jadwal", icon: <Calendar />, to: "/company/jadwal" },
            { label: "Layanan", icon: <UserPlus />, to: "/company/layanan" },
            {
              label: "Pengaturan",
              icon: <Settings />,
              to: "/company/pengaturan",
            },
          ]
        : [];

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-between">
        {sidebarOpen ? (
          <h1 className="text-xl font-bold text-blue-600">SI-Antrean</h1>
        ) : (
          <h1 className="text-xl font-bold text-blue-600 mx-auto">SA</h1>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              open={sidebarOpen}
              to={item.to}
            />
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {displayName.charAt(0).toUpperCase() || "U"}
          </div>

          {sidebarOpen && (
            <div className="flex-1">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "-"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  open,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  to: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition"
      >
        {icon}
        {open && <span>{label}</span>}
      </Link>
    </li>
  );
}
