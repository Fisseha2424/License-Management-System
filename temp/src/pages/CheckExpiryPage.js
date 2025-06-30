import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkExpiry } from "../slices/licenseSlice";
import { Table, Alert } from "antd";

const CheckExpiryPage = () => {
  const dispatch = useDispatch();
  const { status, error, licenses } = useSelector((state) => state.license);

  useEffect(() => {
    dispatch(checkExpiry());
  }, [dispatch]);

  const columns = [
    { title: "Company ID", dataIndex: "companyId", key: "companyId" },
    { title: "License Type", dataIndex: "licenseType", key: "licenseType" },
    { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate" },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const expiryDate = new Date(record.expiryDate);
        const today = new Date();
        return expiryDate < today ? "Expired" : "Active";
      },
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="ml-64 p-6 w-full">
        <div className="bg-teal-100 p-4 mb-6 rounded-md text-center">
          <h2 className="text-3xl font-bold text-gray-800">Check Expiry</h2>
        </div>
        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert message={error} type="error" showIcon className="mb-4" />
          )}
          {status === "loading" ? (
            <p className="text-center">Loading...</p>
          ) : (
            <Table dataSource={licenses} columns={columns} rowKey="id" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckExpiryPage;
