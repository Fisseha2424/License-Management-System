import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLicenses, exportLicense } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import LicenseForm from "../components/GenerateLicenseForm";
import { Button, Alert, Table, Space } from "antd";
import {
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const GenerateLicensePage = () => {
  const dispatch = useDispatch();
  const {
    licenses = [],
    status,
    error,
  } = useSelector((state) => state.license || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { companies = [] } = useSelector((state) => state.company || {});
  const { products = [] } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  // Fetch all necessary data on mount
  useEffect(() => {
    dispatch(getLicenses());
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Helper to fetch readable names
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
    return subscription
      ? `${getCompanyName(subscription.companyID)} - ${getProductName(
          subscription.productID
        )}`
      : "Unknown";
  };

  // Trigger download of license
  const handleDownload = (companyProductID) => {
    dispatch(exportLicense(companyProductID)).then((action) => {
      if (action.payload) {
        const jsonData = JSON.stringify(action.payload, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `license_${companyProductID}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  const handleEdit = (record) => {
    setSelectedLicense(record);
    setIsFormOpen(true);
  };

  // Table structure
  const columns = [
    {
      title: "Subscription",
      dataIndex: "companyProductID",
      key: "companyProductID",
      render: (id) => getSubscriptionDetails(id),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "No. of Devices", dataIndex: "noOfDevice", key: "noOfDevice" },
    { title: "No. of Users", dataIndex: "noOfUser", key: "noOfUser" },
    { title: "License Type", dataIndex: "licenseType", key: "licenseType" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.companyProductID)}
          >
            Download
          </Button>
          <Button
            icon={<EditOutlined />}
            type="primary"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Generate Licenses
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedLicense(null);
            setIsFormOpen(true);
          }}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
        >
          Generate New License
        </Button>
      </div>

      {/* Alert for error */}
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* License Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={licenses}
          rowKey="companyProductID"
          loading={status === "loading"}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* License Modal Form */}
      <LicenseForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        license={selectedLicense}
      />
    </div>
  );
};

export default GenerateLicensePage;
