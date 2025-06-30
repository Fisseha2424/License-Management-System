// "use client";

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getFeeStructures,
//   deleteFeeStructure,
//   getCompanies,
// } from "../slices/feeSlice";
// import FeeStructureForm from "../components/FeeStructureForm";
// import {
//   Table,
//   Button,
//   Alert,
//   Space,
//   Popconfirm,
//   Tag,
//   Typography,
//   Breadcrumb,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   HomeOutlined,
//   DollarOutlined,
// } from "@ant-design/icons";
// import { Link } from "react-router-dom";

// const { Title } = Typography;

// const FeePage = () => {
//   const dispatch = useDispatch();
//   const { feeStructures, companies, status, error } = useSelector(
//     (state) => state.fee || {}
//   );
//   const [isFormOpen, setIsFormOpen] = React.useState(false);
//   const [selectedFee, setSelectedFee] = React.useState(null);

//   useEffect(() => {
//     dispatch(getFeeStructures());
//     dispatch(getCompanies());
//   }, [dispatch]);

//   const handleAdd = () => {
//     setSelectedFee(null);
//     setIsFormOpen(true);
//   };

//   const handleEdit = (record) => {
//     setSelectedFee(record);
//     setIsFormOpen(true);
//   };

//   const handleDelete = async (record) => {
//     try {
//       await dispatch(
//         deleteFeeStructure(record.FeeStructureID || record.feeID)
//       ).unwrap();
//     } catch (error) {
//       console.error("Error deleting fee structure:", error);
//     }
//   };

//   const getCompanyName = (companyID) => {
//     const company = companies.find(
//       (c) => c.companyID === companyID || c.CompanyID === companyID
//     );
//     return company
//       ? company.companyName || company.CompanyName || `Company ${companyID}`
//       : "Unknown Company";
//   };

//   const FEE_TYPES = [
//     { value: 1, label: "Fixed", color: "blue" },
//     { value: 2, label: "Variable", color: "green" },
//   ];

//   const columns = [
//     {
//       title: "Fee Structure ID",
//       dataIndex: "FeeStructureID",
//       key: "FeeStructureID",
//       render: (id) => id || "N/A",
//       width: 150,
//     },
//     {
//       title: "Company",
//       dataIndex: "companyID",
//       key: "companyID",
//       render: (companyID) => getCompanyName(companyID),
//       width: 200,
//     },
//     {
//       title: "Fee Amount",
//       dataIndex: "feeAmount",
//       key: "feeAmount",
//       render: (amount) =>
//         `$${Number(amount || 0).toLocaleString("en-US", {
//           minimumFractionDigits: 2,
//         })}`,
//       sorter: (a, b) => (a.feeAmount || 0) - (b.feeAmount || 0),
//       width: 120,
//     },
//     {
//       title: "Fee Type",
//       dataIndex: "feeType",
//       key: "feeType",
//       render: (type) => {
//         const feeType = FEE_TYPES.find((t) => t.value === type);
//         return feeType ? (
//           <Tag color={feeType.color}>{feeType.label}</Tag>
//         ) : (
//           <Tag>Unknown</Tag>
//         );
//       },
//       filters: FEE_TYPES.map((type) => ({
//         text: type.label,
//         value: type.value,
//       })),
//       onFilter: (value, record) => record.feeType === value,
//       width: 100,
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//       render: (category) => category || "N/A",
//       width: 120,
//     },
//     {
//       title: "Discount %",
//       dataIndex: "discountPercentage",
//       key: "discountPercentage",
//       render: (discount) => `${discount || 0}%`,
//       width: 100,
//     },
//     {
//       title: "Start Date",
//       dataIndex: "paymentStartDate",
//       key: "paymentStartDate",
//       render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
//       sorter: (a, b) =>
//         new Date(a.paymentStartDate || 0) - new Date(b.paymentStartDate || 0),
//       width: 120,
//     },
//     {
//       title: "End Date",
//       dataIndex: "paymentEndDate",
//       key: "paymentEndDate",
//       render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
//       sorter: (a, b) =>
//         new Date(a.paymentEndDate || 0) - new Date(b.paymentEndDate || 0),
//       width: 120,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       fixed: "right",
//       width: 150,
//       render: (_, record) => (
//         <Space size="small">
//           <Button
//             type="primary"
//             size="small"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Delete Fee Structure"
//             description="Are you sure you want to delete this fee structure?"
//             onConfirm={() => handleDelete(record)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger size="small" icon={<DeleteOutlined />}>
//               Delete
//             </Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="fee-page">
//       {/* Breadcrumb */}
//       <Breadcrumb className="mb-4">
//         <Breadcrumb.Item>
//           <Link to="/fee-management">
//             <HomeOutlined /> Fee Management
//           </Link>
//         </Breadcrumb.Item>
//         <Breadcrumb.Item>
//           <DollarOutlined /> Manage Fees
//         </Breadcrumb.Item>
//       </Breadcrumb>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={handleAdd}
//           size="large"
//         >
//           Add Fee Structure
//         </Button>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Alert
//           message="Error"
//           description={error}
//           type="error"
//           showIcon
//           closable
//           className="mb-4"
//         />
//       )}

//       {/* Table */}
//       <Table
//         columns={columns}
//         dataSource={feeStructures}
//         rowKey={(record) =>
//           record.FeeStructureID || record.feeID || Math.random()
//         }
//         loading={status === "loading"}
//         pagination={{
//           pageSize: 10,
//           showSizeChanger: true,
//           showQuickJumper: true,
//           showTotal: (total, range) =>
//             `${range[0]}-${range[1]} of ${total} fee structures`,
//         }}
//         scroll={{ x: 1200 }}
//         size="middle"
//         bordered
//       />

//       {/* Form Modal */}
//       <FeeStructureForm
//         open={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         feeStructure={selectedFee}
//       />
//     </div>
//   );
// };

// export default FeePage;

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
    dispatch(deleteFeeStructure(record.FeeStructureID));
  };

  const FEE_TYPES = [
    { value: 1, label: "Fixed", color: "blue" },
    { value: 2, label: "Variable", color: "green" },
  ];

  const columns = [
    {
      title: "Fee ID",
      dataIndex: "FeeStructureID",
      key: "FeeStructureID",
      render: (id) => id || "N/A",
      width: 150,
    },
    {
      title: "Company",
      dataIndex: "companyID",
      key: "companyID",
      render: (companyID) => companyID || "N/A",
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
      width: 100,
    },
    {
      title: "Start Date",
      dataIndex: "paymentStartDate",
      key: "paymentStartDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.paymentStartDate || 0) - new Date(b.paymentStartDate || 0),
      width: 120,
    },
    {
      title: "End Date",
      dataIndex: "paymentEndDate",
      key: "paymentEndDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.paymentEndDate || 0) - new Date(b.paymentEndDate || 0),
      width: 120,
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
      {/* Breadcrumb */}
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

      {/* Header */}
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
        rowKey="FeeStructureID"
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

      {/* Form Modal */}
      <FeeStructureForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        feeStructure={selectedFee}
      />
    </div>
  );
};

export default FeePage;
