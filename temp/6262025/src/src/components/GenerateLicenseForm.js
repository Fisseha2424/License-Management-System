// import React, { useEffect } from "react";
// import { Form, Input, Button, Modal, Select, InputNumber, Alert } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { generateLicense } from "../slices/licenseSlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
// import { ExclamationCircleOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const LicenseForm = ({ open, onClose, license }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const { error: licenseError } = useSelector((state) => state.license || {});
//   const { subscriptions = [] } = useSelector(
//     (state) => state.subscription || {}
//   );
//   const { companies } = useSelector((state) => state.company || {});
//   const { products } = useSelector((state) => state.product || {});

//   // Fetch subscription data and reset form
//   useEffect(() => {
//     dispatch(getSubscriptions());
//     if (license) {
//       form.setFieldsValue({
//         ...license,
//         expiryDate: license.expiryDate?.split("T")[0],
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [open, license, dispatch, form]);

//   // Helper to get company and product names
//   const getCompanyName = (companyID) =>
//     companies.find((c) => c.companyID === companyID)?.companyName || "Unknown";
//   const getProductName = (productID) =>
//     products.find((p) => p.productID === productID)?.productName || "Unknown";

//   // Submit the license
//   const onFinish = (values) => {
//     dispatch(
//       generateLicense({
//         ...values,
//         expiryDate: new Date(values.expiryDate).toISOString(),
//       })
//     );
//     form.resetFields();
//     onClose();
//   };

//   // Custom validation to ensure at least one of devices or users is zero
//   const validateUsersAndDevices = () => ({
//     validator(_, value, callback) {
//       const noOfDevice = form.getFieldValue("noOfDevice");
//       const noOfUser = form.getFieldValue("noOfUser");
//       if (noOfDevice > 0 && noOfUser > 0) {
//         return Promise.reject(new Error("Either Users or Devices must be 0."));
//       }
//       return Promise.resolve();
//     },
//   });

//   return (
//     <Modal
//       title="🎫 Generate License"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       centered
//       className="rounded-xl"
//     >
//       {licenseError && (
//         <Alert
//           type="error"
//           message={`Error: ${licenseError}`}
//           showIcon
//           icon={<ExclamationCircleOutlined />}
//           className="mb-4"
//         />
//       )}

//       <Form
//         form={form}
//         onFinish={onFinish}
//         layout="vertical"
//         className="space-y-2"
//       >
//         <Form.Item
//           name="companyProductID"
//           label="Company-Product Subscription"
//           rules={[{ required: true, message: "Select a subscription" }]}
//         >
//           <Select placeholder="Select subscription">
//             {subscriptions.map((sub) => (
//               <Option key={sub.companyProductID} value={sub.companyProductID}>
//                 {`${getCompanyName(sub.companyID)} - ${getProductName(
//                   sub.productID
//                 )}`}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="expiryDate"
//           label="Expiry Date"
//           rules={[{ required: true, message: "Please select expiry date" }]}
//         >
//           <Input type="date" />
//         </Form.Item>

//         <Form.Item
//           name="noOfDevice"
//           label="Number of Devices"
//           rules={[
//             { required: true, message: "Please enter number of devices" },
//             validateUsersAndDevices,
//           ]}
//         >
//           <InputNumber
//             min={0}
//             className="w-full"
//             placeholder="Enter 0 if using user license"
//           />
//         </Form.Item>

//         <Form.Item
//           name="noOfUser"
//           label="Number of Users"
//           rules={[
//             { required: true, message: "Please enter number of users" },
//             validateUsersAndDevices,
//           ]}
//         >
//           <InputNumber
//             min={0}
//             className="w-full"
//             placeholder="Enter 0 if using device license"
//           />
//         </Form.Item>

//         <Form.Item
//           name="licenseType"
//           label="License Type"
//           rules={[{ required: true, message: "Select license type" }]}
//         >
//           <Select placeholder="Select type">
//             <Option value={1}>Time-Limited License</Option>
//             <Option value={2}>Device-Limited License</Option>
//             <Option value={3}>Floating License</Option>
//           </Select>
//         </Form.Item>

//         <Form.Item>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button onClick={onClose}>Cancel</Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Generate
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default LicenseForm;

import React, { useEffect } from "react";
import { Form, Input, Button, Modal, Select, InputNumber, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { generateLicense } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const LicenseForm = ({ open, onClose, license }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { error: licenseError } = useSelector((state) => state.license || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});

  // Fetch subscription data and reset form
  useEffect(() => {
    dispatch(getSubscriptions());
    if (license) {
      form.setFieldsValue({
        ...license,
        expiryDate: license.expiryDate?.split("T")[0],
      });
    } else {
      form.resetFields();
    }
  }, [open, license, dispatch, form]);

  // Helper to get company and product names
  const getCompanyName = (companyID) =>
    companies.find((c) => c.companyID === companyID)?.companyName || "Unknown";
  const getProductName = (productID) =>
    products.find((p) => p.productID === productID)?.productName || "Unknown";

  // Submit the license
  const onFinish = (values) => {
    dispatch(
      generateLicense({
        ...values,
        expiryDate: new Date(values.expiryDate).toISOString(),
      })
    );
    form.resetFields();
    onClose();
  };

  // Custom validation to ensure at least one of devices or users is zero
  const validateUsersAndDevices = () => ({
    validator(_, value, callback) {
      const noOfDevice = form.getFieldValue("noOfDevice");
      const noOfUser = form.getFieldValue("noOfUser");
      // if (noOfDevice > 0 && noOfUser > 0) {
      //   return Promise.reject(new Error("Either Users or Devices must be 0."));
      // }
      return Promise.resolve();
    },
  });

  return (
    <Modal
      title="🎫 Generate License"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
    >
      {licenseError && (
        <Alert
          type="error"
          message={`Error: ${licenseError}`}
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-2"
      >
        <Form.Item
          name="companyProductID"
          label="Company-Product Subscription"
          rules={[{ required: true, message: "Select a subscription" }]}
        >
          <Select placeholder="Select subscription">
            {subscriptions.map((sub) => (
              <Option key={sub.companyProductID} value={sub.companyProductID}>
                {`${getCompanyName(sub.companyID)} - ${getProductName(
                  sub.productID
                )}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
            validateUsersAndDevices,
          ]}
        >
          <InputNumber
            min={0}
            className="w-full"
            placeholder="Enter 0 if using user license"
          />
        </Form.Item>

        <Form.Item
          name="noOfUser"
          label="Number of Users"
          rules={[
            { required: true, message: "Please enter number of users" },
            validateUsersAndDevices,
          ]}
        >
          <InputNumber
            min={0}
            className="w-full"
            placeholder="Enter 0 if using device license"
          />
        </Form.Item>

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

        <Form.Item
          name="publicKey"
          label="Public Key"
          rules={[{ required: true, message: "Please enter the public key" }]}
        >
          <Input placeholder="Enter public key" className="w-full" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700"
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
