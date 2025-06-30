import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Modal, InputNumber } from "antd";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import {
  createSubscription,
  updateSubscription,
} from "../slices/companyProductSubscriptionSlice";

const { Option } = Select;

const SubscriptionForm = ({ open, onClose, subscription }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});

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
        updateSubscription({
          id: subscription.companyProductID,
          data: values,
        })
      );
    } else {
      dispatch(createSubscription(values));
    }
    onClose();
  };

  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          {subscription ? "Edit Subscription" : "Add Subscription"}
        </h2>
      }
      open={open}
      onCancel={onClose}
      okText={subscription ? "Update" : "Create"}
      onOk={() => form.submit()}
      className="rounded-xl shadow-lg"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6 p-6 bg-white rounded-lg"
      >
        <Form.Item
          name="companyID"
          label={<span className="text-gray-700 font-medium">Company</span>}
          rules={[{ required: true, message: "Please select a company" }]}
        >
          <Select
            placeholder="Select a company"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {companies?.map((company) => (
              <Option key={company.companyID} value={company.companyID}>
                {company.companyName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="productID"
          label={<span className="text-gray-700 font-medium">Product</span>}
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select
            placeholder="Select a product"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {products?.map((product) => (
              <Option key={product.productID} value={product.productID}>
                {product.productName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="notifyBeforeXDays"
          label={
            <span className="text-gray-700 font-medium">
              Notify Before (Days)
            </span>
          }
          rules={[
            { required: true, message: "Please enter notification days" },
          ]}
        >
          <InputNumber
            min={0}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscriptionForm;
