// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Modal, Select, Alert } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { generateLicense } from "../slices/licenseSlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
// import { getCompanies } from "../slices/companySlice";
// import { getProducts } from "../slices/productSlice";
// import {
//   getFeeStructuresByCompanyProductId,
//   updateCompanyFeeStructure,
// } from "../slices/companyFeeSlice";
// import { ExclamationCircleOutlined } from "@ant-design/icons";

// const { Option } = Select;

// // Enum for NoOfUsersOrDevices
// const NoOfUsersOrDevices = {
//   ZeroToTen: 1,
//   ElevenToFifty: 2,
//   FiftyOneToHundred: 3,
//   Unlimited: 4,
// };

// // Helper function to get enum label
// const getEnumLabel = (value) => {
//   switch (value) {
//     case NoOfUsersOrDevices.ZeroToTen:
//       return "0-10";
//     case NoOfUsersOrDevices.ElevenToFifty:
//       return "11-50";
//     case NoOfUsersOrDevices.FiftyOneToHundred:
//       return "51-100";
//     case NoOfUsersOrDevices.Unlimited:
//       return "Unlimited";
//     default:
//       return "Unknown";
//   }
// };

// // License type enum
// const LicenseType = {
//   TimeLimited: 1,
//   DeviceLimited: 2,
//   Floating: 3,
// };

// const LicenseForm = ({ open, onClose, license }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedSubscription, setSelectedSubscription] = useState(null);
//   const [noOfDevice, setNoOfDevice] = useState(null);
//   const [noOfUser, setNoOfUser] = useState(null);
//   const [licenseType, setLicenseType] = useState(null);

//   const { error: licenseError } = useSelector((state) => state.license || {});
//   const { subscriptions = [] } = useSelector(
//     (state) => state.subscription || {}
//   );
//   const { companies = [] } = useSelector((state) => state.company || {});
//   const { products = [] } = useSelector((state) => state.product || {});
//   const {
//     feeStructures = [],
//     status: feeStatus,
//     error: feeError,
//   } = useSelector((state) => state.companyFee || {});

//   // Fetch all required data on component mount
//   useEffect(() => {
//     dispatch(getSubscriptions());
//     dispatch(getCompanies());
//     dispatch(getProducts());
//   }, [dispatch]);

//   // Fetch fee structure when subscription is selected
//   useEffect(() => {
//     if (selectedSubscription?.companyProductID) {
//       dispatch(
//         getFeeStructuresByCompanyProductId(
//           selectedSubscription.companyProductID
//         )
//       );
//     }
//   }, [selectedSubscription, dispatch]);

//   // Calculate license type based on device and user selections
//   const calculateLicenseType = (deviceCount, userCount) => {
//     if (deviceCount === null || userCount === null) {
//       return null;
//     }

//     if (
//       userCount !== NoOfUsersOrDevices.Unlimited &&
//       deviceCount === NoOfUsersOrDevices.Unlimited
//     ) {
//       return LicenseType.Floating;
//     } else if (
//       deviceCount !== NoOfUsersOrDevices.Unlimited &&
//       userCount === NoOfUsersOrDevices.Unlimited
//     ) {
//       return LicenseType.DeviceLimited;
//     } else if (
//       deviceCount === NoOfUsersOrDevices.Unlimited &&
//       userCount === NoOfUsersOrDevices.Unlimited
//     ) {
//       return LicenseType.TimeLimited;
//     } else {
//       return LicenseType.TimeLimited;
//     }
//   };

//   // Update license type when device or user count changes
//   useEffect(() => {
//     const calculatedLicenseType = calculateLicenseType(noOfDevice, noOfUser);
//     if (calculatedLicenseType !== null) {
//       setLicenseType(calculatedLicenseType);
//       form.setFieldsValue({ licenseType: calculatedLicenseType });
//     }
//   }, [noOfDevice, noOfUser, form]);

//   // Handle device count change
//   const handleDeviceCountChange = (value) => {
//     setNoOfDevice(value);
//     form.setFieldsValue({ noOfDevice: value });
//   };

