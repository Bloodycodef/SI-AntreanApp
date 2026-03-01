// layouts/DashboardLayout.tsx

import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sideBar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
