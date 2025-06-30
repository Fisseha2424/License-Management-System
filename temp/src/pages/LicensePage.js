// import React, { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   generateLicense,
//   validateLicense,
//   exportLicense,
//   checkExpiry,
//   getPublicKey,
//   importByPublicKey,
//   setLicenses,
// } from "../slices/licenseSlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
// import { getCompanies } from "../slices/companySlice";
// import { getProducts } from "../slices/productSlice";
// import LicenseForm from "../components/LicenseForm";
// import { Button, Alert, Upload, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const LicensePage = () => {
//   const dispatch = useDispatch();
//   const { licenses, status, error, exportData, publicKey } = useSelector(
//     (state) => state.license || {}
//   );
//   const { subscriptions } = useSelector(
//     (state) => state.companyProductSubscription || {}
//   );
//   const { companies } = useSelector((state) => state.company || {});
//   const { products } = useSelector((state) => state.product || {});
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedCompanyId, setSelectedCompanyId] = useState(null);

//   // Fetch initial data on mount
//   useEffect(() => {
//     dispatch(getSubscriptions());
//     dispatch(getCompanies());
//     dispatch(getProducts());
//   }, [dispatch]);

//   // Fetch licenses when selectedCompanyId changes
//   useEffect(() => {
//     if (selectedCompanyId) {
//       dispatch(getPublicKey(selectedCompanyId));
//       dispatch(exportLicense(selectedCompanyId));
//     }
//   }, [selectedCompanyId, dispatch]);

//   // Set default company ID after subscriptions are fetched
//   useEffect(() => {
//     if (subscriptions.length > 0 && !selectedCompanyId) {
//       const defaultCompanyId = subscriptions[0].companyID;
//       setSelectedCompanyId(defaultCompanyId);
//     }
//   }, [subscriptions, selectedCompanyId]);

//   const getCompanyName = (companyID) => {
//     const company = companies.find((c) => c.companyID === companyID);
//     return company ? company.companyName : "Unknown";
//   };

//   const getProductName = (productID) => {
//     const product = products.find((p) => p.productID === productID);
//     return product ? product.productName : "Unknown";
//   };

//   const getSubscriptionDetails = (companyProductID) => {
//     const subscription = subscriptions.find(
//       (s) => s.companyProductID === companyProductID
//     );
//     if (subscription) {
//       return `${getCompanyName(subscription.companyID)} - ${getProductName(
//         subscription.productID
//       )}`;
//     }
//     return "Unknown";
//   };

//   const handleExport = useCallback(
//     (data) => {
//       if (data) {
//         const jsonData = JSON.stringify(data, null, 2);
//         const blob = new Blob([jsonData], { type: "application/json" });
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `license_export_${selectedCompanyId}.json`;
//         a.click();
//         window.URL.revokeObjectURL(url);
//       }
//     },
//     [selectedCompanyId]
//   );

//   const handleImport = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = JSON.parse(e.target.result);
//         dispatch(importByPublicKey(data)).then(() => {
//           if (selectedCompanyId) {
//             dispatch(exportLicense(selectedCompanyId)); // Refresh licenses after import
//           }
//         });
//       } catch (err) {
//         message.error("Invalid JSON file");
//       }
//     };
//     reader.readAsText(file);
//     return false;
//   };

//   useEffect(() => {
//     if (exportData) handleExport(exportData);
//   }, [exportData, handleExport]);

