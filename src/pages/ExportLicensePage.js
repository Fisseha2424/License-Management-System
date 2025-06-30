import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportLicense } from "../slices/licenseSlice";
import { getCompanies } from "../slices/companySlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { Select, Button, Alert, Checkbox } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Option } = Select;

const ExportLicensePage = () => {
  const dispatch = useDispatch();
  const { status, error, exportData } = useSelector(
    (state) => state.license || {}
  );
  const { companies = [] } = useSelector((state) => state.company || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { products = [] } = useSelector((state) => state.product || {});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Load companies and subscriptions on mount
  useEffect(() => {
    dispatch(getCompanies());
    dispatch(getSubscriptions());
  }, [dispatch]);

  // Helper to get product name
  const getProductName = (productID) =>
    products.find((p) => p.productID === productID)?.productName || "Unknown";

  // Filter products based on selected company
  const filteredProducts = subscriptions
    .filter((sub) => sub.companyID === selectedCompany)
    .map((sub) => ({
      productID: sub.productID,
      productName: getProductName(sub.productID),
    }))
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.productID === value.productID)
    ); // Remove duplicates

  // Handle checkbox change
  const onProductChange = (checkedValues) => {
    setSelectedProducts(checkedValues);
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (filteredProducts.length > 0) {
      setSelectedProducts(filteredProducts.map((p) => p.productID));
    }
  };

  // Handle export and trigger download
  const handleExport = () => {
    if (selectedCompany && selectedProducts.length > 0) {
      const company = companies.find((c) => c.companyID === selectedCompany);
      if (!company) {
        toast.error(
          `Company with ID ${selectedCompany} not found in the database.`
        );
        return;
      }

      const validSubscriptions = selectedProducts.every((productID) =>
        subscriptions.some(
          (sub) =>
            sub.companyID === selectedCompany && sub.productID === productID
        )
      );
      if (!validSubscriptions) {
        toast.error(
          "One or more selected products are not subscribed by the company."
        );
        return;
      }

      // Dispatch export with companyId (assuming backend handles multiple products)
      dispatch(
        exportLicense({
          companyId: selectedCompany,
          productIds: selectedProducts,
        })
      ).then((action) => {
        if (action.payload) {
          if (action.payload instanceof Blob) {
            const url = window.URL.createObjectURL(action.payload);
            const a = document.createElement("a");
            a.href = url;
            a.download = `license_export_${selectedCompany}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("License exported successfully!");
          } else if (typeof action.payload === "string") {
            toast.error(`Export failed: ${action.payload}`);
          }
        } else if (action.error) {
          toast.error(
            `Export failed: ${action.error.message || "Unknown error"}`
          );
        }
      });
    } else {
      toast.error("Please select a company and at least one product.");
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-10">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Export License
      </h1>

      {/* Loading indicator */}
      {status === "loading" ? (
        <p className="text-lg text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Error alert */}
          {error && (
            <Alert
              message={`Error: ${error}`}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Company dropdown */}
          <div className="mb-4">
            <Select
              className="w-full sm:w-[300px]"
              placeholder="Select a company"
              onChange={(value) => {
                setSelectedCompany(value);
                setSelectedProducts([]); // Reset products when company changes
              }}
              value={selectedCompany}
              size="large"
            >
              {companies.map((company) => (
                <Option key={company.companyID} value={company.companyID}>
                  {company.companyName}
                </Option>
              ))}
            </Select>
          </div>

          {/* Product checkboxes */}
          {selectedCompany && filteredProducts.length > 0 && (
            <div className="mb-4">
              <Checkbox.Group
                value={selectedProducts}
                onChange={onProductChange}
                className="w-full sm:w-[300px]"
              >
                {filteredProducts.map((product) => (
                  <div key={product.productID} className="mb-2">
                    <Checkbox value={product.productID}>
                      {product.productName}
                    </Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
              <Button
                type="link"
                onClick={handleSelectAll}
                disabled={filteredProducts.length === 0}
                className="mt-2"
              >
                Select All
              </Button>
            </div>
          )}

          {/* Export button */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!selectedCompany || selectedProducts.length === 0}
            size="large"
            className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            Export License
          </Button>

          {/* Success alert */}
          {exportData && exportData instanceof Blob && (
            <Alert
              message="Export successful!"
              type="success"
              showIcon
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExportLicensePage;

// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { exportLicense, getLicenses } from "../slices/licenseSlice";
// // import { getCompanies } from "../slices/companySlice";
// // import { Select, Button, Alert } from "antd";
// // import { DownloadOutlined } from "@ant-design/icons";
// // import { toast } from "react-toastify";

// // const ExportLicensePage = () => {
// //   const dispatch = useDispatch();
// //   const {
// //     licenses = [],
// //     status,
// //     error,
// //     exportData,
// //   } = useSelector((state) => state.license || {});
// //   const { companies = [] } = useSelector((state) => state.company || {});
// //   const [selectedLicense, setSelectedLicense] = useState(null);

// //   // Load licenses and companies on mount
// //   useEffect(() => {
// //     dispatch(getLicenses());
// //     dispatch(getCompanies());
// //     console.log("Licenses:", licenses); // Debug log for licenses
// //     // console.log("Companies:", companies); // Debug log for companies
// //   }, [dispatch]);

// //   // Handle export and trigger download
// //   const handleExport = () => {
// //     if (selectedLicense) {
// //       // Find the corresponding license
// //       const license = licenses.find(
// //         (l) => l.companyProductID === selectedLicense
// //       );
// //       if (!license) {
// //         toast.error("Selected license not found.");
// //         return;
// //       }

// //       // Extract companyId from license
// //       let companyId = license.companyID;
// //       console.log("License found:", license); // Debug log for the license object
// //       if (!companyId) {
// //         toast.error("Company ID is missing for the selected license.");
// //         return;
// //       }

// //       // Validate companyId against companies (optional, based on API expectation)
// //       const company = companies.find((c) => c.companyId === companyId);
// //       if (!company) {
// //         toast.error(`Company with ID ${companyId} not found in the database.`);
// //         return;
// //       }

// //       // Dispatch export with validated companyId
// //       dispatch(exportLicense(companyId)).then((action) => {
// //         if (action.payload) {
// //           if (action.payload instanceof Blob) {
// //             const url = window.URL.createObjectURL(action.payload);
// //             const a = document.createElement("a");
// //             a.href = url;
// //             a.download = `license_export_${companyId}.json`;
// //             a.click();
// //             window.URL.revokeObjectURL(url);
// //             toast.success("License exported successfully!");
// //           } else if (typeof action.payload === "string") {
// //             toast.error(`Export failed: ${action.payload}`);
// //           }
// //         } else if (action.error) {
// //           toast.error(
// //             `Export failed: ${action.error.message || "Unknown error"}`
// //           );
// //         }
// //       });
// //     }
// //   };

// //   return (
// //     <div className="p-6 sm:p-8 md:p-10">
// //       {/* Page Title */}
// //       <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
// //         Export License
// //       </h1>

// //       {/* Loading indicator */}
// //       {status === "loading" ? (
// //         <p className="text-lg text-gray-500">Loading...</p>
// //       ) : (
// //         <>
// //           {/* Error alert */}
// //           {error && (
// //             <Alert
// //               message={`Error: ${error}`}
// //               type="error"
// //               showIcon
// //               className="mb-4"
// //             />
// //           )}

// //           {/* License dropdown */}
// //           <div className="mb-4">
// //             <Select
// //               className="w-full sm:w-[300px]"
// //               placeholder="Select a license to export"
// //               onChange={(value) => setSelectedLicense(value)}
// //               value={selectedLicense}
// //               size="large"
// //             >
// //               {licenses.map((license) => (
// //                 <Select.Option
// //                   key={license.companyProductID}
// //                   value={license.companyProductID}
// //                 >
// //                   License ID: {license.companyProductID}
// //                 </Select.Option>
// //               ))}
// //             </Select>
// //           </div>

// //           {/* Export button */}
// //           <Button
// //             type="primary"
// //             icon={<DownloadOutlined />}
// //             onClick={handleExport}
// //             disabled={!selectedLicense}
// //             size="large"
// //             className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
// //           >
// //             Export License
// //           </Button>

// //           {/* Success alert */}
// //           {exportData && exportData instanceof Blob && (
// //             <Alert
// //               message="Export successful!"
// //               type="success"
// //               showIcon
// //               className="mt-6"
// //             />
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default ExportLicensePage;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { exportLicense } from "../slices/licenseSlice";
// import { getCompanies } from "../slices/companySlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
// import { Select, Button, Alert } from "antd";
// import { DownloadOutlined } from "@ant-design/icons";
// import { toast } from "react-toastify";

// const { Option } = Select;

// const ExportLicensePage = () => {
//   const dispatch = useDispatch();
//   const { status, error, exportData } = useSelector(
//     (state) => state.license || {}
//   );
//   const { companies = [] } = useSelector((state) => state.company || {});
//   const { subscriptions = [] } = useSelector(
//     (state) => state.subscription || {}
//   );
//   const { products = [] } = useSelector((state) => state.product || {});
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   // Load companies and subscriptions on mount
//   useEffect(() => {
//     dispatch(getCompanies());
//     dispatch(getSubscriptions());
//   }, [dispatch]);

//   // Helper to get product name
//   const getProductName = (productID) =>
//     products.find((p) => p.productID === productID)?.productName || "Unknown";

//   // Filter products based on selected company
//   const filteredProducts = subscriptions
//     .filter((sub) => sub.companyID === selectedCompany)
//     .map((sub) => ({
//       productID: sub.productID,
//       productName: getProductName(sub.productID),
//     }))
//     .filter(
//       (value, index, self) =>
//         index === self.findIndex((t) => t.productID === value.productID)
//     ); // Remove duplicates

//   // Handle export and trigger download
//   const handleExport = () => {
//     if (selectedCompany && selectedProduct) {
//       // Validate company
//       const company = companies.find((c) => c.companyID === selectedCompany);
//       if (!company) {
//         toast.error(
//           `Company with ID ${selectedCompany} not found in the database.`
//         );
//         return;
//       }

//       // Validate subscription (ensure company-product pair exists)
//       const subscription = subscriptions.find(
//         (sub) =>
//           sub.companyID === selectedCompany && sub.productID === selectedProduct
//       );
//       if (!subscription) {
//         toast.error(
//           "No subscription found for the selected company and product."
//         );
//         return;
//       }

//       // Dispatch export with companyId
//       dispatch(exportLicense(selectedCompany)).then((action) => {
//         if (action.payload) {
//           if (action.payload instanceof Blob) {
//             const url = window.URL.createObjectURL(action.payload);
//             const a = document.createElement("a");
//             a.href = url;
//             a.download = `license_export_${selectedCompany}.json`;
//             a.click();
//             window.URL.revokeObjectURL(url);
//             toast.success("License exported successfully!");
//           } else if (typeof action.payload === "string") {
//             toast.error(`Export failed: ${action.payload}`);
//           }
//         } else if (action.error) {
//           toast.error(
//             `Export failed: ${action.error.message || "Unknown error"}`
//           );
//         }
//       });
//     } else {
//       toast.error("Please select both a company and a product.");
//     }
//   };

//   return (
//     <div className="p-6 sm:p-8 md:p-10">
//       {/* Page Title */}
//       <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
//         Export License
//       </h1>

//       {/* Loading indicator */}
//       {status === "loading" ? (
//         <p className="text-lg text-gray-500">Loading...</p>
//       ) : (
//         <>
//           {/* Error alert */}
//           {error && (
//             <Alert
//               message={`Error: ${error}`}
//               type="error"
//               showIcon
//               className="mb-4"
//             />
//           )}

//           {/* Company dropdown */}
//           <div className="mb-4">
//             <Select
//               className="w-full sm:w-[300px]"
//               placeholder="Select a company"
//               onChange={(value) => {
//                 setSelectedCompany(value);
//                 setSelectedProduct(null); // Reset product when company changes
//               }}
//               value={selectedCompany}
//               size="large"
//             >
//               {companies.map((company) => (
//                 <Option key={company.companyID} value={company.companyID}>
//                   {company.companyName}
//                 </Option>
//               ))}
//             </Select>
//           </div>

//           {/* Product dropdown */}
//           <div className="mb-4">
//             <Select
//               className="w-full sm:w-[300px]"
//               placeholder="Select a product"
//               onChange={(value) => setSelectedProduct(value)}
//               value={selectedProduct}
//               size="large"
//               disabled={!selectedCompany}
//             >
//               {filteredProducts.map((product) => (
//                 <Option key={product.productID} value={product.productID}>
//                   {product.productName}
//                 </Option>
//               ))}
//             </Select>
//           </div>

//           {/* Export button */}
//           <Button
//             type="primary"
//             icon={<DownloadOutlined />}
//             onClick={handleExport}
//             disabled={!selectedCompany || !selectedProduct}
//             size="large"
//             className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
//           >
//             Export License
//           </Button>

//           {/* Success alert */}
//           {exportData && exportData instanceof Blob && (
//             <Alert
//               message="Export successful!"
//               type="success"
//               showIcon
//               className="mt-6"
//             />
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default ExportLicensePage;

// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { exportLicense, getLicenses } from "../slices/licenseSlice";
// // import { getCompanies } from "../slices/companySlice";
// // import { Select, Button, Alert, Checkbox, Card, Divider } from "antd";
// // import { DownloadOutlined, SelectOutlined } from "@ant-design/icons";
// // import { toast } from "react-toastify";

// // const ExportLicensePage = () => {
// //   const dispatch = useDispatch();
// //   const {
// //     licenses = [],
// //     status,
// //     error,
// //     exportData,
// //   } = useSelector((state) => state.license || {});
// //   const { companies = [] } = useSelector((state) => state.company || {});

// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [selectedLicenses, setSelectedLicenses] = useState([]);
// //   const [companyLicenses, setCompanyLicenses] = useState([]);

// //   // Load licenses and companies on mount
// //   useEffect(() => {
// //     dispatch(getLicenses());
// //     dispatch(getCompanies());
// //   }, [dispatch]);

// //   // Filter licenses when company is selected
// //   useEffect(() => {
// //     if (selectedCompany && licenses.length > 0) {
// //       const filteredLicenses = licenses.filter((license) => license.companyID === selectedCompany);
// //       setCompanyLicenses(filteredLicenses);
// //       setSelectedLicenses([]); // Reset selected licenses when company changes
// //     } else {
// //       setCompanyLicenses([]);
// //       setSelectedLicenses([]);
// //     }
// //   }, [selectedCompany, licenses]);

// //   // Handle company selection
// //   const handleCompanyChange = (companyId) => {
// //     setSelectedCompany(companyId);
// //   };

// //   // Handle individual license checkbox change
// //   const handleLicenseChange = (licenseId, checked) => {
// //     if (checked) {
// //       setSelectedLicenses((prev) => [...prev, licenseId]);
// //     } else {
// //       setSelectedLicenses((prev) => prev.filter((id) => id !== licenseId));
// //     }
// //   };

// //   // Handle select all checkbox
// //   const handleSelectAll = (e) => {
// //     const checked = e.target.checked;
// //     if (checked) {
// //       const allLicenseIds = companyLicenses.map((license) => license.companyProductID);
// //       setSelectedLicenses(allLicenseIds);
// //     } else {
// //       setSelectedLicenses([]);
// //     }
// //   };

// //   // Check if all licenses are selected
// //   const isAllSelected = companyLicenses.length > 0 && selectedLicenses.length === companyLicenses.length;

// //   // Check if some licenses are selected (for indeterminate state)
// //   const isIndeterminate = selectedLicenses.length > 0 && selectedLicenses.length < companyLicenses.length;

// //   // Handle export
// //   const handleExport = () => {
// //     if (!selectedCompany) {
// //       toast.error("Please select a company first.");
// //       return;
// //     }

// //     if (selectedLicenses.length === 0) {
// //       toast.error("Please select at least one license to export.");
// //       return;
// //     }

// //     // Find the company
// //     const company = companies.find((c) => c.companyId === selectedCompany);
// //     if (!company) {
// //       toast.error(`Company with ID ${selectedCompany} not found.`);
// //       return;
// //     }

// //     // Dispatch export with company ID
// //     dispatch(exportLicense(selectedCompany)).then((action) => {
// //       if (action.payload) {
// //         if (action.payload instanceof Blob) {
// //           const url = window.URL.createObjectURL(action.payload);
// //           const a = document.createElement("a");
// //           a.href = url;
// //           a.download = `license_export_${selectedCompany}_${selectedLicenses.length}_products.json`;
// //           a.click();
// //           window.URL.revokeObjectURL(url);
// //           toast.success(`Successfully exported ${selectedLicenses.length} license(s)!`);
// //         } else if (typeof action.payload === "string") {
// //           toast.error(`Export failed: ${action.payload}`);
// //         }
// //       } else if (action.error) {
// //         toast.error(`Export failed: ${action.error.message || "Unknown error"}`);
// //       }
// //     });
// //   };

// //   return (
// //     <div className="p-6 sm:p-8 md:p-10">
// //       {/* Page Title */}
// //       <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
// //         Export License
// //       </h1>

// //       {/* Loading indicator */}
// //       {status === "loading" ? (
// //         <p className="text-lg text-gray-500">Loading...</p>
// //       ) : (
// //         <>
// //           {/* Error alert */}
// //           {error && (
// //             <Alert
// //               message={`Error: ${error}`}
// //               type="error"
// //               showIcon
// //               className="mb-4"
// //             />
// //           )}

// //           {/* Company selection */}
// //           <div className="mb-6">
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Select Company
// //             </label>
// //             <Select
// //               className="w-full sm:w-[400px]"
// //               placeholder="Choose a company to view its licenses"
// //               onChange={handleCompanyChange}
// //               value={selectedCompany}
// //               size="large"
// //               showSearch
// //               filterOption={(input, option) =>
// //                 option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
// //               }
// //             >
// //               {companies.map((company) => (
// //                 <Select.Option key={company.companyId} value={company.companyId}>
// //                   {company.companyName || `Company ID: ${company.companyId}`}
// //                 </Select.Option>
// //               ))}
// //             </Select>
// //           </div>

// //           {/* License selection */}
// //           {selectedCompany && companyLicenses.length > 0 && (
// //             <Card
// //               title="Select Licenses to Export"
// //               className="mb-6"
// //               extra={
// //                 <span className="text-sm text-gray-500">
// //                   {selectedLicenses.length} of {companyLicenses.length} selected
// //                 </span>
// //               }
// //             >
// //               {/* Select All checkbox */}
// //               <div className="mb-4 p-3 bg-gray-50 rounded-lg">
// //                 <Checkbox
// //                   indeterminate={isIndeterminate}
// //                   onChange={handleSelectAll}
// //                   checked={isAllSelected}
// //                   className="font-medium"
// //                 >
// //                   <SelectOutlined className="mr-2" />
// //                   Select All Licenses ({companyLicenses.length})
// //                 </Checkbox>
// //               </div>

// //               <Divider className="my-4" />

// //               {/* Individual license checkboxes */}
// //               <div className="space-y-3 max-h-60 overflow-y-auto">
// //                 {companyLicenses.map((license) => (
// //                   <div
// //                     key={license.companyProductID}
// //                     className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
// //                   >
// //                     <Checkbox
// //                       checked={selectedLicenses.includes(license.companyProductID)}
// //                       onChange={(e) =>
// //                         handleLicenseChange(license.companyProductID, e.target.checked)
// //                       }
// //                       className="mr-3"
// //                     />
// //                     <div className="flex-1">
// //                       <div className="font-medium text-gray-900">
// //                         License ID: {license.companyProductID}
// //                       </div>
// //                       {license.productName && (
// //                         <div className="text-sm text-gray-500">
// //                           Product: {license.productName}
// //                         </div>
// //                       )}
// //                       {license.licenseType && (
// //                         <div className="text-xs text-gray-400">
// //                           Type: {license.licenseType}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </Card>
// //           )}

// //           {/* No licenses message */}
// //           {selectedCompany && companyLicenses.length === 0 && (
// //             <Alert
// //               message="No licenses found for the selected company"
// //               type="info"
// //               showIcon
// //               className="mb-4"
// //             />
// //           )}

// //           {/* Export button */}
// //           <Button
// //             type="primary"
// //             icon={<DownloadOutlined />}
// //             onClick={handleExport}
// //             disabled={!selectedCompany || selectedLicenses.length === 0}
// //             size="large"
// //             className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
// //           >
// //             Export Selected Licenses ({selectedLicenses.length})
// //           </Button>

// //           {/* Success alert */}
// //           {exportData && exportData instanceof Blob && (
// //             <Alert
// //               message="Export successful!"
// //               type="success"
// //               showIcon
// //               className="mt-6"
// //             />
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default ExportLicensePage;
