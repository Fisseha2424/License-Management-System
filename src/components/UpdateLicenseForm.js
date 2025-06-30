import React, { useEffect } from "react";
import { Form, Input, Button, Modal, Select, InputNumber, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateLicense } from "../slices/licenseSlice";

const { Option } = Select;

const UpdateLicenseForm = ({ open, onClose, license }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error: licenseError, status } = useSelector(
    (state) => state.license || {}
  );

  useEffect(() => {
    if (open && license) {
      form.setFieldsValue({
        expiryDate: license.expiryDate
          ? new Date(license.expiryDate).toISOString().split("T")[0]
          : "",
        noOfDevice: license.noOfDevice,
        noOfUser: license.noOfUser,
        licenseType: license.licenseType,
      });
    }
  }, [open, license, form]);

  const onFinish = (values) => {
    console.log("Update form values:", JSON.stringify(values, null, 2));
    if (license) {
      dispatch(
        updateLicense({
          companyProductID: license.companyProductID,
          data: {
            ...values,
            expiryDate: new Date(values.expiryDate).toISOString(),
          },
        })
      ).then(() => {
        form.resetFields();
        onClose();
      });
    }
  };

  return (
    <Modal title="Update License" open={open} onCancel={onClose} footer={null}>
      {licenseError && (
        <Alert
          message={`Error: ${licenseError}`}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="expiryDate"
          label="Expiry Date"
          rules={[{ required: true, message: "Please select expiry date" }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          name="noOfDevice"
          label="Number of Devices"
          rules={[
            { required: true, message: "Please enter number of devices" },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="Enter number (0 for unlimited)"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="noOfUser"
          label="Number of Users"
          rules={[{ required: true, message: "Please enter number of users" }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter number (0 for unlimited)"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="licenseType"
          label="License Type"
          rules={[{ required: true, message: "Please select license type" }]}
        >
          <Select placeholder="Select license type">
            <Option value={1}>Time-Limited Licenses</Option>
            <Option value={2}>Device-Limited Licenses</Option>
            <Option value={3}>Floating Licenses</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={status === "loading"}
            >
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateLicenseForm;
