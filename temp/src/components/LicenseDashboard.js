// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// // import { getLicenses } from '../slices/licenseSlice';

// // Dashboard to display license statuses
// function LicenseDashboard() {
//   const dispatch = useDispatch();
//   const { licenses, error } = useSelector((state) => state.license);
//   const [filter, setFilter] = useState({ companyID: '', productName: '' });

//   //Fetch licenses on mount
//   // useEffect(() => {
//   //   dispatch(getLicenses());
//   // }, [dispatch]);

//   // Calculate if license is expiring soon
//   const isExpiringSoon = (expiryDate, notifyDays) => {
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
//     return diffDays <= notifyDays;
//   };

//   // Handle filter changes
//   const handleFilterChange = (e) => {
//     setFilter({ ...filter, [e.target.name]: e.target.value });
//   };

//   // Filter licenses
//   const filteredLicenses = licenses.filter(
//     (license) =>
//       license.CompanyID.includes(filter.companyID) &&
//       license.ProductName.toLowerCase().includes(filter.productName.toLowerCase())
//   );

//   return (
//     <div className="container">
//       <h2 className="text-2xl font-bold mb-4">License Status Dashboard</h2>
//       {error && <p className="text-red-500 mb-2">{error}</p>}
//       {/* Filters */}
//       <div className="mb-4 flex space-x-4">
//         <div>
//           <label className="block">Filter by Company ID</label>
//           <input
//             type="text"
//             name="companyID"
//             value={filter.companyID}
//             onChange={handleFilterChange}
//             className="border p-2"
//           />
//         </div>
//         <div>
//           <label className="block">Filter by Product Name</label>
//           <input
//             type="text"
//             name="productName"
//             value={filter.productName}
//             onChange={handleFilterChange}
//             className="border p-2"
//           />
//         </div>
//       </div>
//       {/* License Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Company ID</th>
//             <th className="border p-2">Product Name</th>
//             <th className="border p-2">Expiry Date</th>
//             <th className="border p-2">Devices</th>
//             <th className="border p-2">Users</th>
//             <th className="border p-2">License Key</th>
//             <th className="border p-2">Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredLicenses.map((license) => (
//             <tr
//               key={license.License}
//               className={isExpiringSoon(license.ExpiryDate, license.NotifyBeforeXDays) ? 'bg-red-100' : ''}
//             >
//               <td className="border p-2">{license.CompanyID}</td>
//               <td className="border p-2">{license.ProductName}</td>
//               <td className="border p-2">{license.ExpiryDate}</td>
//               <td className="border p-2">{license.NoOfDevice}</td>
//               <td className="border p-2">{license.NoOfUser}</td>
//               <td className="border p-2">{license.License}</td>
//               <td className="border p-2">
//                 {new Date(license.ExpiryDate) < new Date() ? 'Expired' : 'Valid'}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default LicenseDashboard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportLicense } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";

function LicenseDashboard() {
  const dispatch = useDispatch();
  const { licenses, error } = useSelector((state) => state.license || {});
  const { subscriptions } = useSelector(
    (state) => state.companyProductSubscription || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const [filter, setFilter] = useState({
    companyProductID: "",
    productName: "",
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  // Fetch initial data on mount
  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Set default company ID and fetch licenses
  useEffect(() => {
    if (subscriptions.length > 0 && !selectedCompanyId) {
      const defaultCompanyId = subscriptions[0].companyID;
      setSelectedCompanyId(defaultCompanyId);
      dispatch(exportLicense(defaultCompanyId));
    }
  }, [subscriptions, selectedCompanyId, dispatch]);

  const getCompanyName = (companyID) => {
    const company = companies.find((c) => c.companyID === companyID);
    return company ? company.companyName : "Unknown";
  };

  const getProductName = (productID) => {
    const product = products.find((p) => p.productID === productID);
    return product ? product.productName : "Unknown";
  };

  const getSubscriptionDetails = (companyProductID) => {
    const subscription = subscriptions.find(
      (s) => s.companyProductID === companyProductID
    );
    if (subscription) {
      return `${getCompanyName(subscription.companyID)} - ${getProductName(
        subscription.productID
      )}`;
    }
    return "Unknown";
  };

  // Calculate if license is expiring soon
  const isExpiringSoon = (expiryDate, notifyDays = 30) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffDays <= notifyDays;
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  // Filter licenses
  const filteredLicenses = licenses.filter(
    (license) =>
      getSubscriptionDetails(license.companyProductID)
        .toLowerCase()
        .includes(filter.companyProductID.toLowerCase()) &&
      getProductName(license.productID)
        .toLowerCase()
        .includes(filter.productName.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">License Status Dashboard</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block">Filter by Subscription</label>
          <input
            type="text"
            name="companyProductID"
            value={filter.companyProductID}
            onChange={handleFilterChange}
            className="border p-2"
            placeholder="Enter company or product name"
          />
        </div>
        <div>
          <label className="block">Filter by Product Name</label>
          <input
            type="text"
            name="productName"
            value={filter.productName}
            onChange={handleFilterChange}
            className="border p-2"
            placeholder="Enter product name"
          />
        </div>
      </div>
      {/* License Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Subscription</th>
            <th className="border p-2">Expiry Date</th>
            <th className="border p-2">Devices</th>
            <th className="border p-2">Users</th>
            <th className="border p-2">License Type</th>
            <th className="border p-2">License Key</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLicenses.map((license) => (
            <tr
              key={license.companyProductID}
              className={isExpiringSoon(license.expiryDate) ? "bg-red-100" : ""}
            >
              <td className="border p-2">
                {getSubscriptionDetails(license.companyProductID)}
              </td>
              <td className="border p-2">
                {new Date(license.expiryDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{license.noOfDevice}</td>
              <td className="border p-2">{license.noOfUser}</td>
              <td className="border p-2">{license.licenseType}</td>
              <td className="border p-2">
                {license.license
                  ? license.license.substring(0, 10) + "..."
                  : "N/A"}
              </td>
              <td className="border p-2">
                {new Date(license.expiryDate) < new Date()
                  ? "Expired"
                  : "Valid"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LicenseDashboard;
