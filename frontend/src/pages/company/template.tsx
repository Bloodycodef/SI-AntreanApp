// src/pages/dashboard/CompanyDashboardPage.tsx
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BarChart3,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Plus,
} from "lucide-react";

interface Queue {
  id: string;
  name: string;
  currentNumber: number;
  totalWaiting: number;
  averageWaitTime: number;
  status: "active" | "paused" | "closed";
  estimatedServiceTime: string;
}

export const CompanyDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

  // Sample data - replace with actual API data
  const [queues] = useState<Queue[]>([
    {
      id: "1",
      name: "Customer Service",
      currentNumber: 45,
      totalWaiting: 12,
      averageWaitTime: 15,
      status: "active",
      estimatedServiceTime: "5-10 min",
    },
    {
      id: "2",
      name: "Payment Counter",
      currentNumber: 23,
      totalWaiting: 8,
      averageWaitTime: 8,
      status: "active",
      estimatedServiceTime: "3-5 min",
    },
    {
      id: "3",
      name: "Technical Support",
      currentNumber: 12,
      totalWaiting: 5,
      averageWaitTime: 25,
      status: "paused",
      estimatedServiceTime: "15-20 min",
    },
    {
      id: "4",
      name: "Information Desk",
      currentNumber: 0,
      totalWaiting: 3,
      averageWaitTime: 5,
      status: "closed",
      estimatedServiceTime: "2-3 min",
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "closed":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const stats = [
    {
      title: "Total Antrean Hari Ini",
      value: "156",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Rata-rata Waktu Tunggu",
      value: "12 min",
      change: "-3 min",
      icon: Clock,
      color: "bg-green-500",
    },
    {
      title: "Pelayanan Selesai",
      value: "143",
      change: "+8%",
      icon: CheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Antrean Aktif",
      value: "28",
      change: "+5",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 flex flex-col`}
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

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-3 bg-blue-50 text-blue-600 rounded-lg"
              >
                <BarChart3 className="w-5 h-5" />
                {sidebarOpen && <span>Dashboard</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Users className="w-5 h-5" />
                {sidebarOpen && <span>Antrean</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Calendar className="w-5 h-5" />
                {sidebarOpen && <span>Jadwal</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <UserPlus className="w-5 h-5" />
                {sidebarOpen && <span>Layanan</span>}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                {sidebarOpen && <span>Pengaturan</span>}
              </a>
            </li>
          </ul>
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || "C"}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari antrean..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Selamat datang kembali, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola antrean dan layanan Anda dengan mudah
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${stat.color} p-3 rounded-lg bg-opacity-10`}
                    >
                      <Icon
                        className={`w-6 h-6 ${stat.color.replace("bg-", "text-")}`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Active Queues Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Antrean Aktif
              </h2>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                <Plus className="w-4 h-4" />
                <span>Tambah Antrean</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {queues.map((queue) => (
                <div
                  key={queue.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedQueue(queue.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {queue.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(queue.status)}`}
                        >
                          {getStatusIcon(queue.status)}
                          <span className="capitalize">{queue.status}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          Estimasi: {queue.estimatedServiceTime}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Nomor Saat Ini</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {queue.currentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Menunggu</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {queue.totalWaiting}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Rata-rata Waktu</p>
                      <p className="text-2xl font-bold text-green-600">
                        {queue.averageWaitTime} min
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900 font-medium">
                        {queue.currentNumber} /{" "}
                        {queue.currentNumber + queue.totalWaiting}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(queue.currentNumber / (queue.currentNumber + queue.totalWaiting || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition">
                      Panggil Selanjutnya
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition">
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Aktivitas Terkini
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        Nomor antrean{" "}
                        <span className="font-bold">A{45 + item}</span>{" "}
                        dipanggil
                      </p>
                      <p className="text-xs text-gray-500">2 menit yang lalu</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      Customer Service
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Action Modal (optional) */}
      {selectedQueue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detail Antrean</h3>
              <button onClick={() => setSelectedQueue(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {/* Modal content here */}
            <p>Detail antrean untuk ID: {selectedQueue}</p>
          </div>
        </div>
      )}
    </div>
  );
};
