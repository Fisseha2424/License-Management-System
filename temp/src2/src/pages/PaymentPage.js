// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Upload,
//   message,
//   Space,
//   Select,
//   Popconfirm,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import {
//   getPayments,
//   createPayment,
//   updatePayment,
//   deletePayment,
// } from "../slices/paymentSlice";

// const { TextArea } = Input;

// const PaymentPage = () => {
//   const dispatch = useDispatch();
//   const { payments, status } = useSelector((state) => state.payment);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [form] = Form.useForm();
//   const { Option } = Select;

//   useEffect(() => {
//     dispatch(getPayments());
//   }, [dispatch]);

//   const handleFormSubmit = async (values) => {
//     const payload = {
//       ...values,
//       PaymentID: selectedPayment?.PaymentID || Date.now().toString(),
//       PaymentDate: values.PaymentDate.toISOString(),
//       PaymentDocument:
//         values.PaymentDocument?.[0]?.originFileObj ||
//         selectedPayment?.PaymentDocument ||
//         null,
//       Status: values.Status || "Pending",
//     };
//     try {
//       if (selectedPayment) {
//         await dispatch(
//           updatePayment({
//             paymentId: selectedPayment.PaymentID,
//             paymentData: payload,
//           })
//         ).unwrap();
//         message.success("Payment updated successfully");
//       } else {
//         await dispatch(createPayment(payload)).unwrap();
//         message.success("Payment created successfully");
//       }
//       setIsFormVisible(false);
//       form.resetFields();
//       setSelectedPayment(null);
//       dispatch(getPayments());
//     } catch (err) {
//       message.error(
//         `Failed to ${selectedPayment ? "update" : "create"} payment: ${
//           err.message
//         }`
//       );
//     }
//   };

//   const handleDelete = async (paymentId) => {
//     try {
//       await dispatch(deletePayment(paymentId)).unwrap();
//       message.success("Payment deleted successfully");
//       dispatch(getPayments());
//     } catch (err) {
//       message.error(`Failed to delete payment: ${err.message}`);
//     }
//   };

//   const columns = [
//     { title: "Payment ID", dataIndex: "PaymentID", key: "PaymentID" },
//     {
//       title: "Fee Structure ID",
//       dataIndex: "CompanyFeeStructureID",
//       key: "CompanyFeeStructureID",
//     },
//     { title: "Reference", dataIndex: "Reference", key: "Reference" },
//     {
//       title: "Date",
//       dataIndex: "PaymentDate",
//       key: "PaymentDate",
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: "Status",
//       dataIndex: "Status",
//       key: "Status",
//       render: (status) => (
//         <span style={{ color: status === "Pending" ? "#ff4d4f" : "#52c41a" }}>
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space>
//           <Button
//             onClick={() => {
//               setSelectedPayment(record);
//               form.setFieldsValue(record);
//               setIsFormVisible(true);
//             }}
//           >
//             Edit
//           </Button>
//           <Popconfirm
//             title="Sure to delete?"
//             onConfirm={() => handleDelete(record.PaymentID)}
//           >
//             <Button type="danger">Delete</Button>
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="container p-6">
//       <h1 className="text-2xl font-bold mb-4">Payments</h1>
//       <Button
//         type="primary"
//         onClick={() => {
//           setSelectedPayment(null);
//           form.resetFields();
//           setIsFormVisible(true);
//         }}
//         style={{ marginBottom: "20px" }}
//       >
//         Add Payment
//       </Button>
//       <Table
//         columns={columns}
//         dataSource={payments}
//         loading={status === "loading"}
//         pagination={{ pageSize: 10 }}
//         rowKey="PaymentID"
//       />
//       <Modal
//         title={selectedPayment ? "Edit Payment" : "Add Payment"}
//         open={isFormVisible}
//         onCancel={() => {
//           setIsFormVisible(false);
//           form.resetFields();
//           setSelectedPayment(null);
//         }}
//         footer={null}
//       >
//         <Form form={form} onFinish={handleFormSubmit} layout="vertical">
//           <Form.Item
//             name="CompanyFeeStructureID"
//             label="Fee Structure ID"
//             rules={[
//               { required: true, message: "Please enter Fee Structure ID" },
//             ]}
//           >
//             <Input placeholder="Enter Fee Structure ID" />
//           </Form.Item>
//           <Form.Item
//             name="Reference"
//             label="Reference"
//             rules={[{ required: true, message: "Please enter reference" }]}
//           >
//             <Input placeholder="Enter reference number" />
//           </Form.Item>
//           <Form.Item
//             name="PaymentDate"
//             label="Payment Date"
//             rules={[{ required: true, message: "Please select a date" }]}
//           >
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item
//             name="PaymentDocument"
//             label="Upload Document"
//             valuePropName="fileList"
//             getValueFromEvent={(e) => e.fileList}
//           >
//             <Upload beforeUpload={() => false} maxCount={1}>
//               <Button icon={<UploadOutlined />}>Click to Upload</Button>
//             </Upload>
//           </Form.Item>
//           <Form.Item
//             name="Status"
//             label="Status"
//             rules={[{ required: true, message: "Please select status" }]}
//           >
//             <Select placeholder="Select status">
//               <Option value="Pending">Pending</Option>
//               <Option value="Approved">Approved</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item name="Remark" label="Remark">
//             <TextArea placeholder="Enter remarks" />
//           </Form.Item>
//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={status === "loading"}
//             >
//               {selectedPayment ? "Update" : "Save"}
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  message,
  Space,
  Select,
  Popconfirm,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../slices/paymentSlice";

