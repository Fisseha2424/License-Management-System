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
              <Button
                type="link"
                onClick={handleSelectAll}
                disabled={filteredProducts.length === 0}
                className="mb-2"
              >
                Select All
              </Button>
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