//   // Handle user count change
//   const handleUserCountChange = (value) => {
//     setNoOfUser(value);
//     form.setFieldsValue({ noOfUser: value });
//   };

//   // Get license type label
//   const getLicenseTypeLabel = (type) => {
//     switch (type) {
//       case LicenseType.TimeLimited:
//         return "Time-Limited License";
//       case LicenseType.DeviceLimited:
//         return "Device-Limited License";
//       case LicenseType.Floating:
//         return "Floating License";
//       default:
//         return "Unknown";
//     }
//   };

//   // Reset form when modal opens/closes or license changes
//   useEffect(() => {
//     if (open) {
//       if (license) {
//         const subscription = subscriptions.find(
//           (sub) => sub.companyProductID === license.companyProductID
//         );

//         if (subscription) {
//           setSelectedCompany(subscription.companyID);
//           setSelectedProduct(subscription.productID);
//           setSelectedSubscription(subscription);

//           const companyProducts = subscriptions
//             .filter((sub) => sub.companyID === subscription.companyID)
//             .map((sub) => sub.productID);
//           setFilteredProducts(
//             products.filter((product) =>
//               companyProducts.includes(product.productID)
//             )
//           );
//         }

//         setNoOfDevice(license.noOfDevice);
//         setNoOfUser(license.noOfUser);
//         setLicenseType(license.licenseType);

//         form.setFieldsValue({
//           ...license,
//           companyID: subscription?.companyID,
//           productID: subscription?.productID,
//           expiryDate: license.expiryDate?.split("T")[0],
//         });
//       } else {
//         form.resetFields();
//         setSelectedCompany(null);
//         setSelectedProduct(null);
//         setFilteredProducts([]);
//         setSelectedSubscription(null);
//         setNoOfDevice(null);
//         setNoOfUser(null);
//         setLicenseType(null);
//       }
//     }
//   }, [open, license, dispatch, form, subscriptions, products]);

//   // Handle company selection
//   const handleCompanyChange = (companyID) => {
//     setSelectedCompany(companyID);
//     setSelectedProduct(null);
//     setSelectedSubscription(null);

//     form.setFieldsValue({
//       productID: undefined,
//       companyProductID: undefined,
//     });

//     const companySubscriptions = subscriptions.filter(
//       (sub) => sub.companyID === companyID
//     );
//     const companyProductIDs = companySubscriptions.map((sub) => sub.productID);
//     const availableProducts = products.filter((product) =>
//       companyProductIDs.includes(product.productID)
//     );

//     setFilteredProducts(availableProducts);
//   };

//   // Handle product selection
//   const handleProductChange = (productID) => {
//     setSelectedProduct(productID);

//     const subscription = subscriptions.find(
//       (sub) => sub.companyID === selectedCompany && sub.productID === productID
//     );

//     if (subscription) {
//       setSelectedSubscription(subscription);
//       form.setFieldsValue({
//         companyProductID: subscription.companyProductID,
//       });
//     }
//   };

//   // Helper to get company and product names
//   const getCompanyName = (companyID) =>
//     companies.find((c) => c.companyID === companyID)?.companyName || "Unknown";
//   const getProductName = (productID) =>
//     products.find((p) => p.productID === productID)?.productName || "Unknown";

//   // Submit the license and update fee structure
//   const onFinish = async (values) => {
//     try {
//       const licenseData = {
//         companyProductID: selectedSubscription?.companyProductID,
//         expiryDate: new Date(values.expiryDate).toISOString(),
//         noOfDevice: noOfDevice,
//         noOfUser: noOfUser,
//         licenseType: licenseType,
//         publicKey: values.publicKey,
//       };

//       // Generate the license
//       await dispatch(generateLicense(licenseData)).unwrap();

//       // Ensure fee structure is fetched and available
//       if (feeStatus !== "succeeded" || feeStructures.length === 0) {
//         await dispatch(
//           getFeeStructuresByCompanyProductId(
//             selectedSubscription.companyProductID
//           )
//         ).unwrap();
//       }

