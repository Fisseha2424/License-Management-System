// // import React, { useState, useEffect } from 'react';
// // import { Table, Input, Button, Space, Select, message } from 'antd';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { SearchOutlined } from '@ant-design/icons';
// // import { getCompanies, getPayments, initiatePayment } from '../slices/licenseSlice';

// // const { Option } = Select;

// // const AssociatePayment = () => {
// //   const dispatch = useDispatch();
// //   const { companies, payments, status } = useSelector((state) => state.license);
// //   const [selectedCompany, setSelectedCompany] = useState(null);
// //   const [searchText, setSearchText] = useState('');
// //   const [searchedColumn, setSearchedColumn] = useState('');
// //   const [pagination, setPagination] = useState({
// //     current: 1,
// //     pageSize: 10,
// //     total: 0,
// //   });

// //   // useEffect(() => {
// //   //   dispatch(getCompanies());
// //   //   dispatch(getPayments());
// //   // }, [dispatch]);
// //   useEffect(() => {
// //   dispatch(getCompanies());
// //   if (selectedCompany) {
// //     dispatch(getPayments(selectedCompany));
// //   }
// // }, [dispatch, selectedCompany]);

// //   useEffect(() => {
// //     setPagination((prev) => ({ ...prev, total: payments.length }));
// //   }, [payments]);

// //   const handleTableChange = (pagination) => {
// //     setPagination(pagination);
// //   };

// //   const getColumnSearchProps = (dataIndex, title) => ({
// //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
// //       <div style={{ padding: 8 }}>
// //         <Input
// //           placeholder={`Search ${title}`}
// //           value={selectedKeys[0]}
// //           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
// //           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
// //           style={{ width: 188, marginBottom: 8, display: 'block' }}
// //         />
// //         <Space>
// //           <Button
// //             type="primary"
// //             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
// //             icon={<SearchOutlined />}
// //             size="small"
// //             style={{ width: 90 }}
// //           >
// //             Search
// //           </Button>
// //           <Button
// //             onClick={() => handleReset(clearFilters)}
// //             size="small"
// //             style={{ width: 90 }}
// //           >
// //             Reset
// //           </Button>
// //         </Space>
// //       </div>
// //     ),
// //     filterIcon: (filtered) => (
// //       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
// //     ),
// //     onFilter: (value, record) =>
// //       record[dataIndex]
// //         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
// //         : '',
// //   });

// //   const handleSearch = (selectedKeys, confirm, dataIndex) => {
// //     confirm();
// //     setSearchText(selectedKeys[0]);
// //     setSearchedColumn(dataIndex);
// //   };

// //   const handleReset = (clearFilters) => {
// //     clearFilters();
// //     setSearchText('');
// //   };

// //   const handleInitiatePayment = async (payment) => {
// //     if (!selectedCompany) {
// //       message.error('Please select a company');
// //       return;
// //     }
// //     try {
// //       await dispatch(initiatePayment({
// //         PaymentID: payment.PaymentID,
// //         CompanyID: selectedCompany,
// //         Amount: payment.Amount,
// //         Date: new Date().toISOString(),
// //         Status: 'Pending',
// //       })).unwrap();
// //       message.success('Payment initiated via Telebirr');
// //     } catch (err) {
// //       message.error('Failed to initiate payment');
// //     }
// //   };

// //   const columns = [
// //     {
// //       title: 'Payment ID',
// //       dataIndex: 'PaymentID',
// //       key: 'PaymentID',
// //       ...getColumnSearchProps('PaymentID', 'Payment ID'),
// //     },
// //     {
// //       title: 'Company Name',
// //       dataIndex: 'CompanyID',
// //       key: 'CompanyID',
// //       render: (companyID) => {
// //         const company = companies.find((c) => c.CompanyID === companyID);
// //         return company ? company.CompanyName : companyID;
// //       },
// //       ...getColumnSearchProps('CompanyID', 'Company Name'),
// //     },
// //     {
// //       title: 'Amount',
// //       dataIndex: 'Amount',
// //       key: 'Amount',
// //       render: (amount) => `$${amount.toFixed(2)}`,
// //     },
// //     {
// //       title: 'Date',
// //       dataIndex: 'Date',
// //       key: 'Date',
// //       render: (date) => new Date(date).toLocaleDateString(),
// //     },
// //     {
// //       title: 'Status',
// //       dataIndex: 'Status',
// //       key: 'Status',
// //       render: (status) => (
// //         <span
// //           style={{
// //             color: status === 'Pending' || status === 'Initiated' ? '#ff4d4f' : '#52c41a',
// //             fontWeight: 'bold',
// //           }}
// //         >
// //           {status}
// //         </span>
// //       ),
// //     },
// //     {
// //       title: 'Actions',
// //       key: 'actions',
// //       render: (_, record) => (
// //         <Button
// //           type="primary"
// //           onClick={() => handleInitiatePayment(record)}
// //           disabled={record.Status !== 'Pending'}
// //         >
// //           Initiate Payment
// //         </Button>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div className="container p-6">
// //       <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
// //       <Space style={{ marginBottom: 16 }}>
// //         <Select
// //           placeholder="Select Company"
// //           style={{ width: 200 }}
// //           onChange={(value) => setSelectedCompany(value)}
// //           value={selectedCompany}
// //         >
// //           {companies.map((company) => (
// //             <Option key={company.CompanyID} value={company.CompanyID}>
// //               {company.CompanyName}
// //             </Option>
// //           ))}
// //         </Select>
// //       </Space>
// //       <Table
// //         columns={columns}
// //         dataSource={payments}
// //         loading={status === 'loading'}
// //         pagination={pagination}
// //         onChange={handleTableChange}
// //         rowKey="PaymentID"
// //         scroll={{ x: 'max-content' }}
// //       />
// //     </div>
// //   );
// // };

