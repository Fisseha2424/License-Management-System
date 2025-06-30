// import React from 'react';
// import CardView from '../components/CardView';
// import LicensePage from '../pages/LicensePage';
// import LicenseValidationPage from '../pages/LicenseValidationPage';
// import LicenseHistoryPage from '../pages/LicenseHistoryPage';

// const LicenseManagementDashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <CardView><LicensePage /></CardView>
//       <CardView><LicenseValidationPage /></CardView> {/* Add actual component if available */}
//       <CardView><LicenseHistoryPage /></CardView> {/* Add actual component if available */}
//     </div>
//   );
// };

// export default LicenseManagementDashboard;
import React from "react";
import { Link } from "react-router-dom";
import CardView from "../components/CardView";

const LicenseManagementDashboard = () => {
  return (
    <div className="dashboard-container">
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Generate License</h1>
        <Link
          to="/licenses/generate"
          className="block mt-4 text-blue-500 hover:underline"
        >
          Go to Generate License
        </Link>
      </CardView>
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Export License</h1>
        <Link
          to="/licenses/export"
          className="block mt-4 text-blue-500 hover:underline"
        >
          Go to Export License
        </Link>
      </CardView>
      <CardView>
        <h1 className="text-2xl font-bold mb-4">Check Expiry</h1>
        <Link
          to="/licenses/check-expiry"
          className="block mt-4 text-blue-500 hover:underline"
        >
          Go to Check Expiry
        </Link>
      </CardView>
    </div>
  );
};

export default LicenseManagementDashboard;