//       // Find the fee structure to update
//       const feeStructure = feeStructures.find(
//         (fee) => fee.companyProductID === selectedSubscription?.companyProductID
//       );

//       if (feeStructure) {
//         // Update fee structure with new payment values
//         const updatedFeeData = {
//           ...feeStructure,
//           paidAmount: feeStructure.unpaidAmount,
//           unpaidAmount: 0,
//           payableAmount: feeStructure.payableAmount,
//         };

//         await dispatch(
//           updateCompanyFeeStructure({
//             id: feeStructure.feeID,
//             data: updatedFeeData,
//           })
//         ).unwrap();
//       } else {
//         console.error(
//           "No fee structure found for companyProductID:",
//           selectedSubscription.companyProductID
//         );
//         throw new Error("No fee structure found for the selected subscription");
//       }

//       // Reset form and close modal
//       form.resetFields();
//       setSelectedCompany(null);
//       setSelectedProduct(null);
//       setFilteredProducts([]);
//       setSelectedSubscription(null);
//       setNoOfDevice(null);
//       setNoOfUser(null);
//       setLicenseType(null);
//       onClose();
//     } catch (error) {
//       console.error("Error in license generation or fee update:", error);
//       // Optionally show error to user
//       form.setFields([
//         {
//           name: "publicKey",
//           errors: [
//             "Failed to generate license or update fee structure. Please try again.",
//           ],
//         },
//       ]);
//     }
//   };

//   return (
//     <Modal
//       title="🎫 Generate License"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       centered
//       className="rounded-xl"
//     >
//       {(licenseError || feeError) && (
//         <Alert
//           type="error"
//           message={`Error: ${licenseError || feeError}`}
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
//           name="companyID"
//           label="Company"
//           rules={[{ required: true, message: "Please select a company" }]}
//         >
//           <Select
//             placeholder="Select company"
//             onChange={handleCompanyChange}
//             value={selectedCompany}
//           >
//             {companies.map((company) => (
//               <Option key={company.companyID} value={company.companyID}>
//                 {company.companyName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="productID"
//           label="Product"
//           rules={[{ required: true, message: "Please select a product" }]}
//         >
//           <Select
//             placeholder="Select product"
//             onChange={handleProductChange}
//             value={selectedProduct}
//             disabled={!selectedCompany}
//           >
//             {filteredProducts.map((product) => (
//               <Option key={product.productID} value={product.productID}>
//                 {product.productName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="companyProductID" label="Company-Product Subscription">
//           <Input
//             placeholder="Auto-filled based on company and product selection"
//             disabled
//             value={
//               selectedSubscription
//                 ? `${getCompanyName(
//                     selectedSubscription.companyID
//                   )} - ${getProductName(selectedSubscription.productID)}`
//                 : ""
//             }
//           />
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
//             { required: true, message: "Please select number of devices" },
//           ]}
//         >
//           <Select
//             placeholder="Select device count range"
//             onChange={handleDeviceCountChange}
//             value={noOfDevice}
//           >
//             {Object.entries(NoOfUsersOrDevices).map(([key, value]) => (
//               <Option key={value} value={value}>
//                 {getEnumLabel(value)}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="noOfUser"
//           label="Number of Users"
//           rules={[{ required: true, message: "Please select number of users" }]}
//         >
//           <Select
//             placeholder="Select user count range"
//             onChange={handleUserCountChange}
//             value={noOfUser}
//           >
//             {Object.entries(NoOfUsersOrDevices).map(([key, value]) => (
//               <Option key={value} value={value}>
//                 {getEnumLabel(value)}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item name="licenseType" label="License Type">
//           <Input
//             placeholder="Auto-calculated based on device and user selection"
//             disabled
//             value={licenseType ? getLicenseTypeLabel(licenseType) : ""}
//           />
//         </Form.Item>

