import React from 'react';
import { Link } from 'react-router-dom';
import CardView from '../components/CardView';

const CompanyManagementDashboard = () => {
  return (
    <div className="dashboard-container">
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Manage Companies</h1>
        <Link to="/companies/detail" className="block mt-4 text-blue-500 hover:underline">Go to Manage Companies</Link>
      </CardView>
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
        <Link to="/products" className="block mt-4 text-blue-500 hover:underline">Go to Manage Products</Link>
      </CardView>
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Manage Company Product Subscription</h1>
        <Link to="/subscriptions" className="block mt-4 text-blue-500 hover:underline">Go to Manage Subscriptions</Link>
      </CardView>
    </div>
  );
};

export default CompanyManagementDashboard;