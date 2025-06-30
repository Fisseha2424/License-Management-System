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
    // Removed getCompanies since it's not in paymentSlice
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
    let paymentDocument = selectedPayment?.paymentDocument || null;
    if (values.paymentDocument?.[0]?.originFileObj) {
      const formData = new FormData();
      formData.append("file", values.paymentDocument[0].originFileObj);
      try {
        const response = await fetch("http://localhost:5212/api/upload", {
          // Replace with your endpoint
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          paymentDocument = result.url || result.id; // Adjust based on your API
        } else {
          message.warning("File upload skipped due to server error");
        }
      } catch (err) {
        message.warning("File upload failed, proceeding without document");
        console.error("Upload error:", err);
      }
    }

    const payload = {
      companyFeeStructureID: values.companyFeeStructureID,
      reference: values.reference,
      paymentDate: values.paymentDate.toISOString(),
      paymentDocument: paymentDocument,
      status: values.status || "Pending",
      remark: values.remark || "",
      companyId: selectedCompany, // Adjusted from CompanyID to companyId
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
      console.log("Error Details:", err);
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
      dataIndex: "companyId",
      key: "companyId",
      render: (companyId) => {
        const company = companies.find((c) => c.companyID === companyId);
        return company ? company.companyName : "N/A";
      },
      ...getColumnSearchProps("companyId", "Company Name"),
    },
    {
      title: "Fee Structure ID",
      dataIndex: "companyFeeStructureID",
      key: "companyFeeStructureID",
      ...getColumnSearchProps("companyFeeStructureID", "Fee Structure ID"),
    },
    {
      title: "Amount",
      dataIndex: "PayableAmount",
      key: "PayableAmount",
      render: (amount) => `$${amount ? amount.toFixed(2) : "0.00"}`,
    },
    {
      title: "Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
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
          <Button
            type="primary"
            onClick={() => handleFormSubmit({ ...record, status: "Initiated" })}
            disabled={record.status !== "Pending"}
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
              <Option value="Initiated">Initiated</Option>
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

export default AssociatePayment;
