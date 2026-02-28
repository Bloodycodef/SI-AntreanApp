import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "@/pages/auth/LoginPage";
import { CompanyDashboardPage } from "@/pages/company/dashboard";
import { UserDashboardPage } from "@/pages/users/dashboard";
import { ProtectedRoute } from "@/components/protectRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/users/dashboard" element={<UserDashboardPage />} />
        </Route>
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["company"]} />}>
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
