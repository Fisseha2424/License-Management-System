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
  { value: 1, label: "Fixed" },
  { value: 2, label: "Variable" },
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
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>

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
              <Select placeholder="Select type">
                <Option value={1}>Time-Limited License</Option>
                <Option value={2}>Device-Limited License</Option>
                <Option value={3}>Floating License</Option>
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
                { required: true, message: "Please enter number of devices" },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Enter number of devices"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="period"
              label="Period"
              rules={[{ required: true, message: "Please enter period" }]}
            >
              <InputNumber
                min={1}
                placeholder="Enter period"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="noOfUsers"
              label="Number of Users"
              rules={[
                { required: true, message: "Please enter number of users" },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Enter number of users"
                style={{ width: "100%" }}
              />
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
