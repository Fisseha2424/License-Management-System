"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Select,
  Input,
  InputNumber,
  message,
  Row,
  Col,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createFeeStructure, updateFeeStructure } from "../slices/feeSlice";
import moment from "moment";

const { Option } = Select;

const FEE_TYPES = [
  { value: 1, label: "Registration" },
  { value: 2, label: "Subscription" },
  { value: 3, label: "Maintenance" },
  { value: 4, label: "Upgrade" },
  { value: 5, label: "Renewal" },
  { value: 6, label: "Other" },
];

const NO_OF_USERS_OR_DEVICES = [
  { value: 1, label: "0-10" },
  { value: 2, label: "11-50" },
  { value: 3, label: "51-100" },
  { value: 4, label: "Unlimited" },
];

const PERIOD_TYPES = [
  { value: 1, label: "Monthly" },
  { value: 2, label: "Quarterly" },
  { value: 3, label: "Biannually" },
  { value: 4, label: "Annually" },
  { value: 5, label: "Biennially" },
];

const LICENSE_TYPES = [
  { value: 1, label: "Time-Limited License" },
  { value: 2, label: "Device-Limited License" },
  { value: 3, label: "Floating License" },
];

const FeeStructureForm = ({ feeStructure, open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (feeStructure) {
        form.setFieldsValue({
          name: feeStructure.name || "Default Name",
          feeAmount: feeStructure.feeAmount,
          feeType: feeStructure.feeType,
          licenseType: feeStructure.licenseType,
          noOfDevice: feeStructure.noOfDevice,
          period: feeStructure.period,
          noOfUsers: feeStructure.noOfUsers,
        });
      } else {
        form.resetFields();
      }
    }
  }, [feeStructure, form, open]);

  // Watch form fields to update licenseType and name
  const noOfDevice = Form.useWatch("noOfDevice", form);
  const noOfUsers = Form.useWatch("noOfUsers", form);
  const feeType = Form.useWatch("feeType", form);
  const period = Form.useWatch("period", form);

  useEffect(() => {
    // Determine licenseType based on noOfDevice and noOfUsers
    let licenseType = 1; // Default to Time-Limited
    if (noOfDevice === 4 && noOfUsers !== 4) {
      licenseType = 3; // Floating License
    } else if (noOfUsers === 4 && noOfDevice !== 4) {
      licenseType = 2; // Device-Limited License
    } else if (noOfDevice === 4 && noOfUsers === 4) {
      licenseType = 1; // Time-Limited License
    }

    form.setFieldsValue({ licenseType });

    // Generate name based on template
    if (feeType && period && noOfDevice && noOfUsers && licenseType) {
      const feeTypeLabel =
        FEE_TYPES.find((t) => t.value === feeType)?.label || "";
      const periodLabel =
        PERIOD_TYPES.find((p) => p.value === period)?.label || "";
      const noOfDeviceLabel =
        NO_OF_USERS_OR_DEVICES.find((d) => d.value === noOfDevice)?.label || "";
      const noOfUsersLabel =
        NO_OF_USERS_OR_DEVICES.find((u) => u.value === noOfUsers)?.label || "";
      const licenseTypeLabel =
        LICENSE_TYPES.find((l) => l.value === licenseType)?.label || "";

      const generatedName = `${periodLabel} ${feeTypeLabel} for ${noOfDeviceLabel} devices and ${noOfUsersLabel} users for ${licenseTypeLabel}`;
      form.setFieldsValue({ name: generatedName });
    }
  }, [noOfDevice, noOfUsers, feeType, period, form]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const feeData = {
        name: values.name,
        feeAmount: values.feeAmount,
        feeType: values.feeType,
        licenseType: values.licenseType,
        noOfDevice: values.noOfDevice,
        period: values.period,
        noOfUsers: values.noOfUsers,
      };

      if (feeStructure) {
        await dispatch(
          updateFeeStructure({
            id: feeStructure.FeeStructureID || feeStructure.feeID,
            data: feeData,
          })
        ).unwrap();
        message.success("Fee structure updated successfully");
      } else {
        await dispatch(createFeeStructure(feeData)).unwrap();
        message.success("Fee structure created successfully");
      }

      handleClose();
    } catch (err) {
      message.error("Failed to save fee structure");
      console.error("Error saving fee structure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={feeStructure ? "Edit Fee Structure" : "Add Fee Structure"}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          feeType: 1,
          feeAmount: 0,
          noOfDevice: 1,
          period: 1,
          noOfUsers: 1,
          licenseType: 1,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="feeType"
              label="Fee Type"
              rules={[{ required: true, message: "Please select fee type" }]}
            >
              <Select placeholder="Select fee type">
                {FEE_TYPES.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input readOnly placeholder="Name will be generated" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="feeAmount"
              label="Fee Amount ($)"
              rules={[
                { required: true, message: "Please enter fee amount" },
                {
                  type: "number",
                  min: 0,
                  message: "Fee amount must be positive",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter amount"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="licenseType"
              label="License Type"
              rules={[{ required: true, message: "Select license type" }]}
            >
              <Select
                disabled
                placeholder="License type will be set automatically"
              >
                {LICENSE_TYPES.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="noOfDevice"
              label="Number of Devices"
              rules={[
                { required: true, message: "Please select number of devices" },
              ]}
            >
              <Select placeholder="Select number of devices">
                {NO_OF_USERS_OR_DEVICES.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="period"
              label="Period"
              rules={[{ required: true, message: "Please select period" }]}
            >
              <Select placeholder="Select period">
                {PERIOD_TYPES.map((period) => (
                  <Option key={period.value} value={period.value}>
                    {period.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="noOfUsers"
              label="Number of Users"
              rules={[
                { required: true, message: "Please select number of users" },
              ]}
            >
              <Select placeholder="Select number of users">
                {NO_OF_USERS_OR_DEVICES.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {feeStructure ? "Update" : "Create"} Fee Structure
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeeStructureForm;
