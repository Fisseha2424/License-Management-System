import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportLicense, getLicenses } from "../slices/licenseSlice";
import { getCompanies } from "../slices/companySlice";
import { Select, Button, Alert } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const ExportLicensePage = () => {
  const dispatch = useDispatch();
  const {
    licenses = [],
    status,
    error,
    exportData,
  } = useSelector((state) => state.license || {});
  const { companies = [] } = useSelector((state) => state.company || {});
  const [selectedLicense, setSelectedLicense] = useState(null);

  // Load licenses and companies on mount
  useEffect(() => {
    dispatch(getLicenses());
    dispatch(getCompanies());
    console.log("Licenses:", licenses); // Debug log for licenses
    // console.log("Companies:", companies); // Debug log for companies
  }, [dispatch]);

  // Handle export and trigger download
  const handleExport = () => {
    if (selectedLicense) {
      // Find the corresponding license
      const license = licenses.find(
        (l) => l.companyProductID === selectedLicense
      );
      if (!license) {
        toast.error("Selected license not found.");
        return;
      }

      // Extract companyId from license
      let companyId = license.companyID;
      console.log("License found:", license); // Debug log for the license object
      if (!companyId) {
        toast.error("Company ID is missing for the selected license.");
        return;
      }

      // Validate companyId against companies (optional, based on API expectation)
      const company = companies.find((c) => c.companyId === companyId);
      if (!company) {
        toast.error(`Company with ID ${companyId} not found in the database.`);
        return;
      }

      // Dispatch export with validated companyId
      dispatch(exportLicense(companyId)).then((action) => {
        if (action.payload) {
          if (action.payload instanceof Blob) {
            const url = window.URL.createObjectURL(action.payload);
            const a = document.createElement("a");
            a.href = url;
            a.download = `license_export_${companyId}.json`;
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

          {/* License dropdown */}
          <div className="mb-4">
            <Select
              className="w-full sm:w-[300px]"
              placeholder="Select a license to export"
              onChange={(value) => setSelectedLicense(value)}
              value={selectedLicense}
              size="large"
            >
              {licenses.map((license) => (
                <Select.Option
                  key={license.companyProductID}
                  value={license.companyProductID}
                >
                  License ID: {license.companyProductID}
                </Select.Option>
              ))}
            </Select>
          </div>

          {/* Export button */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!selectedLicense}
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
