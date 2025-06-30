import React, { useEffect } from "react";
import { Form, Input, Button, Modal, Select, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCompany, updateCompany } from "../slices/companySlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const CompanyForm = ({ open, onClose, company }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.company || {});

  useEffect(() => {
    if (company) {
      form.setFieldsValue({
        companyName: company.companyName,
        tinNo: company.tinNo,
        email: company.email,
        mobileNo: company.mobileNo,
        companyType: company.companyType,
        state: company.state,
      });
    } else {
      form.resetFields();
    }
  }, [company, form]);

  const onFinish = (values) => {
    if (company) {
      dispatch(updateCompany({ id: company.companyID, data: values }));
    } else {
      const { companyID, ...createData } = values;
      dispatch(createCompany(createData));
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={company ? "🛠️ Edit Company" : "🏢 Add Company"}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
    >
      {error && (
        <Alert
          type="error"
          message={`Error: ${error}`}
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-2"
      >
        <Form.Item
          name="companyName"
          label="Company Name"
          rules={[{ required: true, message: "Please enter company name" }]}
        >
          <Input
            placeholder="e.g. Meta Technology PLC"
            className="rounded-md"
          />
        </Form.Item>

        <Form.Item
          name="tinNo"
          label="TIN Number"
          rules={[{ required: true, message: "Please enter TIN number" }]}
        >
          <Input placeholder="e.g. 1234567890" className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="e.g. info@company.com" className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="mobileNo"
          label="Mobile Number"
          rules={[{ required: true, message: "Please enter mobile number" }]}
        >
          <Input placeholder="e.g. +251911223344" className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="companyType"
          label="Company Type"
          rules={[{ required: true, message: "Select company type" }]}
        >
          <Select placeholder="Choose type" className="rounded-md">
            <Option value={1}>Private Limited Company</Option>
            <Option value={2}>Share Company</Option>
            <Option value={3}>Governmental Organization</Option>
            <Option value={4}>Non-Governmental Organization</Option>
            <Option value={5}>Other</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {company ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyForm;
