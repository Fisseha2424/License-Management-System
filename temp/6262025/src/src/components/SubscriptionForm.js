import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Modal, InputNumber, Button, Alert } from "antd";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import {
  createSubscription,
  updateSubscription,
} from "../slices/companyProductSubscriptionSlice";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const SubscriptionForm = ({ open, onClose, subscription }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const { error } = useSelector((state) => state.subscription || {});

  useEffect(() => {
    dispatch(getCompanies());
    dispatch(getProducts());

    if (subscription) {
      form.setFieldsValue({
        companyID: subscription.companyID,
        productID: subscription.productID,
        notifyBeforeXDays: subscription.notifyBeforeXDays,
      });
    } else {
      form.resetFields();
    }
  }, [subscription, form, dispatch]);

  const handleSubmit = (values) => {
    if (subscription) {
      dispatch(
        updateSubscription({ id: subscription.companyProductID, data: values })
      );
    } else {
      dispatch(createSubscription(values));
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      centered
      footer={null}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      title={
        <span className="flex items-center gap-2">
          {subscription ? <EditOutlined /> : <PlusOutlined />}
          {subscription ? "Edit Subscription" : "Add Subscription"}
        </span>
      }
      className="rounded-xl"
    >
      {error && (
        <Alert
          type="error"
          message={`Error: ${error}`}
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-3"
      >
        <Form.Item
          name="companyID"
          label="Company"
          rules={[{ required: true, message: "Please select a company" }]}
        >
          <Select placeholder="Select a company" className="rounded-md">
            {companies?.map((company) => (
              <Option key={company.companyID} value={company.companyID}>
                {company.companyName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="productID"
          label="Product"
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select placeholder="Select a product" className="rounded-md">
            {products?.map((product) => (
              <Option key={product.productID} value={product.productID}>
                {product.productName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="notifyBeforeXDays"
          label="Notify Before (Days)"
          rules={[
            { required: true, message: "Please enter notification days" },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="e.g., 10"
            className="w-full rounded-md"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {subscription ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscriptionForm;