//         <Form.Item
//           name="publicKey"
//           label="Public Key"
//           rules={[{ required: true, message: "Please enter the public key" }]}
//         >
//           <Input placeholder="Enter public key" className="w-full" />
//         </Form.Item>

//         <Form.Item>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button onClick={onClose}>Cancel</Button>
//             <Button
//               type="primary"
//               htmlType="submit"
//               className="bg-blue-600 hover:bg-blue-700"
//               disabled={
//                 !selectedSubscription ||
//                 !noOfDevice ||
//                 !noOfUser ||
//                 feeStatus === "loading"
//               }
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

"use client";

import { useEffect, useState } from "react";
import { Form, Input, Button, Modal, Select, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { generateLicense } from "../slices/licenseSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import {
  getFeeStructuresByCompanyProductId,
  updateCompanyFeeStructure,
} from "../slices/companyFeeSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

// Enum for NoOfUsersOrDevices
const NoOfUsersOrDevices = {
  ZeroToTen: 1,
  ElevenToFifty: 2,
  FiftyOneToHundred: 3,
  Unlimited: 4,
};

// Helper function to get enum label
const getEnumLabel = (value) => {
  switch (value) {
    case NoOfUsersOrDevices.ZeroToTen:
      return "0-10";
    case NoOfUsersOrDevices.ElevenToFifty:
      return "11-50";
    case NoOfUsersOrDevices.FiftyOneToHundred:
      return "51-100";
    case NoOfUsersOrDevices.Unlimited:
      return "Unlimited";
    default:
      return "Unknown";
  }
};

// License type enum
const LicenseType = {
  TimeLimited: 1,
  DeviceLimited: 2,
  Floating: 3,
};

