import React from "react";
import { Link } from "react-router-dom";
import CardView from "../components/CardView";

const LicenseManagementDashboard = () => {
  return (
    // Optional: Improve layout using responsive grid
    <div className="dashboard-container grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Generate License Card */}
      <Link
        to="/licenses/generate"
        className="block"
        aria-label="Navigate to Generate License"
      >
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Generate License</h1>
        </CardView>
      </Link>

      {/* Export License Card */}
      <Link
        to="/licenses/export"
        className="block"
        aria-label="Navigate to Export License"
      >
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Export License</h1>
        </CardView>
      </Link>

      {/* Check Expiry Card */}
      <Link
        to="/licenses/check-expiry"
        className="block"
        aria-label="Navigate to Check Expiry"
      >
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Check Expiry</h1>
        </CardView>
      </Link>
    </div>
  );
};

export default LicenseManagementDashboard;
