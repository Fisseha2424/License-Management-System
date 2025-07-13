import React from "react";
import { Link } from "react-router-dom";
import CardView from "../components/CardView";

const CompanyManagementDashboard = () => {
  return (
    <div className="dashboard-container grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Manage Companies Card */}
      <Link to="/companies/detail" className="block">
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Manage Companies</h1>
        </CardView>
      </Link>

      {/* Manage Products Card */}
      <Link to="/products" className="block">
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
        </CardView>
      </Link>

      {/* Manage Subscriptions Card */}
      <Link to="/subscriptions" className="block">
        <CardView className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
          <h1 className="text-2xl font-bold mb-4">
            Manage Company Product Subscription
          </h1>
        </CardView>
      </Link>
    </div>
  );
};

export default CompanyManagementDashboard;
