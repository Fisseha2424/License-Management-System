import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import CardView from "./components/CardView";
import CompanyManagementDashboard from "./Dashboard/CompanyManagementDashboard";
import LicenseManagementDashboard from "./Dashboard/LicenseManagementDashboard";
import PaymentManagementDashboard from "./Dashboard/PaymentManagementDashboard";
import FeeManagementDashboard from "./Dashboard/FeeManagementDashboard";
import CompanyPage from "./pages/CompanyPage";
import ProductPage from "./pages/ProductPage";
import CompanyProductSubscriptionPage from "./pages/CompanyProductSubscriptionPage";
import GenerateLicensePage from "./pages/GenerateLicensePage";
import ExportLicensePage from "./pages/ExportLicensePage";
import CheckExpiryPage from "./pages/CheckExpiryPage";
import FeePage from "./pages/FeePage";
import PaymentPage from "./pages/PaymentPage";

import "./assets/App.css";
import CompanyFeePage from "./pages/companyFeePage";

const CardViewLayout = () => (
  <CardView>
    <Outlet />
  </CardView>
);

function App() {
  return (
    <Router>
      <div className="app-container flex">
        <Sidebar />
        <div className="main-content flex-1 p-6 bg-gray-100">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            className="mt-16"
          />
          <Routes>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/companies" element={<CompanyManagementDashboard />} />
            <Route element={<CardViewLayout />}>
              <Route path="/companies/detail" element={<CompanyPage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route
                path="/subscriptions"
                element={<CompanyProductSubscriptionPage />}
              />
              <Route
                path="/licenses/generate"
                element={<GenerateLicensePage />}
              />
              <Route path="/licenses/export" element={<ExportLicensePage />} />
              <Route
                path="/licenses/check-expiry"
                element={<CheckExpiryPage />}
              />
              <Route path="/payments/manage" element={<PaymentPage />} />
              <Route path="/fee-management/manage" element={<FeePage />} />
            </Route>
            <Route path="/licenses" element={<LicenseManagementDashboard />} />
            <Route path="/payments" element={<PaymentManagementDashboard />} />
            <Route path="/fees" element={<FeeManagementDashboard />} />
            <Route
              path="/company-fee-management"
              element={<CompanyFeePage />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
