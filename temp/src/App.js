import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LicensePage from "./pages/LicensePage";
import CompanyPage from "./pages/CompanyPage";
import ProductPage from "./pages/ProductPage";
import CompanyProductSubscriptionPage from "./pages/CompanyProductSubscriptionPage";
import FeePage from "./pages/FeePage";
import "./App.css"; // For Tailwind CSS

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { key: "licenses", label: "Licenses", path: "/licenses" },
    { key: "companies", label: "Companies", path: "/companies" },
    { key: "products", label: "Products", path: "/products" },
    { key: "subscriptions", label: "Subscriptions", path: "/subscriptions" },
    { key: "fees", label: "Fees", path: "/fees" },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 fixed shadow-2xl z-10">
      <div className="mb-8">
        {/* Insert logo here (e.g., <img src={logo} alt="Logo" className="h-12 mb-4" />) */}
        <h1 className="text-2xl font-extrabold text-teal-400">
          License Management System
        </h1>
      </div>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => navigate(item.path)}
              className="w-full text-left p-3 rounded-lg hover:bg-teal-600/30 transition-colors duration-200 flex items-center"
            >
              <span className="ml-2">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AppContent = ({ children }) => {
  return (
    <div className="ml-64 p-8 flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <AppContent>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            className="mt-16"
          />
          <Routes>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/licenses" element={<LicensePage />} />
            <Route path="/companies" element={<CompanyPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route
              path="/subscriptions"
              element={<CompanyProductSubscriptionPage />}
            />
            <Route path="/fees" element={<FeePage />} />
          </Routes>
        </AppContent>
      </div>
    </Router>
  );
};

export default App;