// // export default AssociatePayment;

// import React, { useState, useEffect } from 'react';
// import { Table, Input, Button, Space, Select, message } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { SearchOutlined } from '@ant-design/icons';
// // import { getCompanies, getPayments, initiatePayment } from '../slices/paymentSlice';

// const { Option } = Select;

// const AssociatePayment = () => {
//   const dispatch = useDispatch();
//   const { companies, payments, status } = useSelector((state) => state.payment);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   // useEffect(() => {
//   //   dispatch(getCompanies());
//   //   if (selectedCompany) {
//   //     dispatch(getPayments(selectedCompany));
//   //   }
//   // }, [dispatch, selectedCompany]);

//   useEffect(() => {
//     setPagination((prev) => ({ ...prev, total: payments.length }));
//   }, [payments]);

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
//   };

//   const getColumnSearchProps = (dataIndex, title) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           placeholder={`Search ${title}`}
//           value={selectedKeys[0]}
//           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ width: 188, marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => handleReset(clearFilters)}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Reset
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex]
//         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//         : '',
//   });

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText('');
//   };

//   const handleInitiatePayment = async (payment) => {
//     if (!selectedCompany) {
//       message.error('Please select a company');
//       return;
//     }
//     try {
//       await dispatch(initiatePayment({
//         PaymentID: payment.PaymentID,
//         CompanyID: selectedCompany,
//         Amount: payment.Amount,
//         Date: new Date().toISOString(),
//         Status: 'Pending',
//       })).unwrap();
//       message.success('Payment initiated via Telebirr');
//     } catch (err) {
//       message.error('Failed to initiate payment');
//     }
//   };

//   const columns = [
//     {
//       title: 'Payment ID',
//       dataIndex: 'PaymentID',
//       key: 'PaymentID',
//       ...getColumnSearchProps('PaymentID', 'Payment ID'),
//     },
//     {
//       title: 'Company Name',
//       dataIndex: 'CompanyID',
//       key: 'CompanyID',
//       render: (companyID) => {
//         const company = companies.find((c) => c.companyID === companyID); // Adjusted to companyID
//         return company ? company.companyName : companyID; // Adjusted to companyName
//       },
//       ...getColumnSearchProps('CompanyID', 'Company Name'),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'Amount',
//       key: 'Amount',
//       render: (amount) => `$${amount.toFixed(2)}`,
//     },
//     {
//       title: 'Date',
//       dataIndex: 'Date',
//       key: 'Date',
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'Status',
//       key: 'Status',
//       render: (status) => (
//         <span
//           style={{
//             color: status === 'Pending' || status === 'Initiated' ? '#ff4d4f' : '#52c41a',
//             fontWeight: 'bold',
//           }}
//         >
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Button
//           type="primary"
//           onClick={() => handleInitiatePayment(record)}
//           disabled={record.Status !== 'Pending'}
//         >
//           Initiate Payment
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="container p-6">
//       <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
//       <Space style={{ marginBottom: 16 }}>
//         <Select
//           placeholder="Select Company"
//           style={{ width: 200 }}
//           onChange={(value) => setSelectedCompany(value)}
//           value={selectedCompany}
//         >
//           {companies.map((company) => (
//             <Option key={company.companyID} value={company.companyID}> {/* Adjusted to companyID */}
//               {company.companyName} {/* Adjusted to companyName */}
//             </Option>
//           ))}
//         </Select>
//       </Space>
//       <Table
//         columns={columns}
//         dataSource={payments}
//         loading={status === 'loading'}
//         pagination={pagination}
//         onChange={handleTableChange}
//         rowKey="PaymentID"
//         scroll={{ x: 'max-content' }}
//       />
//     </div>
//   );
// };

