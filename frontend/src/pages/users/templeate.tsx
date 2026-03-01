// src/pages/dashboard/UserDashboardPage.tsx
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  History,
  Star,
  Bell,
  LogOut,
  Menu,
  X,
  QrCode,
  MapPin,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Calendar,
  Filter,
  Copy,
  Share2,
  Home,
  User,
  Settings,
} from "lucide-react";

interface QueueItem {
  id: string;
  companyName: string;
  serviceType: string;
  queueNumber: string;
  position: number;
  estimatedWaitTime: number;
  peopleAhead: number;
  status: "waiting" | "processing" | "completed" | "cancelled";
  bookedTime?: string;
  address: string;
  distance?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

interface FavoriteService {
  id: string;
  companyName: string;
  serviceType: string;
  averageWaitTime: number;
  rating: number;
}

export const UserDashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "active" | "history" | "favorites"
  >("active");
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<QueueItem | null>(null);

  // Sample data - replace with actual API data
  const [activeQueues] = useState<QueueItem[]>([
    {
      id: "1",
      companyName: "Bank Central Asia",
      serviceType: "Customer Service",
      queueNumber: "A045",
      position: 3,
      estimatedWaitTime: 15,
      peopleAhead: 2,
      status: "waiting",
      address: "Jl. Sudirman No. 123, Jakarta",
      distance: "0.5 km",
    },
    {
      id: "2",
      companyName: "RS Siloam",
      serviceType: "Pendaftaran Pasien",
      queueNumber: "B023",
      position: 1,
      estimatedWaitTime: 5,
      peopleAhead: 0,
      status: "processing",
      bookedTime: "14:30",
      address: "Jl. Gatot Subroto No. 456, Jakarta",
      distance: "2.3 km",
    },
  ]);

  const [queueHistory] = useState<QueueItem[]>([
    {
      id: "3",
      companyName: "Kantor Imigrasi",
      serviceType: "Pengurusan Paspor",
      queueNumber: "C089",
      position: 0,
      estimatedWaitTime: 0,
      peopleAhead: 0,
      status: "completed",
      address: "Jl. HR Rasuna Said, Jakarta",
    },
    {
      id: "4",
      companyName: "Telkom Indonesia",
      serviceType: "Pembayaran",
      queueNumber: "D112",
      position: 0,
      estimatedWaitTime: 0,
      peopleAhead: 0,
      status: "completed",
      address: "Jl. Kebon Sirih No. 12, Jakarta",
    },
    {
      id: "5",
      companyName: "Samsat DKI",
      serviceType: "Perpanjangan STNK",
      queueNumber: "E056",
      position: 0,
      estimatedWaitTime: 0,
      peopleAhead: 0,
      status: "cancelled",
      address: "Jl. MT Haryono, Jakarta",
    },
  ]);

  const [favorites] = useState<FavoriteService[]>([
    {
      id: "1",
      companyName: "Bank Central Asia",
      serviceType: "Customer Service",
      averageWaitTime: 12,
      rating: 4.5,
    },
    {
      id: "2",
      companyName: "RS Siloam",
      serviceType: "Pendaftaran Pasien",
      averageWaitTime: 8,
      rating: 4.8,
    },
    {
      id: "3",
      companyName: "Kantor Pos",
      serviceType: "Pengiriman",
      averageWaitTime: 5,
      rating: 4.2,
    },
  ]);

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Antrean Mendekat",
      message: "Nomor antrean Anda A045 akan segera dipanggil. Harap bersiap.",
      time: "2 menit yang lalu",
      read: false,
      type: "warning",
    },
    {
      id: "2",
      title: "Antrean Diproses",
      message: "Nomor antrean Anda B023 sedang diproses di loket 3.",
      time: "15 menit yang lalu",
      read: false,
      type: "success",
    },
    {
      id: "3",
      title: "Estimasi Waktu",
      message: "Estimasi waktu tunggu untuk Bank BCA adalah 15 menit.",
      time: "1 jam yang lalu",
      read: true,
      type: "info",
    },
  ]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "waiting":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "waiting":
        return "Menunggu";
      case "processing":
        return "Diproses";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <nav className="bg-white shadow-sm p-4 fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">SI-Antrean</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">Pengguna</p>
                </div>
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                  >
                    Profil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                  >
                    Pengaturan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block p-2 hover:bg-gray-100 rounded-lg"
                  >
                    Bantuan
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Keluar
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">SI-Antrean</h1>
          <div className="flex items-center gap-6">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications.filter((n) => !n.read).length}
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">Pengguna</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:max-w-7xl lg:mx-auto pt-20 lg:pt-8 p-4">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Halo, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">Kelola antrean Anda dengan mudah</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium">Scan QR</span>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium">Cari Layanan</span>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium">Favorit</span>
          </button>
          <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <History className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium">Riwayat</span>
          </button>
        </div>

        {/* Active Queue Cards */}
        {activeQueues.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Antrean Aktif
            </h3>
            <div className="space-y-4">
              {activeQueues.map((queue) => (
                <div
                  key={queue.id}
                  className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {queue.companyName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {queue.serviceType}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(queue.status)}`}
                    >
                      {getStatusIcon(queue.status)}
                      <span>{getStatusText(queue.status)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Nomor Antrean
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {queue.queueNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Estimasi Waktu
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {queue.estimatedWaitTime} min
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Posisi Antrean</span>
                      <span className="font-semibold">
                        {queue.position} dari{" "}
                        {queue.position + queue.peopleAhead}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(queue.position / (queue.position + queue.peopleAhead || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{queue.distance}</span>
                    </div>
                    <span>Orang di depan: {queue.peopleAhead}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition">
                      Lihat Detail
                    </button>
                    <button className="p-2 border border-gray-200 hover:bg-gray-50 rounded-lg">
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b flex gap-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`pb-2 px-1 font-medium transition ${
                activeTab === "active"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 px-1 font-medium transition ${
                activeTab === "history"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Riwayat
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-2 px-1 font-medium transition ${
                activeTab === "favorites"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Favorit
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-sm divide-y">
              {queueHistory.map((queue) => (
                <div key={queue.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {queue.companyName}
                        </h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(queue.status)}`}
                        >
                          {getStatusIcon(queue.status)}
                          <span>{getStatusText(queue.status)}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {queue.serviceType}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{queue.queueNumber}</span>
                        <span>{queue.address}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {fav.companyName}
                      </h4>
                      <p className="text-sm text-gray-600">{fav.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{fav.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Rata-rata tunggu: {fav.averageWaitTime} min
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Ambil Antrean
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Panel */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notifikasi
          </h3>
          <div className="bg-white rounded-xl shadow-sm divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${!notification.read ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      notification.type === "warning"
                        ? "bg-yellow-100"
                        : notification.type === "success"
                          ? "bg-green-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {notification.type === "warning" && (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    {notification.type === "success" && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {notification.type === "info" && (
                      <Bell className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center p-2 text-blue-600">
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Beranda</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <History className="w-5 h-5" />
            <span className="text-xs mt-1">Riwayat</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <Star className="w-5 h-5" />
            <span className="text-xs mt-1">Favorit</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-600">
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </nav>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">QR Code Antrean</h3>
              <button onClick={() => setShowQrModal(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-48 h-48 text-gray-800" />
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              Scan QR code ini di loket untuk mengambil antrean
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
              Simpan QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
