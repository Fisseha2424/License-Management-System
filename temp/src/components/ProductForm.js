import React, { useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../slices/productSlice";

const ProductForm = ({ open, onClose, product }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        state: product.state,
      });
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = (values) => {
    if (product) {
      dispatch(updateProduct({ id: product.productID, data: values }));
    } else {
      dispatch(createProduct(values));
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          {product ? "Edit Product" : "Add Product"}
        </h2>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      className="rounded-xl shadow-lg"
      width={600}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6 p-6 bg-white rounded-lg"
      >
        <Form.Item
          name="productName"
          label={
            <span className="text-gray-700 font-medium">Product Name</span>
          }
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input
            placeholder="Enter product name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
        <Form.Item
          name="productDescription"
          label={
            <span className="text-gray-700 font-medium">
              Product Description
            </span>
          }
          rules={[
            { required: true, message: "Please enter product description" },
          ]}
        >
          <Input.TextArea
            placeholder="Enter product description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={4}
          />
        </Form.Item>
        <Form.Item
          name="state"
          label={<span className="text-gray-700 font-medium">State</span>}
          rules={[{ required: true, message: "Please enter state" }]}
        >
          <Input
            placeholder="Enter state (e.g., Active)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-4">
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              {product ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
