import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubscriptions,
  deleteSubscription,
} from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import SubscriptionForm from "../components/SubscriptionForm";
import { Table, Button, Alert, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CompanyProductSubscriptionPage = () => {
  const dispatch = useDispatch();
  const {
    subscriptions = [],
    status,
    error,
  } = useSelector((state) => state.subscription || {});
  const { companies = [] } = useSelector((state) => state.company || {});
  const { products = [] } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Fetch subscriptions, companies, and products on load
  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Trigger modal for add
  const handleAdd = () => {
    setSelectedSubscription(null);
    setIsFormOpen(true);
  };

  // Edit flow
  const handleEdit = (record) => {
    setSelectedSubscription(record);
    setIsFormOpen(true);
  };

  // Delete handler
  const handleDelete = (record) => {
    dispatch(deleteSubscription(record.companyProductID));
  };

  // Map companyID to readable name
  const getCompanyName = (companyID) => {
    const company = companies.find((c) => c.companyID === companyID);
    return company ? company.companyName : "Unknown";
  };

  // Map productID to readable name
  const getProductName = (productID) => {
    const product = products.find((p) => p.productID === productID);
    return product ? product.productName : "Unknown";
  };

  // Table columns with custom rendering
  const columns = [
    {
      title: "Company",
      dataIndex: "companyID",
      key: "companyID",
      render: (companyID) => getCompanyName(companyID),
    },
    {
      title: "Product",
      dataIndex: "productID",
      key: "productID",
      render: (productID) => getProductName(productID),
    },
    {
      title: "Notify Before (Days)",
      dataIndex: "notifyBeforeXDays",
      key: "notifyBeforeXDays",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            className="!bg-blue-600 !text-white !border-none hover:!bg-blue-700 rounded-md px-4 py-1 transition-all duration-300"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            className="rounded-md px-4 py-1 hover:!bg-red-100 transition-all duration-300"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 md:p-10">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Manage Subscriptions
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
        >
          Add Subscription
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* Table Box */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="companyProductID"
          loading={status === "loading"}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal Form */}
      <SubscriptionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default CompanyProductSubscriptionPage;
