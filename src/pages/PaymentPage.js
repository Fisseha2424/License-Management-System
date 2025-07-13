import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Popconfirm, message, Modal, Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import PaymentInformationForm from "../components/PaymentInformationForm.js";
import {
  getPayments,
  createPayment,
  deletePayment,
  approvePayment,
  rejectPayment,
} from "../slices/paymentSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const { payments, status } = useSelector((state) => state.payment);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(getPayments()).then((action) => {
      console.log("Fetched payments data:", action.payload); // Debug log
    });
  }, [dispatch]);

  // Helper function to convert date values safely
  const convertToDate = (dateValue) => {
    if (!dateValue) return null;

    // If it's already a Date object
    if (dateValue instanceof Date) {
      return dateValue;
    }

    // If it's a dayjs object (Ant Design v4+)
    if (dateValue && typeof dateValue.toDate === "function") {
      return dateValue.toDate();
    }

    // If it has a format method (dayjs/moment), convert to string first then to Date
    if (dateValue && typeof dateValue.format === "function") {
      return new Date(dateValue.format("YYYY-MM-DD"));
    }

    // If it's a string or timestamp, convert to Date
    return new Date(dateValue);
  };

  const handleFormSubmit = (values) => {
    // Convert dates safely without using .toDate() directly
    const paymentDate = convertToDate(values.paymentDate);
    const expiryDate = convertToDate(values.expiryDate);

    const payload = {
      companyFeeStructureID: values.companyFeeStructureID,
      reference: values.reference,
      paymentDate: paymentDate ? paymentDate.toISOString() : null,
      expiryDate: expiryDate ? expiryDate.toISOString() : null,
      status: values.status,
      paymentDocument: values.paymentDocument,
      remark: values.remark,
    };

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
      dispatch(getPayments()); // Refresh the table to reflect the new status
    } catch (err) {
      message.error(`Failed to approve payment: ${err.message}`);
    }
  };

  const handleReject = async (paymentId) => {
    try {
      await dispatch(rejectPayment(paymentId)).unwrap();
      message.success("Payment rejected successfully");
      dispatch(getPayments()); // Refresh the table to reflect the new status
    } catch (err) {
      message.error(`Failed to reject payment: ${err.message}`);
    }
  };

  // Function to handle image click
  const handleImageClick = (imageData) => {
    setSelectedImage(`data:image/png;base64,${imageData}`);
    setImageModalVisible(true);
  };

  // Function to download image
  const handleDownloadImage = () => {
    if (selectedImage) {
      const link = document.createElement("a");
      link.href = selectedImage;
      link.download = "payment-document.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => text || "N/A",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => text || "N/A",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (text) => text || "N/A",
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={`data:image/png;base64,${text}`}
              alt="Payment Document"
              style={{
                maxWidth: "100px",
                maxHeight: "100px",
                cursor: "pointer",
                border: "1px solid #d9d9d9",
                borderRadius: "4px",
                transition: "all 0.3s ease",
              }}
              onClick={() => handleImageClick(text)}
              onMouseEnter={(e) => {
                e.target.style.opacity = "0.8";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
                e.target.style.transform = "scale(1)";
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                opacity: 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
              className="image-overlay"
            >
              <EyeOutlined /> View
            </div>
          </div>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === 1 && (
            <>
              <Button
                onClick={() => handleApprove(record.paymentInformationID)}
                type="primary"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(record.paymentInformationID)}
                type="danger"
              >
                Reject
              </Button>
            </>
          )}
          {(record.status === 2 || record.status === 3) && (
            <>
              <Button disabled>Approve</Button>
              <Button disabled>Reject</Button>
            </>
          )}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.paymentInformationID)}
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

      {/* Payment Information Form Modal */}
      <PaymentInformationForm
        visible={isFormVisible}
        onCancel={() => {
          setIsFormVisible(false);
          setSelectedPayment(null);
        }}
        onSubmit={handleFormSubmit}
        initialValues={selectedPayment}
      />

      {/* Image Preview Modal */}
      <Modal
        title="Payment Document"
        open={imageModalVisible}
        onCancel={() => {
          setImageModalVisible(false);
          setSelectedImage(null);
        }}
        footer={[
          <Button key="download" onClick={handleDownloadImage}>
            Download
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setImageModalVisible(false);
              setSelectedImage(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
        centered
      >
        {selectedImage && (
          <div style={{ textAlign: "center" }}>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Payment Document"
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
              preview={false}
            />
          </div>
        )}
      </Modal>

      <style jsx>{`
        .container img:hover + .image-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
