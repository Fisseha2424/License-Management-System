import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkExpiry, getLicenses } from "../slices/licenseSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import { Table, Alert, Button, Space } from "antd";

const CheckExpiryPage = () => {
  const dispatch = useDispatch();
  const { licenses, status, error } = useSelector(
    (state) => state.license || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );

  useEffect(() => {
    dispatch(getLicenses());
    dispatch(checkExpiry());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

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
      return {
        companyName: getCompanyName(subscription.companyID),
        productName: getProductName(subscription.productID),
      };
    }
    return { companyName: "Unknown", productName: "Unknown" };
  };

  const currentDate = new Date("2025-06-21T21:23:00Z"); // Updated to current time
  const thirtyDaysLater = new Date(currentDate);
  thirtyDaysLater.setDate(currentDate.getDate() + 30);

  const expiredLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return license.isExpired !== undefined
      ? license.isExpired
      : expiryDate < currentDate;
  });

  const nearToExpireLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return (
      !license.isExpired &&
      expiryDate >= currentDate &&
      expiryDate <= thirtyDaysLater
    );
  });

  const validLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return !license.isExpired && expiryDate > thirtyDaysLater;
  });

  const columns = [
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition duration-200"
            onClick={() => handleSendEmail(record.companyProductID)}
          >
            Send Email
          </Button>
        </Space>
      ),
    },
  ];

  const handleSendEmail = (companyProductID) => {
    console.log(`Sending email notification for license ${companyProductID}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Check Expiry</h1>
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {error && (
            <Alert
              message={`Error: ${error}`}
              type="error"
              className="mb-6 rounded-md"
            />
          )}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Expired Licenses
            </h2>
            <Table
              columns={columns}
              dataSource={expiredLicenses.map((license) => ({
                ...license,
                ...getSubscriptionDetails(license.companyProductID),
              }))}
              rowKey="companyProductID"
              loading={status === "loading"}
              pagination={false}
              className="ant-table-custom"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Near to Expire Licenses
            </h2>
            <Table
              columns={columns}
              dataSource={nearToExpireLicenses.map((license) => ({
                ...license,
                ...getSubscriptionDetails(license.companyProductID),
              }))}
              rowKey="companyProductID"
              loading={status === "loading"}
              pagination={false}
              className="ant-table-custom"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Valid Licenses
            </h2>
            <Table
              columns={columns}
              dataSource={validLicenses.map((license) => ({
                ...license,
                ...getSubscriptionDetails(license.companyProductID),
              }))}
              rowKey="companyProductID"
              loading={status === "loading"}
              pagination={false}
              className="ant-table-custom"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CheckExpiryPage;
