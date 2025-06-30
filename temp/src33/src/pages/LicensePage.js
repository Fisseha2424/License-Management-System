import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLicenses } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import LicenseForm from "../components/LicenseForm";
import { Table, Button, Alert, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const LicensePage = () => {
  const dispatch = useDispatch();
  const { licenses, status, error } = useSelector(
    (state) => state.license || {}
  );
  const { subscriptions } = useSelector((state) => state.subscription || {});
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);

  // On component mount, fetch all data
  useEffect(() => {
    dispatch(getLicenses());
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Helpers to render related entity data
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

  // Table columns
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
      title: "License Key",
      dataIndex: "license",
      key: "license",
      render: (key) => key?.substring(0, 10) + "...",
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button
            className="!bg-gray-300 !text-gray-600 rounded-md px-4 py-1"
            disabled
          >
            Edit
          </Button>
          <Button
            danger
            className="rounded-md px-4 py-1 !bg-gray-300 !text-red-600"
            disabled
          >
            Delete
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
          Manage Licenses
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormOpen(true)}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
        >
          Generate License
        </Button>
      </div>

      {/* Error Message */}
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
          rowKey="moduleLicenceID"
          loading={status === "loading"}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* License Modal */}
      <LicenseForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default LicensePage;
