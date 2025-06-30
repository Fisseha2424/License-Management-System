import React, { useEffect } from "react";
import { Form, Input, Button, Modal, Select, InputNumber, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { generateLicense } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";

const { Option } = Select;

const LicenseForm = ({ open, onClose, onGenerateSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error: licenseError } = useSelector((state) => state.license || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.companyProductSubscription || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});

  useEffect(() => {
    dispatch(getSubscriptions());
    form.resetFields();
  }, [open, form, dispatch]);

  const onFinish = (values) => {
    console.log("Form values:", JSON.stringify(values, null, 2));
    dispatch(
      generateLicense({
        ...values,
        expiryDate: new Date(values.expiryDate).toISOString(),
      })
    ).then(() => {
      if (onGenerateSuccess) onGenerateSuccess();
    });
    form.resetFields();
    onClose();
  };

  const getCompanyName = (companyID) => {
    const company = companies.find((c) => c.companyID === companyID);
    return company ? company.companyName : "Unknown";
  };

  const getProductName = (productID) => {
    const product = products.find((p) => p.productID === productID);
    return product ? product.productName : "Unknown";
  };

  return (
    <Modal
      title={
        <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
          Generate License
        </h2>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      className="rounded-xl shadow-lg"
      width={600}
    >
      {licenseError && (
        <Alert
          message={`Error: ${licenseError}`}
          type="error"
          showIcon
          className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        />
      )}
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-6 p-6 bg-white rounded-lg"
      >
        <Form.Item
          name="companyProductID"
          label={
            <span className="text-gray-700 font-medium">
              Company-Product Subscription
            </span>
          }
          rules={[{ required: true, message: "Please select a subscription" }]}
        >
          <Select
            placeholder="Select subscription"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {subscriptions.map((subscription) => (
              <Option
                key={subscription.companyProductID}
                value={subscription.companyProductID}
              >
                {`${getCompanyName(subscription.companyID)} - ${getProductName(
                  subscription.productID
                )}`}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="expiryDate"
          label={<span className="text-gray-700 font-medium">Expiry Date</span>}
          rules={[{ required: true, message: "Please select expiry date" }]}
        >
          <Input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
        <Form.Item
          name="noOfDevice"
          label={
            <span className="text-gray-700 font-medium">Number of Devices</span>
          }
          rules={[
            { required: true, message: "Please enter number of devices" },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="Enter number (0 for unlimited)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
        <Form.Item
          name="noOfUser"
          label={
            <span className="text-gray-700 font-medium">Number of Users</span>
          }
          rules={[{ required: true, message: "Please enter number of users" }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter number (0 for unlimited)"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </Form.Item>
        <Form.Item
          name="licenseType"
          label={
            <span className="text-gray-700 font-medium">License Type</span>
          }
          rules={[{ required: true, message: "Please select license type" }]}
        >
          <Select
            placeholder="Select license type"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <Option value={1}>Time-Limited Licenses</Option>
            <Option value={2}>Device-Limited Licenses</Option>
            <Option value={3}>Floating Licenses</Option>
          </Select>
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
              Generate
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LicenseForm;
