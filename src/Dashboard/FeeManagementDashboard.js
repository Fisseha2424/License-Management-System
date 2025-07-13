import React from "react";
import { Link } from "react-router-dom";
import CardView from "../components/CardView";

const FeeManagementDashboard = () => {
  return (
    // Grid layout for better structure and responsiveness
    <div className="dashboard-container grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Fee Structure Card */}
      <Link
        to="/fee-management/manage"
        className="block"
        aria-label="Navigate to Fee Structure"
      >
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Fee Structure</h1>
        </CardView>
      </Link>

      {/* Make Offline Payment Card */}
      <Link
        to="/payments"
        className="block"
        aria-label="Navigate to Make Offline Payment"
      >
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Make Offline Payment</h1>
        </CardView>
      </Link>

      {/* You can add more cards below following the same structure */}
    </div>
  );
};

export default FeeManagementDashboard;
