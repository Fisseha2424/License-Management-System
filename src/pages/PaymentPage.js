// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Table, Button, Space, Popconfirm, message } from "antd";
// import PaymentInformationForm from "../components/PaymentInformationForm.js"; // Ensure the path is correct
// import {
//   getPayments,
//   createPayment,
//   updatePayment,
//   deletePayment,
// } from "../slices/paymentSlice";

// // Debug import
// console.log("Imported PaymentInformationForm:", PaymentInformationForm);

// const PaymentPage = () => {
//   const dispatch = useDispatch();
//   const { payments, status } = useSelector((state) => state.payment);
//   const [isFormVisible, setIsFormVisible] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   useEffect(() => {
//     dispatch(getPayments()).then((action) => {
//       console.log("Fetched payments data:", action.payload); // Log the data
//     });
//   }, [dispatch]);

//   const handleFormSubmit = (values) => {
//     const payload = {
//       companyFeeStructureID: values.companyFeeStructureID,
//       reference: values.reference,
//       paymentDate: values.paymentDate ? values.paymentDate.toISOString() : null,
//       expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
//       status: values.status,
//       paymentDocument: values.paymentDocument,
//       remark: values.remark,
//     };

//     if (selectedPayment) {
//       dispatch(
//         updatePayment({
//           paymentId: selectedPayment.PaymentID,
//           paymentData: payload,
//         })
//       )
//         .unwrap()
//         .then(() => {
//           message.success("Payment updated successfully");
//           setIsFormVisible(false);
//           dispatch(getPayments());
//         })
//         .catch((err) =>
//           message.error(`Failed to update payment: ${err.message}`)
//         );
//     } else {
//       dispatch(createPayment(payload))
//         .unwrap()
//         .then(() => {
//           message.success("Payment created successfully");
//           setIsFormVisible(false);
//           dispatch(getPayments());
//         })
//         .catch((err) =>
//           message.error(`Failed to create payment: ${err.message}`)
//         );
//     }
//     setSelectedPayment(null);
//   };

//   const handleDelete = async (paymentId) => {
//     console.log("Attempting to delete payment with ID:", paymentId);
//     if (!paymentId) {
//       message.error("Invalid payment ID. Cannot delete.");
//       return;
//     }
//     try {
//       await dispatch(deletePayment(paymentId)).unwrap();
//       message.success("Payment deleted successfully");
//       dispatch(getPayments());
//     } catch (err) {
//       message.error(`Failed to delete payment: ${err.message}`);
//     }
//   };

//   const columns = [
//     {
//       title: "Payment ID",
//       dataIndex: "PaymentID",
//       key: "PaymentID",
//       render: (text) => text || "N/A",
//     },
//     {
//       title: "Fee Structure ID",
//       dataIndex: "companyFeeStructureID",
//       key: "companyFeeStructureID",
//       render: (text) => text || "N/A",
//     },
//     {
//       title: "Reference",
//       dataIndex: "reference",
//       key: "reference",
//       render: (text) => text || "N/A",
//     },
//     {
//       title: "Payment Date",
//       dataIndex: "paymentDate",
//       key: "paymentDate",
//       render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
//     },
//     {
//       title: "Expiry Date",
//       dataIndex: "expiryDate",
//       key: "expiryDate",
//       render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <span
//           style={{
//             color:
//               status === 1 ? "#ff4d4f" : status === 2 ? "#52c41a" : "#faad14",
//           }}
//         >
//           {status === 1 ? "Pending" : status === 2 ? "Approved" : "Rejected"}
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
//       <PaymentInformationForm
//         visible={isFormVisible}
//         onCancel={() => {
//           setIsFormVisible(false);
//           setSelectedPayment(null);
//         }}
//         onSubmit={handleFormSubmit}
//         initialValues={selectedPayment}
//       />
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Popconfirm, message } from "antd";
import PaymentInformationForm from "../components/PaymentInformationForm.js";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  approvePayment,
  rejectPayment,
} from "../slices/paymentSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { payments, status } = useSelector((state) => state.payment);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    dispatch(getPayments()).then((action) => {
      console.log("Fetched payments data:", action.payload); // Debug log
    });
  }, [dispatch]);

  const handleFormSubmit = (values) => {
    const payload = {
      companyFeeStructureID: values.companyFeeStructureID,
      reference: values.reference,
      paymentDate: values.paymentDate ? values.paymentDate.toDate() : null,
      expiryDate: values.expiryDate ? values.expiryDate.toDate() : null,
      status: values.status,
      paymentDocument: values.paymentDocument,
      remark: values.remark,
    };

    if (selectedPayment) {
      dispatch(
        updatePayment({
          paymentId: selectedPayment.paymentInformationID,
          paymentData: payload,
        })
      )
        .unwrap()
        .then(() => {
          message.success("Payment updated successfully");
          setIsFormVisible(false);
          dispatch(getPayments());
        })
        .catch((err) =>
          message.error(`Failed to update payment: ${err.message}`)
        );
    } else {
      dispatch(createPayment(payload))
        .unwrap()
        .then(() => {
          message.success("Payment created successfully");
          setIsFormVisible(false);
          dispatch(getPayments());
        })
        .catch((err) =>
          message.error(`Failed to create payment: ${err.message}`)
        );
    }
    setSelectedPayment(null);
  };

  const handleDelete = async (paymentId) => {
    console.log("Attempting to delete payment with ID:", paymentId);
    if (!paymentId) {
      message.error("Invalid payment ID. Cannot delete.");
      return;
    }
    try {
      await dispatch(deletePayment(paymentId)).unwrap();
      message.success("Payment deleted successfully");
      dispatch(getPayments());
    } catch (err) {
      message.error(`Failed to delete payment: ${err.message}`);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      await dispatch(approvePayment(paymentId)).unwrap();
      message.success("Payment approved successfully");
      dispatch(getPayments());
    } catch (err) {
      message.error(`Failed to approve payment: ${err.message}`);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      await dispatch(rejectPayment(paymentId)).unwrap();
      message.success("Payment rejected successfully");
      dispatch(getPayments());
    } catch (err) {
      message.error(`Failed to reject payment: ${err.message}`);
    }
  };

  const columns = [
    {
      title: "Payment Information ID",
      dataIndex: "paymentInformationID",
      key: "paymentInformationID",
      render: (text) => text || "N/A",
    },
    {
      title: "Fee Structure ID",
      dataIndex: "companyFeeStructureID",
      key: "companyFeeStructureID",
      render: (text) => text || "N/A",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (text) => text || "N/A",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color:
              status === 1 ? "#ff4d4f" : status === 2 ? "#52c41a" : "#faad14",
          }}
        >
          {status === 1 ? "Pending" : status === 2 ? "Approved" : "Rejected"}
        </span>
      ),
    },
    {
      title: "Payment Document",
      dataIndex: "paymentDocument",
      key: "paymentDocument",
      render: (text) =>
        text ? (
          <img
            src={`data:image/png;base64,${text}`}
            alt="Payment Document"
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedPayment(record);
              setIsFormVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.paymentInformationID)}
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
          {record.status === 1 && (
            <>
              <Button
                onClick={() => handleApprove(record.paymentInformationID)}
              >
                Approve
              </Button>
              <Button onClick={() => handleReject(record.paymentInformationID)}>
                Reject
              </Button>
            </>
          )}
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
        rowKey="paymentInformationID"
      />
      <PaymentInformationForm
        visible={isFormVisible}
        onCancel={() => {
          setIsFormVisible(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={selectedPayment}
      />
    </div>
  );
};

export default PaymentPage;