const { TextArea } = Input;

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { payments, status } = useSelector((state) => state.payment);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form] = Form.useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(getPayments());
  }, [dispatch]);

  // const handleFormSubmit = async (values) => {
  //   let paymentDocument = null;
  //   if (values.paymentDocument?.[0]?.originFileObj) {
  //     const formData = new FormData();
  //     formData.append("file", values.paymentDocument[0].originFileObj);
  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const result = await response.json();
  //     paymentDocument = result.url; // Adjust based on your API response
  //   } else {
  //     paymentDocument = selectedPayment?.paymentDocument || null;
  //   }

  //   const payload = {
  //     companyFeeStructureID: values.companyFeeStructureID,
  //     reference: values.reference,
  //     paymentDate: values.paymentDate.toISOString(),
  //     paymentDocument: paymentDocument,
  //     status: values.status || "Pending",
  //     remark: values.remark || "",
  //   };

  //   try {
  //     if (selectedPayment) {
  //       await dispatch(
  //         updatePayment({
  //           paymentId: selectedPayment.PaymentID,
  //           paymentData: payload,
  //         })
  //       ).unwrap();
  //       message.success("Payment updated successfully");
  //     } else {
  //       await dispatch(createPayment(payload)).unwrap();
  //       message.success("Payment created successfully");
  //     }
  //     setIsFormVisible(false);
  //     form.resetFields();
  //     setSelectedPayment(null);
  //     dispatch(getPayments());
  //   } catch (err) {
  //     message.error(
  //       `Failed to ${selectedPayment ? "update" : "create"} payment: ${
  //         err.message
  //       }`
  //     );
  //   }
  // };
  const handleFormSubmit = async (values) => {
    let paymentDocument = null;
    if (values.paymentDocument?.[0]?.originFileObj) {
      const formData = new FormData();
      formData.append("file", values.paymentDocument[0].originFileObj);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        paymentDocument = result.url; // Adjust based on your API
      } else {
        message.error("File upload failed");
        return; // Stop submission if upload fails
      }
    } else {
      paymentDocument = selectedPayment?.paymentDocument || null;
    }

    const payload = {
      companyFeeStructureID: values.companyFeeStructureID,
      reference: values.reference,
      paymentDate: values.paymentDate.toISOString(),
      paymentDocument: paymentDocument, // Will be null if no file or upload fails
      status: values.status || "Pending",
      remark: values.remark || "",
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
      dispatch(getPayments());
    } catch (err) {
      console.log("Error Details:", err); // Debug error
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
      dispatch(getPayments());
    } catch (err) {
      message.error(`Failed to delete payment: ${err.message}`);
    }
  };

  const columns = [
    { title: "Payment ID", dataIndex: "PaymentID", key: "PaymentID" },
    {
      title: "Fee Structure ID",
      dataIndex: "companyFeeStructureID",
      key: "companyFeeStructureID",
    },
    { title: "Reference", dataIndex: "reference", key: "reference" },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "Pending" ? "#ff4d4f" : "#52c41a" }}>
          {status}
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
              form.setFieldsValue({
                companyFeeStructureID: record.companyFeeStructureID,
                reference: record.reference,
                paymentDate: record.paymentDate
                  ? new Date(record.paymentDate)
                  : null,
                paymentDocument: record.paymentDocument
                  ? [{ url: record.paymentDocument }]
                  : [],
                status: record.status,
                remark: record.remark,
              });
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
        </Space>
      ),
    },
  ];

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <Button
        type="primary"
        onClick={() => {
          setSelectedPayment(null);
          form.resetFields();
          setIsFormVisible(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        Add Payment
      </Button>
      <Table
        columns={columns}
        dataSource={payments}
        loading={status === "loading"}
        pagination={{ pageSize: 10 }}
        rowKey="PaymentID"
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
            name="companyFeeStructureID"
            label="Fee Structure ID"
            rules={[
              { required: true, message: "Please enter Fee Structure ID" },
            ]}
          >
            <Input placeholder="Enter Fee Structure ID" />
          </Form.Item>
          <Form.Item
            name="reference"
            label="Reference"
            rules={[{ required: true, message: "Please enter reference" }]}
          >
            <Input placeholder="Enter reference number" />
          </Form.Item>
          <Form.Item
            name="paymentDate"
            label="Payment Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="paymentDocument"
            label="Upload Document"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="Remark">
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

export default PaymentPage;