//   const handleGenerateSuccess = () => {
//     if (selectedCompanyId) {
//       dispatch(exportLicense(selectedCompanyId)); // Refresh licenses after generation
//     }
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8">
//           Manage Licenses
//         </h2>
//         {status === "loading" ? (
//           <div className="text-center py-10">
//             <p className="text-lg text-gray-600">Loading...</p>
//           </div>
//         ) : (
//           <>
//             {error && (
//               <Alert
//                 message={`Error: ${error}`}
//                 type="error"
//                 className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-md"
//               />
//             )}
//             <div className="flex justify-between items-center mb-6">
//               <Button
//                 type="primary"
//                 onClick={() => setIsFormOpen(true)}
//                 className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
//               >
//                 Generate License
//               </Button>
//               <Upload
//                 beforeUpload={handleImport}
//                 showUploadList={false}
//                 accept=".json"
//               >
//                 <Button
//                   icon={<UploadOutlined />}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
//                 >
//                   Import License
//                 </Button>
//               </Upload>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Array.isArray(licenses) && licenses.length > 0 ? (
//                 licenses.map((license) => (
//                   <div
//                     key={license.companyProductID}
//                     className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
//                   >
//                     <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                       {getSubscriptionDetails(license.companyProductID)}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-1">
//                       <span className="font-medium">Expiry Date:</span>{" "}
//                       {new Date(license.expiryDate).toLocaleDateString()}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-1">
//                       <span className="font-medium">Devices:</span>{" "}
//                       {license.noOfDevice}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-1">
//                       <span className="font-medium">Users:</span>{" "}
//                       {license.noOfUser}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-1">
//                       <span className="font-medium">License Type:</span>{" "}
//                       {license.licenseType}
//                     </p>
//                     <p className="text-gray-600 text-sm mb-4">
//                       <span className="font-medium">License Key:</span>{" "}
//                       {license.license
//                         ? license.license.substring(0, 10) + "..."
//                         : "N/A"}
//                     </p>
//                     <div className="flex flex-col gap-2">
//                       <Button
//                         onClick={() => dispatch(validateLicense(license))}
//                         className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
//                       >
//                         Validate
//                       </Button>
//                       <Button
//                         onClick={() =>
//                           dispatch(exportLicense(selectedCompanyId))
//                         }
//                         className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
//                       >
//                         Export
//                       </Button>
//                       <Button
//                         onClick={() => dispatch(checkExpiry())}
//                         className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
//                       >
//                         Check Expiry
//                       </Button>
//                       <Button
//                         onClick={() =>
//                           dispatch(getPublicKey(selectedCompanyId))
//                         }
//                         className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
//                       >
//                         Get Public Key
//                       </Button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-600">No licenses found.</p>
//               )}
//             </div>
//             {publicKey && (
//               <Alert
//                 message={`Public Key: ${publicKey}`}
//                 type="info"
//                 className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-md"
//               />
//             )}
//             <LicenseForm
//               open={isFormOpen}
//               onClose={() => setIsFormOpen(false)}
//               onGenerateSuccess={handleGenerateSuccess}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LicensePage;

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  validateLicense,
  exportLicense,
  checkExpiry,
  getPublicKey,
  importByPublicKey,
} from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import LicenseForm from "../components/LicenseForm";
import { Card, Alert, Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const LicensePage = () => {
  const dispatch = useDispatch();
  const { licenses, status, error, exportData, publicKey } = useSelector(
    (state) => state.license || {}
  );
  const { subscriptions } = useSelector(
    (state) => state.companyProductSubscription || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const navigate = useNavigate();

  // Fetch initial data on mount
  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Fetch licenses when selectedCompanyId changes
  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(getPublicKey(selectedCompanyId));
      dispatch(exportLicense(selectedCompanyId));
    }
  }, [selectedCompanyId, dispatch]);

  // Set default company ID after subscriptions are fetched
  useEffect(() => {
    if (subscriptions.length > 0 && !selectedCompanyId) {
      const defaultCompanyId = subscriptions[0].companyID;
      setSelectedCompanyId(defaultCompanyId);
    }
  }, [subscriptions, selectedCompanyId]);

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

  const handleExport = useCallback(
    (data) => {
      if (data) {
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `license_export_${selectedCompanyId}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    [selectedCompanyId]
  );

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dispatch(importByPublicKey(data)).then(() => {
          if (selectedCompanyId) {
            dispatch(exportLicense(selectedCompanyId));
          }
        });
      } catch (err) {
        message.error("Invalid JSON file");
      }
    };
    reader.readAsText(file);
    return false;
  };

  useEffect(() => {
    if (exportData) handleExport(exportData);
  }, [exportData, handleExport]);

  const handleGenerateSuccess = () => {
    if (selectedCompanyId) {
      dispatch(exportLicense(selectedCompanyId));
    }
    setIsFormOpen(false); // Close form after successful generation
  };

  const handleCardClick = (action) => {
    if (action === "generate") {
      setIsFormOpen(true); // Open LicenseForm for Generate License
    } else {
      navigate(`/${action}-license`); // Navigate for other actions
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Licenses
        </h2>
        {status === "loading" ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Conditionally hide error if not critical */}
            {error &&
            error.toLowerCase().includes("company not found") ? null : (
              <Alert
                message={`Error: ${error}`}
                type="error"
                className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-md"
                showIcon
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card
                hoverable
                onClick={() => handleCardClick("generate")}
                className="bg-teal-50 border-teal-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-teal-800">
                    Generate License
                  </h3>
                </div>
              </Card>
              <Card
                hoverable
                onClick={() => handleCardClick("update")}
                className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Update License
                  </h3>
                </div>
              </Card>
              <Card
                hoverable
                onClick={() => handleCardClick("download")}
                className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-green-800">
                    Download License
                  </h3>
                </div>
              </Card>
              <Card
                hoverable
                onClick={() => handleCardClick("check-expiry")}
                className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Check Expiry
                  </h3>
                </div>
              </Card>
            </div>
            <div className="flex justify-end mb-6">
              <Upload
                beforeUpload={handleImport}
                showUploadList={false}
                accept=".json"
              >
                <Button
                  icon={<UploadOutlined />}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
                >
                  Import License
                </Button>
              </Upload>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(licenses) && licenses.length > 0 ? (
                licenses.map((license) => (
                  <div
                    key={license.companyProductID}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {getSubscriptionDetails(license.companyProductID)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Expiry Date:</span>{" "}
                      {new Date(license.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Devices:</span>{" "}
                      {license.noOfDevice}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Users:</span>{" "}
                      {license.noOfUser}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">License Type:</span>{" "}
                      {license.licenseType}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="font-medium">License Key:</span>{" "}
                      {license.license
                        ? license.license.substring(0, 10) + "..."
                        : "N/A"}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => dispatch(validateLicense(license))}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Validate
                      </Button>
                      <Button
                        onClick={() =>
                          dispatch(exportLicense(selectedCompanyId))
                        }
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Export
                      </Button>
                      <Button
                        onClick={() => dispatch(checkExpiry())}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Check Expiry
                      </Button>
                      <Button
                        onClick={() =>
                          dispatch(getPublicKey(selectedCompanyId))
                        }
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Get Public Key
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No licenses found.</p>
              )}
            </div>
            {publicKey && (
              <Alert
                message={`Public Key: ${publicKey}`}
                type="info"
                className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-md"
              />
            )}
            <LicenseForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              onGenerateSuccess={handleGenerateSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LicensePage;
