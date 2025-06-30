"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyFeeStructures,
  deleteCompanyFeeStructure,
} from "../slices/companyFeeSlice"; // Ensure thunks are imported
import CompanyFeeForm from "../components/companyFeeForm";
import { Table, Button, Alert, Space, Popconfirm, Breadcrumb } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const CompanyFeePage = () => {
  const dispatch = useDispatch();
  const { feeStructures, status, error } = useSelector(
    (state) => state.companyFee || {}
  );
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedFee, setSelectedFee] = React.useState(null);

  useEffect(() => {
    dispatch(getCompanyFeeStructures());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedFee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedFee(record);
    setIsFormOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deleteCompanyFeeStructure(record.feeID));
  };

  const columns = [
    {
      title: "Fee ID",
      dataIndex: "feeID",
      key: "feeID",
      render: (id) => id || "N/A",
      width: 150,
    },
    {
      title: "Company Product ID",
      dataIndex: "companyProductID",
      key: "companyProductID",
      render: (id) => id || "N/A",
      width: 200,
    },
    {
      title: "Company ID",
      dataIndex: "companyID",
      key: "companyID",
      render: (id) => id || "N/A",
      width: 150,
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (amount) =>
        `$${Number(amount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
      sorter: (a, b) => (a.paidAmount || 0) - (b.paidAmount || 0),
      width: 120,
    },
    {
      title: "Unpaid Amount",
      dataIndex: "unpaidAmount",
      key: "unpaidAmount",
      render: (amount) =>
        `$${Number(amount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
      sorter: (a, b) => (a.unpaidAmount || 0) - (b.unpaidAmount || 0),
      width: 150,
    },
    {
      title: "Payable Amount",
      dataIndex: "payableAmount",
      key: "payableAmount",
      render: (amount) =>
        `$${Number(amount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
      sorter: (a, b) => (a.payableAmount || 0) - (b.payableAmount || 0),
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Company Fee Structure"
            description="Are you sure you want to delete this company fee structure?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fee-page">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/fee-management">
            <HomeOutlined /> Fee Management
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <DollarOutlined /> Manage Company Fees
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Add Company Fee
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={feeStructures}
        rowKey="feeID"
        loading={status === "loading"}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} company fee structures`,
        }}
        scroll={{ x: 1000 }}
        size="middle"
        bordered
      />

      {/* Form Modal */}
      <CompanyFeeForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        feeStructure={selectedFee}
      />
    </div>
  );
};

export default CompanyFeePage;
