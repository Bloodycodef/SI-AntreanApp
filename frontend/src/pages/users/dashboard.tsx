import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const UserDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Send user back to login after clearing state
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SI-Antrean</h1>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            You are logged in as an{" "}
            <span className="font-bold">{user?.role}</span>.
          </p>

          {/* Dashboard Stats / Content placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="text-blue-700 font-semibold">Total Queues</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
            {/* Add more cards here */}
          </div>
        </div>
      </main>
    </div>
  );
};
