import React, { useEffect } from "react";
import { Form, Input, Button, Modal, Select, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCompany, updateCompany } from "../slices/companySlice";

const { Option } = Select;

const CompanyForm = ({ open, onClose, company }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.company || {});

  useEffect(() => {
    if (open) {
      if (company) {
        form.setFieldsValue({
          companyName: company.companyName || "",
          tinNo: company.tinNo || "", // Ensure consistency with slice
          email: company.email || "",
          mobileNo: company.mobileNo || "",
          companyType: company.companyType || 1, // Default to first option if null
          state: company.state || "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, company, form]);

  const onFinish = (values) => {
    console.log("Form values:", values); // Debug log
    if (company) {
      dispatch(updateCompany({ id: company.companyID, data: values })).then(
        () => {
          if (status !== "loading" && !error) {
            onClose();
          }
        }
      );
    } else {
      dispatch(createCompany(values)).then(() => {
        if (status !== "loading" && !error) {
          onClose();
        }
      });
    }
    form.resetFields();
  };

  return (
    <Modal
      title={company ? "Edit Company" : "Add Company"}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>
        <Form.Item
          name="tinNo"
          label="TIN Number"
          rules={[{ required: true, message: "Please enter TIN number" }]}
        >
          <Input placeholder="Enter TIN number" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="mobileNo"
          label="Mobile Number"
          rules={[{ required: true, message: "Please enter mobile number" }]}
        >
          <Input placeholder="Enter mobile number" />
        </Form.Item>
        <Form.Item
          name="companyType"
          label="Company Type"
          rules={[{ required: true, message: "Please select company type" }]}
        >
          <Select placeholder="Select company type">
            <Option value={1}>Private limited company</Option>
            <Option value={2}>Share company</Option>
            <Option value={3}>Governmental organizations</Option>
            <Option value={4}>Non governmental organizations</Option>
            <Option value={5}>Others</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="state"
          label="State"
          rules={[{ required: true, message: "Please enter state" }]}
        >
          <Input placeholder="Enter state" />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {company ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyForm;