// export default AssociatePayment;

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Select,
  Form,
  DatePicker,
  Modal,
  Upload,
  message,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import {
  getCompanies,
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../slices/paymentSlice";

const { Option } = Select;
const { TextArea } = Input;

const AssociatePayment = () => {
  const dispatch = useDispatch();
  const { companies, payments, status } = useSelector((state) => state.payment);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getCompanies());
    if (selectedCompany) {
      dispatch(getPayments(selectedCompany));
    } else {
      dispatch(getPayments());
    }
  }, [dispatch, selectedCompany]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: payments.length }));
  }, [payments]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      PaymentID: selectedPayment?.PaymentID || Date.now().toString(),
      CompanyID: selectedCompany,
      PaymentDate: values.PaymentDate.toISOString(),
      PaymentDocument:
        values.PaymentDocument?.[0]?.originFileObj ||
        selectedPayment?.PaymentDocument ||
        null,
      Status: values.Status || "Pending",
    };
    try {
      if (selectedPayment) {
        await dispatch(
          updatePayment({
            paymentId: selectedPayment.PaymentID,
            paymentData: payload,
          })
        ).unwrap();
        message.success("Payment updated successfully");
      } else {
        await dispatch(createPayment(payload)).unwrap();
        message.success("Payment created successfully");
      }
      setIsFormVisible(false);
      form.resetFields();
      setSelectedPayment(null);
      if (selectedCompany) dispatch(getPayments(selectedCompany));
    } catch (err) {
      message.error(
        `Failed to ${selectedPayment ? "update" : "create"} payment: ${
          err.message
        }`
      );
    }
  };

  const handleDelete = async (paymentId) => {
    try {
      await dispatch(deletePayment(paymentId)).unwrap();
      message.success("Payment deleted successfully");
      if (selectedCompany) dispatch(getPayments(selectedCompany));
    } catch (err) {
      message.error(`Failed to delete payment: ${err.message}`);
    }
  };

  const columns = [
    {
      title: "Payment ID",
      dataIndex: "PaymentID",
      key: "PaymentID",
      ...getColumnSearchProps("PaymentID", "Payment ID"),
    },
    {
      title: "Company Name",
      dataIndex: "CompanyID",
      key: "CompanyID",
      render: (companyID) => {
        const company = companies.find((c) => c.companyID === companyID);
        return company ? company.companyName : "N/A";
      },
      ...getColumnSearchProps("CompanyID", "Company Name"),
    },
    {
      title: "Fee Structure ID",
      dataIndex: "CompanyFeeStructureID",
      key: "CompanyFeeStructureID",
      ...getColumnSearchProps("CompanyFeeStructureID", "Fee Structure ID"),
    },
    {
      title: "Amount",
      dataIndex: "PayableAmount",
      key: "PayableAmount",
      render: (amount) => `$${amount ? amount.toFixed(2) : "0.00"}`,
    },
    {
      title: "Date",
      dataIndex: "PaymentDate",
      key: "PaymentDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => (
        <span
          style={{
            color:
              status === "Pending" || status === "Initiated"
                ? "#ff4d4f"
                : "#52c41a",
            fontWeight: "bold",
          }}
        >
          {status || "N/A"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedPayment(record);
              form.setFieldsValue(record);
              setIsFormVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.PaymentID)}
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
          <Button
            type="primary"
            onClick={() => handleFormSubmit({ ...record, Status: "Initiated" })}
            disabled={record.Status !== "Pending"}
          >
            Initiate Payment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="container p-6">
      <h2 className="text-2xl font-bold mb-4">Associate Payment</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Company"
          style={{ width: 200 }}
          onChange={(value) => setSelectedCompany(value)}
          value={selectedCompany}
        >
          {companies.map((company) => (
            <Option key={company.companyID} value={company.companyID}>
              {company.companyName}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={() => {
            setSelectedPayment(null);
            form.resetFields();
            setIsFormVisible(true);
          }}
        >
          Add Payment
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={payments}
        loading={status === "loading"}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="PaymentID"
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={selectedPayment ? "Edit Payment" : "Add Payment"}
        open={isFormVisible}
        onCancel={() => {
          setIsFormVisible(false);
          form.resetFields();
          setSelectedPayment(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="CompanyFeeStructureID"
            label="Fee Structure ID"
            rules={[
              { required: true, message: "Please enter Fee Structure ID" },
            ]}
          >
            <Input placeholder="Enter Fee Structure ID" />
          </Form.Item>
          <Form.Item
            name="Reference"
            label="Reference"
            rules={[{ required: true, message: "Please enter reference" }]}
          >
            <Input placeholder="Enter reference number" />
          </Form.Item>
          <Form.Item
            name="PaymentDate"
            label="Payment Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="PaymentDocument"
            label="Upload Document"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="Status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Pending">Pending</Option>
              <Option value="Initiated">Initiated</Option>
              <Option value="Approved">Approved</Option>
            </Select>
          </Form.Item>
          <Form.Item name="Remark" label="Remark">
            <TextArea placeholder="Enter remarks" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={status === "loading"}
            >
              {selectedPayment ? "Update" : "Save"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssociatePayment;
