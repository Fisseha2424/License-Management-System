import React, { useEffect } from "react";
import { Form, Input, Button, Modal } from "antd";
import { useDispatch } from "react-redux";
import { createProduct, updateProduct } from "../slices/productSlice";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";

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
        <span className="flex items-center gap-2">
          {product ? <EditOutlined /> : <PlusOutlined />}
          {product ? "Edit Product" : "Add Product"}
        </span>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      centered
      className="rounded-lg"
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-3"
      >
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: "Please enter product name" }]}
        >
          <Input placeholder="e.g. Microsoft 365" className="rounded-md" />
        </Form.Item>

        <Form.Item
          name="productDescription"
          label="Product Description"
          rules={[
            { required: true, message: "Please enter product description" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="e.g. Office Suite software with cloud features"
            className="rounded-md"
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
              {product ? "Update" : "Create"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
