"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Select, Modal, InputNumber, Button, Alert } from "antd";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import { getFeeStructuresByFeeType } from "../slices/feeSlice";
import {
  createSubscription,
  updateSubscription,
} from "../slices/companyProductSubscriptionSlice";

const { Option } = Select;

// Updated to use string values that match backend fee structure
const NO_OF_USERS_OPTIONS = [
  { value: "ZeroToTen", label: "0-10" },
  { value: "ElevenToFifty", label: "11-50" },
  { value: "FiftyOneToHundred", label: "51-100" },
  { value: "Unlimited", label: "Unlimited" },
];

const NO_OF_DEVICES_OPTIONS = [
  { value: "ZeroToTen", label: "0-10" },
  { value: "ElevenToFifty", label: "11-50" },
  { value: "FiftyOneToHundred", label: "51-100" },
  { value: "Unlimited", label: "Unlimited" },
];

const SubscriptionForm = ({ open, onClose, subscription }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const { feeStructures, error } = useSelector((state) => state.fee || {});
  const [subscriptionFee, setSubscriptionFee] = useState(null);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [currentNoOfUsers, setCurrentNoOfUsers] = useState(null);
  const [currentNoOfDevice, setCurrentNoOfDevice] = useState(null);

  useEffect(() => {
    dispatch(getCompanies());
    dispatch(getProducts());

    // Fixed feeType to "Subscription"
    const feeType = "Subscription";
    dispatch(getFeeStructuresByFeeType(feeType));

    if (subscription) {
      form.setFieldsValue({
        companyID: subscription.companyID,
        productID: subscription.productID,
        notifyBeforeXDays: subscription.notifyBeforeXDays,
        noOfUsers: subscription.noOfUsers,
        noOfDevice: subscription.noOfDevice, // Updated field name
        feeType: feeType,
      });
    } else {
      form.setFieldsValue({
        feeType: feeType,
      });
    }
  }, [subscription, form, dispatch]);

  // Update subscription fee based on exact match using exact field names
  useEffect(() => {
    console.log("feeStructures updated:", feeStructures);
    console.log("Current noOfUsers:", currentNoOfUsers);
    console.log("Current noOfDevice:", currentNoOfDevice);

    if (currentNoOfUsers && currentNoOfDevice && feeStructures.length > 0) {
      const matchingFee = feeStructures.find(
        (fee) =>
          fee.feeType === "Subscription" &&
          fee.noOfUsers === currentNoOfUsers &&
          fee.noOfDevice === currentNoOfDevice
      );

      const fee = matchingFee ? matchingFee.feeAmount : 0;
      console.log("Matching fee structure:", matchingFee);
      console.log("Selected feeAmount:", fee);
      setSubscriptionFee(fee);
    } else {
      setSubscriptionFee(null);
    }
  }, [feeStructures, currentNoOfUsers, currentNoOfDevice]);

  // Handle form value changes to check if all required fields are filled
  const handleValuesChange = (changedValues, allValues) => {
    // Update state when form values change
    if (changedValues.noOfUsers !== undefined) {
      setCurrentNoOfUsers(changedValues.noOfUsers);
    }
    if (changedValues.noOfDevice !== undefined) {
      setCurrentNoOfDevice(changedValues.noOfDevice);
    }

    const requiredFields = [
      "companyID",
      "productID",
      "noOfUsers",
      "noOfDevice",
      "notifyBeforeXDays",
      "feeType",
    ];
    const isFilled = requiredFields.every(
      (field) =>
        allValues[field] !== undefined &&
        allValues[field] !== null &&
        allValues[field] !== ""
    );
    setAllFieldsFilled(isFilled && subscriptionFee !== null);
  };

  const handleSubmit = async (values) => {
    try {
      const subscriptionData = {
        companyID: values.companyID,
        productID: values.productID,
        notifyBeforeXDays: values.notifyBeforeXDays,
        noOfUsers: values.noOfUsers,
        noOfDevice: values.noOfDevice, // Updated field name
        feeType: values.feeType,
        feeAmount: subscriptionFee, // Include the calculated fee amount
      };

      if (subscription) {
        await dispatch(
          updateSubscription({
            id: subscription.companyProductID,
            data: subscriptionData,
          })
        ).unwrap();
      } else {
        await dispatch(createSubscription(subscriptionData)).unwrap();
      }

      form.resetFields();
      setSubscriptionFee(null);
      setAllFieldsFilled(false);
      setCurrentNoOfUsers(null);
      setCurrentNoOfDevice(null);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <Modal
      open={open}
      centered
      footer={null}
      destroyOnHidden
      onCancel={() => {
        form.resetFields();
        setSubscriptionFee(null);
        setAllFieldsFilled(false);
        setCurrentNoOfUsers(null);
        setCurrentNoOfDevice(null);
        onClose();
      }}
      title={
        <span className="flex items-center gap-2">
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
        onValuesChange={handleValuesChange}
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
          name="noOfUsers"
          label="Number of Users"
          rules={[{ required: true, message: "Please select number of users" }]}
        >
          <Select placeholder="Select number of users" className="rounded-md">
            {NO_OF_USERS_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="noOfDevice"
          label="Number of Devices"
          rules={[
            { required: true, message: "Please select number of devices" },
          ]}
        >
          <Select placeholder="Select number of devices" className="rounded-md">
            {NO_OF_DEVICES_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="feeType"
          label="Fee Type"
          rules={[{ required: true, message: "Please select fee type" }]}
        >
          <Select
            placeholder="Subscription"
            className="rounded-md"
            value="Subscription"
            disabled={true}
          >
            <Option key="Subscription" value="Subscription">
              Subscription
            </Option>
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

        {allFieldsFilled && subscriptionFee !== null && (
          <Alert
            type="info"
            message={`Subscription Fee: $${subscriptionFee}`}
            showIcon
            style={{ marginBottom: "1rem" }}
          />
        )}

        <Form.Item>
          <div className="flex justify-end gap-3 mt-2">
            <Button
              onClick={() => {
                form.resetFields();
                setSubscriptionFee(null);
                setAllFieldsFilled(false);
                setCurrentNoOfUsers(null);
                setCurrentNoOfDevice(null);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!allFieldsFilled}
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
