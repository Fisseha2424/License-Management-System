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
          name: feeStructure.category || "Default Name", // Map category to name if available
          feeAmount: feeStructure.feeAmount,
          licenseType: feeStructure.feeType, // Map feeType to licenseType
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
        licenseType: values.licenseType,
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
          licenseType: 1,
          feeAmount: 0,
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
              name="licenseType"
              label="License Type"
              rules={[
                { required: true, message: "Please select license type" },
              ]}
            >
              <Select placeholder="Select license type">
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