const LicenseForm = ({ open, onClose, license }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [noOfDevice, setNoOfDevice] = useState(null);
  const [noOfUser, setNoOfUser] = useState(null);
  const [licenseType, setLicenseType] = useState(null);

  const { error: licenseError } = useSelector((state) => state.license || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { companies = [] } = useSelector((state) => state.company || {});
  const { products = [] } = useSelector((state) => state.product || {});
  const {
    feeStructures = [],
    status: feeStatus,
    error: feeError,
  } = useSelector((state) => state.companyFee || {});

  // Fetch all required data on component mount
  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  // Fetch fee structure when subscription is selected
  useEffect(() => {
    if (selectedSubscription?.companyProductID) {
      dispatch(
        getFeeStructuresByCompanyProductId(
          selectedSubscription.companyProductID
        )
      );
    }
  }, [selectedSubscription, dispatch]);

  // Calculate license type based on device and user selections
  const calculateLicenseType = (deviceCount, userCount) => {
    if (deviceCount === null || userCount === null) {
      return null;
    }

    if (
      userCount !== NoOfUsersOrDevices.Unlimited &&
      deviceCount === NoOfUsersOrDevices.Unlimited
    ) {
      return LicenseType.Floating;
    } else if (
      deviceCount !== NoOfUsersOrDevices.Unlimited &&
      userCount === NoOfUsersOrDevices.Unlimited
    ) {
      return LicenseType.DeviceLimited;
    } else if (
      deviceCount === NoOfUsersOrDevices.Unlimited &&
      userCount === NoOfUsersOrDevices.Unlimited
    ) {
      return LicenseType.TimeLimited;
    } else {
      return LicenseType.TimeLimited;
    }
  };

  // Update license type when device or user count changes
  useEffect(() => {
    const calculatedLicenseType = calculateLicenseType(noOfDevice, noOfUser);
    if (calculatedLicenseType !== null) {
      setLicenseType(calculatedLicenseType);
      form.setFieldsValue({ licenseType: calculatedLicenseType });
    }
  }, [noOfDevice, noOfUser, form]);

  // Handle device count change
  const handleDeviceCountChange = (value) => {
    setNoOfDevice(value);
    form.setFieldsValue({ noOfDevice: value });
  };

  // Handle user count change
  const handleUserCountChange = (value) => {
    setNoOfUser(value);
    form.setFieldsValue({ noOfUser: value });
  };

  // Get license type label
  const getLicenseTypeLabel = (type) => {
    switch (type) {
      case LicenseType.TimeLimited:
        return "Time-Limited License";
      case LicenseType.DeviceLimited:
        return "Device-Limited License";
      case LicenseType.Floating:
        return "Floating License";
      default:
        return "Unknown";
    }
  };

  // Reset form when modal opens/closes or license changes
  useEffect(() => {
    if (open) {
      if (license) {
        const subscription = subscriptions.find(
          (sub) => sub.companyProductID === license.companyProductID
        );

        if (subscription) {
          setSelectedCompany(subscription.companyID);
          setSelectedProduct(subscription.productID);
          setSelectedSubscription(subscription);

          const companyProducts = subscriptions
            .filter((sub) => sub.companyID === subscription.companyID)
            .map((sub) => sub.productID);
          setFilteredProducts(
            products.filter((product) =>
              companyProducts.includes(product.productID)
            )
          );
        }

        setNoOfDevice(license.noOfDevice);
        setNoOfUser(license.noOfUser);
        setLicenseType(license.licenseType);

        form.setFieldsValue({
          ...license,
          companyID: subscription?.companyID,
          productID: subscription?.productID,
          expiryDate: license.expiryDate?.split("T")[0],
        });
      } else {
        form.resetFields();
        setSelectedCompany(null);
        setSelectedProduct(null);
        setFilteredProducts([]);
        setSelectedSubscription(null);
        setNoOfDevice(null);
        setNoOfUser(null);
        setLicenseType(null);
      }
    }
  }, [open, license, dispatch, form, subscriptions, products]);

  // Handle company selection
  const handleCompanyChange = (companyID) => {
    setSelectedCompany(companyID);
    setSelectedProduct(null);
    setSelectedSubscription(null);

    form.setFieldsValue({
      productID: undefined,
      companyProductID: undefined,
    });

    const companySubscriptions = subscriptions.filter(
      (sub) => sub.companyID === companyID
    );
    const companyProductIDs = companySubscriptions.map((sub) => sub.productID);
    const availableProducts = products.filter((product) =>
      companyProductIDs.includes(product.productID)
    );

    setFilteredProducts(availableProducts);
  };

  // Handle product selection
  const handleProductChange = (productID) => {
    setSelectedProduct(productID);

    const subscription = subscriptions.find(
      (sub) => sub.companyID === selectedCompany && sub.productID === productID
    );

    if (subscription) {
      setSelectedSubscription(subscription);
      form.setFieldsValue({
        companyProductID: subscription.companyProductID,
      });
    }
  };

  // Helper to get company and product names
  const getCompanyName = (companyID) =>
    companies.find((c) => c.companyID === companyID)?.companyName || "Unknown";
  const getProductName = (productID) =>
    products.find((p) => p.productID === productID)?.productName || "Unknown";

  // Submit the license and update fee structure
  const onFinish = async (values) => {
    try {
      const licenseData = {
        companyProductID: selectedSubscription?.companyProductID,
        expiryDate: new Date(values.expiryDate).toISOString(),
        noOfDevice: noOfDevice,
        noOfUser: noOfUser,
        licenseType: licenseType,
        publicKey: values.publicKey,
      };

      // Generate the license first
      await dispatch(generateLicense(licenseData)).unwrap();

      // Step 1: Take companyProductId from the filled form
      const companyProductId = selectedSubscription?.companyProductID;

      if (!companyProductId) {
        throw new Error("Company Product ID is required");
      }

      // Step 2: Fetch companyFeeStructure by using this companyProductId
      const feeStructureResult = await dispatch(
        getFeeStructuresByCompanyProductId(companyProductId)
      ).unwrap();

      if (!feeStructureResult || feeStructureResult.length === 0) {
        throw new Error("No fee structure found for the selected subscription");
      }

      // Step 3: Extract companyFeeStructureId from fetched companyFeeStructure
      const updatePromises = feeStructureResult.map(async (feeStructure) => {
        if (!feeStructure.companyFeeStructureID) {
          console.error("Invalid companyFeeStructureID for fee:", feeStructure);
          throw new Error("Invalid companyFeeStructureID detected");
        }

        // Step 4: Update companyFeeStructure table using companyFeeStructureId
        // Prepare the request body as per API specification
        const updatedFeeData = {
          companyProductID: feeStructure.companyProductID,
          feeID: feeStructure.feeID,
          paidAmount: feeStructure.unpaidAmount || 0, // Move unpaid to paid
          unpaidAmount: 0, // Set unpaid to 0
          payableAmount: feeStructure.payableAmount || 0, // Keep existing payable amount
        };

        // Use the correct parameter name as per CheckExpiryPage pattern
        const result = await dispatch(
          updateCompanyFeeStructure({
            CompanyFeeStructureID: feeStructure.companyFeeStructureID, // Note: Capital ID
            data: updatedFeeData,
          })
        );

        if (!updateCompanyFeeStructure.fulfilled.match(result)) {
          throw new Error("Failed to update fee structure");
        }

        return result;
      });

      // Wait for all fee structure updates to complete
      await Promise.all(updatePromises);

      // Reset form and close modal on success
      form.resetFields();
      setSelectedCompany(null);
      setSelectedProduct(null);
      setFilteredProducts([]);
      setSelectedSubscription(null);
      setNoOfDevice(null);
      setNoOfUser(null);
      setLicenseType(null);
      onClose();

      // Show success message
      console.log("License generated and fee structure updated successfully");
    } catch (error) {
      console.error("Error in license generation or fee update:", error);

      // Show error to user
      form.setFields([
        {
          name: "publicKey",
          errors: [
            error.message ||
              "Failed to generate license or update fee structure. Please try again.",
          ],
        },
      ]);
    }
  };

  return (
    <Modal
      title="🎫 Generate License"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      className="rounded-xl"
    >
      {(licenseError || feeError) && (
        <Alert
          type="error"
          message={`Error: ${licenseError || feeError}`}
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
          name="companyID"
          label="Company"
          rules={[{ required: true, message: "Please select a company" }]}
        >
          <Select
            placeholder="Select company"
            onChange={handleCompanyChange}
            value={selectedCompany}
          >
            {companies.map((company) => (
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
          <Select
            placeholder="Select product"
            onChange={handleProductChange}
            value={selectedProduct}
            disabled={!selectedCompany}
          >
            {filteredProducts.map((product) => (
              <Option key={product.productID} value={product.productID}>
                {product.productName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="companyProductID" label="Company-Product Subscription">
          <Input
            placeholder="Auto-filled based on company and product selection"
            disabled
            value={
              selectedSubscription
                ? `${getCompanyName(
                    selectedSubscription.companyID
                  )} - ${getProductName(selectedSubscription.productID)}`
                : ""
            }
          />
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
            { required: true, message: "Please select number of devices" },
          ]}
        >
          <Select
            placeholder="Select device count range"
            onChange={handleDeviceCountChange}
            value={noOfDevice}
          >
            {Object.entries(NoOfUsersOrDevices).map(([key, value]) => (
              <Option key={value} value={value}>
                {getEnumLabel(value)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="noOfUser"
          label="Number of Users"
          rules={[{ required: true, message: "Please select number of users" }]}
        >
          <Select
            placeholder="Select user count range"
            onChange={handleUserCountChange}
            value={noOfUser}
          >
            {Object.entries(NoOfUsersOrDevices).map(([key, value]) => (
              <Option key={value} value={value}>
                {getEnumLabel(value)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="licenseType" label="License Type">
          <Input
            placeholder="Auto-calculated based on device and user selection"
            disabled
            value={licenseType ? getLicenseTypeLabel(licenseType) : ""}
          />
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
              disabled={
                !selectedSubscription ||
                !noOfDevice ||
                !noOfUser ||
                feeStatus === "loading"
              }
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
