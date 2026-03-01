import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";

import { CompanyDashboardPage } from "@/pages/company/dashboard";
import { UserDashboardPage } from "@/pages/users/dashboard";

import { ProtectedRoute } from "@/components/protectRoute";
import DashboardLayout from "@/layout/companyLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* USER ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/users/dashboard" element={<UserDashboardPage />} />
        </Route>

        {/* COMPANY ROUTES */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
