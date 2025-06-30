"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeeStructures, deleteFeeStructure } from "../slices/feeSlice";
import FeeStructureForm from "../components/FeeStructureForm";
import { Table, Button, Alert, Space, Popconfirm, Tag, Breadcrumb } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const FeePage = () => {
  const dispatch = useDispatch();
  const { feeStructures, status, error } = useSelector(
    (state) => state.fee || {}
  );
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedFee, setSelectedFee] = React.useState(null);

  useEffect(() => {
    dispatch(getFeeStructures());
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
    dispatch(deleteFeeStructure(record.feeID));
  };

  const FEE_TYPES = [
    { value: 1, label: "Registration", color: "blue" },
    { value: 2, label: "Subscription", color: "green" },
    { value: 3, label: "Maintenance", color: "purple" },
    { value: 4, label: "Upgrade", color: "cyan" },
    { value: 5, label: "Renewal", color: "orange" },
    { value: 6, label: "Other", color: "grey" },
  ];

  const LICENSE_TYPES = [
    { value: 1, label: "TimeLimitedLicenses" },
    { value: 2, label: "DeviceLimitedLicenses" },
    { value: 3, label: "FloatingLicenses" },
  ];

  const NO_OF_USERS_OR_DEVICES = [
    { value: 1, label: "ZeroToTen" },
    { value: 2, label: "ElevenToFifty" },
    { value: 3, label: "FiftyOneToHundred" },
    { value: 4, label: "Unlimited" },
  ];

  const columns = [
    {
      title: "Fee ID",
      dataIndex: "feeID",
      key: "feeID",
      render: (id) => id || "N/A",
      width: 150,
    },
    {
      title: "Fee Type",
      dataIndex: "feeType",
      key: "feeType",
      render: (type) => {
        const feeType = FEE_TYPES.find((t) => t.value === type);
        return feeType ? (
          <Tag color={feeType.color}>{feeType.label}</Tag>
        ) : (
          <Tag>Unknown</Tag>
        );
      },
      filters: FEE_TYPES.map((type) => ({
        text: type.label,
        value: type.value,
      })),
      onFilter: (value, record) => record.feeType === value,
      width: 150,
    },
    {
      title: "License Type",
      dataIndex: "licenseType",
      key: "licenseType",
      render: (type) => {
        const licenseType = LICENSE_TYPES.find((t) => t.value === type);
        return licenseType ? licenseType.label : "N/A";
      },
      width: 200,
    },
    {
      title: "Fee Amount",
      dataIndex: "feeAmount",
      key: "feeAmount",
      render: (amount) =>
        `$${Number(amount || 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
      sorter: (a, b) => (a.feeAmount || 0) - (b.feeAmount || 0),
      width: 120,
    },
    {
      title: "Number of Devices",
      dataIndex: "noOfDevice",
      key: "noOfDevice",
      render: (value) => {
        const option = NO_OF_USERS_OR_DEVICES.find((o) => o.value === value);
        return option ? option.label : "N/A";
      },
      width: 150,
    },
    {
      title: "Number of Users",
      dataIndex: "noOfUsers",
      key: "noOfUsers",
      render: (value) => {
        const option = NO_OF_USERS_OR_DEVICES.find((o) => o.value === value);
        return option ? option.label : "N/A";
      },
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
            title="Delete Fee Structure"
            description="Are you sure you want to delete this fee structure?"
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
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/fee-management">
            <HomeOutlined /> Fee Management
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <DollarOutlined /> Manage Fees
        </Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
        >
          Add Fee
        </Button>
      </div>

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
            `${range[0]}-${range[1]} of ${total} fee structures`,
        }}
        scroll={{ x: 1000 }}
        size="middle"
        bordered
      />

      <FeeStructureForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        feeStructure={selectedFee}
      />
    </div>
  );
};

export default FeePage;
