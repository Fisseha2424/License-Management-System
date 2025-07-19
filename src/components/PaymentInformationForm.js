// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Upload,
//   Button,
//   Select,
//   InputNumber,
//   Checkbox,
//   message,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import PropTypes from "prop-types";
// import dayjs from "dayjs";
// import {
//   getCompanyFeeStructures,
//   updateCompanyFeeStructure,
// } from "../slices/companyFeeSlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
// import { getProducts } from "../slices/productSlice";
// import {
//   getPayments,
//   approvePayment,
//   rejectPayment,
// } from "../slices/paymentSlice";
// import { generateLicense, checkExpiry } from "../slices/licenseSlice";

// const { TextArea } = Input;
// const { Option } = Select;

// const PaymentStatus = {
//   Prepared: 1,
//   Approved: 2,
//   Cancelled: 3,
// };

// const LicenseType = {
//   TimeLimitedLicenses: 1,
//   DeviceLimitedLicenses: 2,
//   FloatingLicenses: 3,
// };

// const NoOfUsersOrDevices = {
//   ZeroToTen: 1,
//   ElevenToFifty: 2,
//   FiftyOneToHundred: 3,
//   Unlimited: 4,
// };

// const PaymentInformationForm = ({
//   visible,
//   onCancel,
//   onSubmit,
//   initialValues,
//   isStatusOnlyUpdate,
//   onLicenseGenerated,
// }) => {
//   const [form] = Form.useForm();
//   const [paymentInformation, setPaymentInformation] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [maxPaidAmount, setMaxPaidAmount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   const dispatch = useDispatch();
//   const {
//     feeStructures = [],
//     status: feeStatus = "idle",
//     error: feeError = null,
//   } = useSelector((state) => state.companyFee || {});
//   const {
//     payments = [],
//     status: paymentStatus = "idle",
//     error: paymentError = null,
//   } = useSelector((state) => state.payment || {});
//   const { subscriptions = [] } = useSelector(
//     (state) => state.subscription || {}
//   );
//   const { products = [] } = useSelector((state) => state.product || {});

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         console.log(
//           "[DEBUG] Starting to fetch company fee structures, payments, subscriptions, and products..."
//         );

//         const [
//           feeStructuresResult,
//           paymentsResult,
//           subscriptionsResult,
//           productsResult,
//         ] = await Promise.all([
//           dispatch(getCompanyFeeStructures()).unwrap(),
//           dispatch(getPayments()).unwrap(),
//           dispatch(getSubscriptions()).unwrap(),
//           dispatch(getProducts()).unwrap(),
//         ]);

//         console.log(
//           "[DEBUG] Raw company fee structures from Redux:",
//           feeStructuresResult
//         );
//         console.log("[DEBUG] Raw payments from Redux:", paymentsResult);
//         console.log(
//           "[DEBUG] Raw subscriptions from Redux:",
//           subscriptionsResult
//         );
//         console.log("[DEBUG] Raw products from Redux:", productsResult);

//         if (!Array.isArray(paymentsResult)) {
//           console.error(
//             "[ERROR] Payments response is not an array:",
//             paymentsResult
//           );
//           setPaymentInformation([]);
//         } else {
//           setPaymentInformation(paymentsResult);
//         }

//         const companiesWithUnpaid = (feeStructuresResult || []).filter(
//           (company) => {
//             const hasUnpaid = company.unpaidAmount > 0;
//             console.log(
//               `[DEBUG] Company ${company.companyName} - unpaid: ${company.unpaidAmount}, included: ${hasUnpaid}`
//             );
//             return hasUnpaid;
//           }
//         );

//         console.log("[DEBUG] Filtered companies:", companiesWithUnpaid);
//         setFilteredCompanies(companiesWithUnpaid);

//         if (companiesWithUnpaid.length === 0) {
//           console.warn("[WARNING] No companies found with unpaid amount > 0");
//         }
//       } catch (error) {
//         console.error("[ERROR] Error fetching data:", error);
//         setFilteredCompanies([]);
//         setPaymentInformation([]);
//         setFilteredProducts([]);
//         message.error("Failed to load company data");
//       } finally {
//         setLoading(false);
//         console.log("[DEBUG] Data fetching completed");
//       }
//     };

//     if (visible && !isStatusOnlyUpdate) {
//       console.log("[DEBUG] Modal visible - starting data fetch");
//       fetchData();
//     } else {
//       console.log(
//         "[DEBUG] Modal not visible or edit mode - skipping data fetch"
//       );
//     }
//   }, [visible, dispatch, isStatusOnlyUpdate]);

//   useEffect(() => {
//     if (feeError || paymentError) {
//       console.error("[ERROR] Redux errors:", { feeError, paymentError });
//       setFilteredCompanies([]);
//       setPaymentInformation([]);
//       setFilteredProducts([]);
//       message.error("Error loading data");
//     }
//   }, [feeError, paymentError]);

//   useEffect(() => {
//     if (visible && initialValues) {
//       console.log("[DEBUG] Setting initial form values:", initialValues);
//       const paymentDate = initialValues.paymentDate
//         ? dayjs(initialValues.paymentDate)
//         : null;
//       const expiryDate = initialValues.expiryDate
//         ? dayjs(initialValues.expiryDate)
//         : null;

//       form.setFieldsValue({
//         companyFeeStructureID: initialValues.companyFeeStructureID || "",
//         companyName: initialValues.companyName || "",
//         productIDs: initialValues.productIDs || [],
//         unpaidAmount: initialValues.unpaidAmount || 0,
//         unapprovedAmount: initialValues.unapprovedAmount || 0,
//         paidAmount: initialValues.paidAmount || 0,
//         reference: initialValues.reference || "",
//         paymentDate,
//         expiryDate,
//         status: initialValues.status || PaymentStatus.Prepared,
//         paymentDocument: initialValues.paymentDocument
//           ? [{ url: initialValues.paymentDocument }]
//           : [],
//         narration: initialValues.narration || "",
//       });

//       if (initialValues.companyFeeStructureID) {
//         setSelectedCompany(initialValues.companyFeeStructureID);
//         handleCompanyChange(initialValues.companyFeeStructureID);
//       }
//     } else {
//       console.log("[DEBUG] Resetting form fields");
//       form.resetFields();
//       setSelectedCompany(null);
//       setFilteredProducts([]);
//     }
//   }, [visible, initialValues, form]);

//   const handleCompanyChange = (companyFeeStructureID) => {
//     console.log("[DEBUG] Company selected:", companyFeeStructureID);
//     setSelectedCompany(companyFeeStructureID);

//     const selectedCompanyData = filteredCompanies.find(
//       (company) => company.companyFeeStructureID === companyFeeStructureID
//     );

//     if (selectedCompanyData) {
//       console.log("[DEBUG] Selected company data:", selectedCompanyData);
//       setMaxPaidAmount(selectedCompanyData.unpaidAmount);

//       form.setFieldsValue({
//         companyName: selectedCompanyData.companyName,
//         unpaidAmount: selectedCompanyData.unpaidAmount,
//         paidAmount: 0,
//         productIDs: [],
//       });

//       const companyFees = filteredCompanies.filter(
//         (company) => company.companyName === selectedCompanyData.companyName
//       );
//       const availableProducts = companyFees.map((fee) => ({
//         productID: fee.companyProductID,
//         productName: fee.productName,
//       }));

//       console.log("[DEBUG] Available products for company:", availableProducts);
//       setFilteredProducts(availableProducts);
//     } else {
//       console.log("[DEBUG] No company data found for selected ID");
//       setFilteredProducts([]);
//     }
//   };

//   const convertToDate = (dateValue) => {
//     if (!dateValue) {
//       console.log("[DEBUG] No date value to convert");
//       return null;
//     }

//     if (dayjs.isDayjs(dateValue)) {
//       console.log("[DEBUG] Date value is dayjs object");
//       if (dateValue.isValid()) {
//         return dateValue.toDate();
//       } else {
//         console.error("[ERROR] Invalid dayjs object:", dateValue);
//         message.error("Invalid date provided");
//         return null;
//       }
//     }

//     if (dateValue instanceof Date) {
//       console.log("[DEBUG] Date value is already Date object");
//       if (isNaN(dateValue.getTime())) {
//         console.error("[ERROR] Invalid Date object:", dateValue);
//         message.error("Invalid date provided");
//         return null;
//       }
//       return dateValue;
//     }

//     if (typeof dateValue === "string") {
//       console.log("[DEBUG] Converting string to Date");
//       const parsedDate = dayjs(dateValue);
//       if (parsedDate.isValid()) {
//         return parsedDate.toDate();
//       } else {
//         console.error("[ERROR] Invalid date string:", dateValue);
//         message.error("Invalid date string provided");
//         return null;
//       }
//     }

//     console.error("[ERROR] Unhandled date value type:", dateValue);
//     message.error("Unable to process date");
//     return null;
//   };

//   const handleFinish = async (values) => {
//     console.log("[DEBUG] Form submitted with values:", values);
//     let paymentDocument = null;

//     const paymentDate = convertToDate(values.paymentDate);
//     const expiryDate = convertToDate(values.expiryDate);

//     console.log("[DEBUG] Converted paymentDate:", paymentDate);
//     console.log("[DEBUG] Converted expiryDate:", expiryDate);

//     if (initialValues && initialValues.paymentId && isStatusOnlyUpdate) {
//       const initialStatus = initialValues.status;
//       const newStatus = values.status;

//       if (initialStatus !== newStatus) {
//         try {
//           if (newStatus === PaymentStatus.Approved) {
//             console.log(
//               "[DEBUG] Dispatching approvePayment for paymentId:",
//               initialValues.paymentId
//             );
//             await dispatch(approvePayment(initialValues.paymentId)).unwrap();
//             message.success("Payment approved successfully");
//             onSubmit({ ...values, paymentId: initialValues.paymentId });
//             return;
//           } else if (newStatus === PaymentStatus.Cancelled) {
//             console.log(
//               "[DEBUG] Dispatching rejectPayment for paymentId:",
//               initialValues.paymentId
//             );
//             await dispatch(rejectPayment(initialValues.paymentId)).unwrap();
//             message.success("Payment rejected successfully");
//             onSubmit({ ...values, paymentId: initialValues.paymentId });
//             return;
//           }
//         } catch (error) {
//           console.error("[ERROR] Error updating payment status:", error);
//           message.error("Failed to update payment status");
//           return;
//         }
//       } else {
//         console.log(
//           "[DEBUG] No status change detected, skipping status update"
//         );
//         message.info("No status change detected");
//         return;
//       }
//     }

//     const selectedCompanyData = filteredCompanies.find(
//       (company) =>
//         company.companyFeeStructureID === values.companyFeeStructureID
//     );

//     if (!selectedCompanyData) {
//       console.error("[ERROR] Selected company data not found");
//       message.error("Selected company data not found");
//       return;
//     }

//     const isFullPayment = values.paidAmount === values.unpaidAmount;
//     const status = isFullPayment
//       ? PaymentStatus.Approved
//       : PaymentStatus.Prepared;

//     form.setFieldsValue({ status });

//     const submissionData = {
//       companyFeeStructureID: values.companyFeeStructureID,
//       companyName: values.companyName,
//       productIDs: values.productIDs,
//       unpaidAmount: values.unpaidAmount,
//       unapprovedAmount: values.unapprovedAmount,
//       paidAmount: values.paidAmount,
//       reference: values.reference,
//       paymentDate: paymentDate,
//       expiryDate: expiryDate,
//       status: status,
//       paymentDocument: null,
//       narration: values.narration,
//       paymentId: initialValues?.paymentId || null,
//     };

//     if (values.paymentDocument?.[0]?.originFileObj) {
//       console.log("[DEBUG] Processing file upload");
//       const reader = new FileReader();
//       reader.onload = async (event) => {
//         const base64String = event.target.result.split(",")[1];
//         submissionData.paymentDocument = base64String;
//         console.log("[DEBUG] File converted to base64");

//         await processPaymentAndLicense(
//           submissionData,
//           selectedCompanyData,
//           values.productIDs
//         );
//       };
//       reader.onerror = (error) => {
//         console.error("[ERROR] Error converting file to base64:", error);
//         message.error("Failed to process file upload");
//       };
//       reader.readAsDataURL(values.paymentDocument[0].originFileObj);
//     } else {
//       console.log(
//         "[DEBUG] No new file uploaded, using existing document if available"
//       );
//       submissionData.paymentDocument = initialValues?.paymentDocument || null;
//       await processPaymentAndLicense(
//         submissionData,
//         selectedCompanyData,
//         values.productIDs
//       );
//     }
//   };

//   const processPaymentAndLicense = async (
//     submissionData,
//     selectedCompanyData,
//     selectedProductIDs
//   ) => {
//     try {
//       console.log("[DEBUG] Submitting payment data:", submissionData);
//       onSubmit(submissionData);

//       // Calculate the payment distribution across selected products
//       const totalPaidAmount = submissionData.paidAmount;
//       const numProducts = selectedProductIDs.length;
//       const paidAmountPerProduct =
//         numProducts > 0 ? totalPaidAmount / numProducts : totalPaidAmount;

//       // Update company fee structure for each selected product
//       for (const productID of selectedProductIDs) {
//         const feeStructure = filteredCompanies.find(
//           (company) => company.companyProductID === productID
//         );

//         if (!feeStructure) {
//           console.error(
//             "[ERROR] Fee structure not found for productID:",
//             productID
//           );
//           message.error(`Fee structure not found for product: ${productID}`);
//           continue;
//         }

//         // Calculate new unpaid amount for this product's fee structure
//         const newUnpaidAmount =
//           feeStructure.unpaidAmount - paidAmountPerProduct;
//         if (newUnpaidAmount < 0) {
//           console.error(
//             "[ERROR] Calculated unpaid amount is negative for productID:",
//             productID
//           );
//           message.error("Invalid payment amount calculation");
//           continue;
//         }

//         const feeUpdateData = {
//           companyFeeStructureID: feeStructure.companyFeeStructureID,
//           unpaidAmount: newUnpaidAmount,
//         };

//         console.log(
//           "[DEBUG] Updating company fee structure with data:",
//           feeUpdateData
//         );
//         await dispatch(updateCompanyFeeStructure(feeUpdateData)).unwrap();
//         console.log(
//           `[DEBUG] Updated unpaid amount for companyFeeStructureID: ${feeStructure.companyFeeStructureID} to ${newUnpaidAmount}`
//         );
//       }

//       if (submissionData.status === PaymentStatus.Approved) {
//         for (const productID of selectedProductIDs) {
//           const feeStructure = filteredCompanies.find(
//             (company) => company.companyProductID === productID
//           );

//           if (!feeStructure) {
//             console.error(
//               "[ERROR] Fee structure not found for productID:",
//               productID
//             );
//             message.error(`Fee structure not found for product: ${productID}`);
//             continue;
//           }

//           const feeType = feeStructure.feeType || "Subscription";
//           const licenseType =
//             LicenseType[feeStructure.licenseType] ||
//             LicenseType.TimeLimitedLicenses;
//           const period = 12;
//           const expiryDate = dayjs("2025-07-14T15:39:00+03:00")
//             .add(period, "month")
//             .toDate();

//           let noOfUser = NoOfUsersOrDevices.Unlimited;
//           let noOfDevice = NoOfUsersOrDevices.Unlimited;

//           if (licenseType === LicenseType.DeviceLimitedLicenses) {
//             noOfDevice = NoOfUsersOrDevices.ZeroToTen;
//           } else if (licenseType === LicenseType.FloatingLicenses) {
//             noOfUser = NoOfUsersOrDevices.ZeroToTen;
//           }

//           const licenseData = {
//             companyProductID: feeStructure.companyProductID,
//             expiryDate: expiryDate.toISOString(),
//             noOfDevice,
//             noOfUser,
//             licenseType,
//             publicKey: "default-public-key",
//           };

//           if (feeType === "Subscription") {
//             console.log(
//               "[DEBUG] Generating new license for subscription:",
//               licenseData
//             );
//             const actionResult = await dispatch(
//               generateLicense(licenseData)
//             ).unwrap();
//             if (onLicenseGenerated) {
//               onLicenseGenerated();
//             }
//           } else if (feeType === "Renewal") {
//             console.log("[DEBUG] Updating license for renewal:", licenseData);
//             console.warn(
//               "[DEBUG] updateLicense action not implemented, skipping license update"
//             );
//           }

//           console.log("[DEBUG] Checking license expiry");
//           await dispatch(checkExpiry()).unwrap();
//         }

//         message.success("Payment and license(s) processed successfully");
//       } else {
//         console.log("[DEBUG] Partial payment, no license generated");
//         message.success(
//           "Partial payment saved and fee structure updated successfully"
//         );
//       }
//     } catch (error) {
//       console.error("[ERROR] Error processing payment or license:", error);
//       message.error("Failed to process payment or update fee structure");
//     }
//   };

//   return (
//     <Modal
//       title={
//         initialValues
//           ? isStatusOnlyUpdate
//             ? "Update Payment Status"
//             : "Add Payment"
//           : "Add Payment"
//       }
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={isStatusOnlyUpdate ? 400 : 800}
//     >
//       <Form
//         form={form}
//         onFinish={handleFinish}
//         layout="vertical"
//         initialValues={{
//           companyFeeStructureID: "",
//           companyName: "",
//           productIDs: [],
//           unpaidAmount: 0,
//           unapprovedAmount: 0,
//           paidAmount: 0,
//           reference: "",
//           paymentDate: null,
//           expiryDate: null,
//           status: PaymentStatus.Prepared,
//         }}
//       >
//         {isStatusOnlyUpdate ? (
//           <>
//             <Form.Item name="companyName" label="Company Name">
//               <Input value={initialValues?.companyName} disabled />
//             </Form.Item>
//             <Form.Item name="productIDs" label="Products">
//               <Input value={initialValues?.productIDs?.join(", ")} disabled />
//             </Form.Item>
//             <Form.Item name="unpaidAmount" label="Unpaid Amount">
//               <InputNumber
//                 value={initialValues?.unpaidAmount}
//                 disabled
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//             <Form.Item name="unapprovedAmount" label="Unapproved Amount">
//               <InputNumber
//                 value={initialValues?.unapprovedAmount}
//                 disabled
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//             <Form.Item name="paidAmount" label="Paid Amount">
//               <InputNumber
//                 value={initialValues?.paidAmount}
//                 disabled
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//             <Form.Item name="reference" label="Reference">
//               <Input value={initialValues?.reference} disabled />
//             </Form.Item>
//             <Form.Item name="paymentDate" label="Payment Date">
//               <DatePicker
//                 value={
//                   initialValues?.paymentDate
//                     ? dayjs(initialValues.paymentDate)
//                     : null
//                 }
//                 style={{ width: "100%" }}
//                 format="YYYY-MM-DD"
//                 disabled
//               />
//             </Form.Item>
//             <Form.Item name="expiryDate" label="Expiry Date">
//               <DatePicker
//                 value={
//                   initialValues?.expiryDate
//                     ? dayjs(initialValues.expiryDate)
//                     : null
//                 }
//                 style={{ width: "100%" }}
//                 format="YYYY-MM-DD"
//                 disabled
//               />
//             </Form.Item>
//             <Form.Item
//               name="status"
//               label="Status"
//               rules={[{ required: true, message: "Please select status" }]}
//             >
//               <Select placeholder="Select status">
//                 <Option value={PaymentStatus.Prepared}>Prepared</Option>
//                 <Option value={PaymentStatus.Approved}>Approved</Option>
//                 <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item name="narration" label="Narration">
//               <TextArea value={initialValues?.narration} disabled rows={3} />
//             </Form.Item>
//           </>
//         ) : (
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "16px",
//             }}
//           >
//             <Form.Item
//               name="companyFeeStructureID"
//               label="Company Name"
//               rules={[{ required: true, message: "Please select a company" }]}
//             >
//               <Select
//                 placeholder={
//                   loading ||
//                   feeStatus === "loading" ||
//                   paymentStatus === "loading"
//                     ? "Loading companies..."
//                     : filteredCompanies.length > 0
//                     ? "Select company"
//                     : "No companies with unpaid amount"
//                 }
//                 onChange={handleCompanyChange}
//                 showSearch
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().indexOf(input.toLowerCase()) >=
//                   0
//                 }
//                 disabled={
//                   loading ||
//                   feeStatus === "loading" ||
//                   paymentStatus === "loading" ||
//                   filteredCompanies.length === 0
//                 }
//                 loading={
//                   loading ||
//                   feeStatus === "loading" ||
//                   paymentStatus === "loading"
//                 }
//                 notFoundContent="No companies available"
//               >
//                 {filteredCompanies.map((company) => (
//                   <Option
//                     key={company.companyFeeStructureID}
//                     value={company.companyFeeStructureID}
//                   >
//                     {company.companyName} (Unpaid: ${company.unpaidAmount})
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item name="companyName" label="Company Name" hidden>
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="productIDs"
//               label="Products"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please select at least one product",
//                 },
//               ]}
//             >
//               <Checkbox.Group
//                 options={filteredProducts.map((product) => ({
//                   label: product.productName,
//                   value: product.productID,
//                 }))}
//                 disabled={!selectedCompany || filteredProducts.length === 0}
//               />
//             </Form.Item>

//             <Form.Item
//               name="unpaidAmount"
//               label="Unpaid Amount"
//               rules={[{ required: true, message: "Unpaid amount is required" }]}
//             >
//               <InputNumber
//                 placeholder="Unpaid amount (auto-filled)"
//                 disabled
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>

//             <Form.Item
//               name="unapprovedAmount"
//               label="Unapproved Amount"
//               rules={[{ required: true, message: "Unpaid amount is required" }]}
//             >
//               <InputNumber
//                 placeholder="Unapproved amount (auto-filled)"
//                 disabled
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>

//             <Form.Item
//               name="paidAmount"
//               label="Paid Amount"
//               rules={[
//                 { required: true, message: "Please enter paid amount" },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const unpaidAmount = getFieldValue("unpaidAmount") || 0;
//                     if (!value || value <= unpaidAmount) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error(
//                         "Paid amount cannot be greater than unpaid amount"
//                       )
//                     );
//                   },
//                 }),
//               ]}
//             >
//               <InputNumber
//                 placeholder="Enter paid amount"
//                 style={{ width: "100%" }}
//                 max={maxPaidAmount}
//                 min={0}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>

//             <Form.Item
//               name="reference"
//               label="Reference"
//               rules={[{ required: true, message: "Please enter reference" }]}
//             >
//               <Input placeholder="Enter reference number" />
//             </Form.Item>

//             <Form.Item
//               name="paymentDate"
//               label="Payment Date"
//               rules={[{ required: true, message: "Please select a date" }]}
//             >
//               <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
//             </Form.Item>

//             <Form.Item
//               name="expiryDate"
//               label="Expiry Date"
//               rules={[
//                 { required: true, message: "Please select an expiry date" },
//               ]}
//             >
//               <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
//             </Form.Item>

//             <Form.Item
//               name="status"
//               label="Status"
//               rules={[{ required: true, message: "Please select status" }]}
//             >
//               <Select placeholder="Select status" disabled>
//                 <Option value={PaymentStatus.Prepared}>Prepared</Option>
//                 <Option value={PaymentStatus.Approved}>Approved</Option>
//                 <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
//               </Select>
//             </Form.Item>
//           </div>
//         )}

//         {!isStatusOnlyUpdate && (
//           <>
//             <Form.Item
//               name="paymentDocument"
//               label="Upload Document"
//               valuePropName="fileList"
//               getValueFromEvent={(e) => e.fileList}
//             >
//               <Upload beforeUpload={() => false} maxCount={1}>
//                 <Button icon={<UploadOutlined />}>Click to Upload</Button>
//               </Upload>
//             </Form.Item>

//             <Form.Item name="narration" label="Narration">
//               <TextArea placeholder="Enter narration" rows={3} />
//             </Form.Item>
//           </>
//         )}

//         <Form.Item>
//           <div
//             style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
//           >
//             <Button onClick={onCancel}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               {initialValues
//                 ? isStatusOnlyUpdate
//                   ? "Update Status"
//                   : "Save"
//                 : "Save"}
//             </Button>
//           </div>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// PaymentInformationForm.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   onCancel: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
//   initialValues: PropTypes.shape({
//     paymentId: PropTypes.string,
//     companyFeeStructureID: PropTypes.string,
//     companyName: PropTypes.string,
//     productIDs: PropTypes.arrayOf(PropTypes.string),
//     unpaidAmount: PropTypes.number,
//     unapprovedAmount: PropTypes.number,
//     paidAmount: PropTypes.number,
//     reference: PropTypes.string,
//     paymentDate: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.instanceOf(Date),
//     ]),
//     expiryDate: PropTypes.oneOfType([
//       PropTypes.string,
//       PropTypes.instanceOf(Date),
//     ]),
//     status: PropTypes.number,
//     paymentDocument: PropTypes.string,
//     narration: PropTypes.string,
//     isStatusOnlyUpdate: PropTypes.bool,
//   }),
//   isStatusOnlyUpdate: PropTypes.bool,
//   onLicenseGenerated: PropTypes.func,
// };

// export default PaymentInformationForm;
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Select,
  InputNumber,
  Checkbox,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  getCompanyFeeStructures,
  updateCompanyFeeStructure,
} from "../slices/companyFeeSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { getProducts } from "../slices/productSlice";
import {
  getPayments,
  approvePayment,
  rejectPayment,
} from "../slices/paymentSlice";
import { generateLicense, checkExpiry } from "../slices/licenseSlice";

const { TextArea } = Input;
const { Option } = Select;

const PaymentStatus = {
  Prepared: 1,
  Approved: 2,
  Cancelled: 3,
};

const LicenseType = {
  TimeLimitedLicenses: 1,
  DeviceLimitedLicenses: 2,
  FloatingLicenses: 3,
};

const NoOfUsersOrDevices = {
  ZeroToTen: 1,
  ElevenToFifty: 2,
  FiftyOneToHundred: 3,
  Unlimited: 4,
};

const PaymentInformationForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  isStatusOnlyUpdate,
  onLicenseGenerated,
}) => {
  const [form] = Form.useForm();
  const [paymentInformation, setPaymentInformation] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxPaidAmount, setMaxPaidAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const dispatch = useDispatch();
  const {
    feeStructures = [],
    status: feeStatus = "idle",
    error: feeError = null,
  } = useSelector((state) => state.companyFee || {});
  const {
    payments = [],
    status: paymentStatus = "idle",
    error: paymentError = null,
  } = useSelector((state) => state.payment || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { products = [] } = useSelector((state) => state.product || {});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(
          "[DEBUG] Starting to fetch company fee structures, payments, subscriptions, and products..."
        );

        const [
          feeStructuresResult,
          paymentsResult,
          subscriptionsResult,
          productsResult,
        ] = await Promise.all([
          dispatch(getCompanyFeeStructures()).unwrap(),
          dispatch(getPayments()).unwrap(),
          dispatch(getSubscriptions()).unwrap(),
          dispatch(getProducts()).unwrap(),
        ]);

        console.log(
          "[DEBUG] Raw company fee structures from Redux:",
          feeStructuresResult
        );
        console.log("[DEBUG] Raw payments from Redux:", paymentsResult);
        console.log(
          "[DEBUG] Raw subscriptions from Redux:",
          subscriptionsResult
        );
        console.log("[DEBUG] Raw products from Redux:", productsResult);

        if (!Array.isArray(paymentsResult)) {
          console.error(
            "[ERROR] Payments response is not an array:",
            paymentsResult
          );
          setPaymentInformation([]);
        } else {
          setPaymentInformation(paymentsResult);
        }

        const companiesWithUnpaid = (feeStructuresResult || []).filter(
          (company) => {
            const hasUnpaid = company.unpaidAmount > 0;
            console.log(
              `[DEBUG] Company ${company.companyName} - unpaid: ${company.unpaidAmount}, included: ${hasUnpaid}`
            );
            return hasUnpaid;
          }
        );

        console.log("[DEBUG] Filtered companies:", companiesWithUnpaid);
        setFilteredCompanies(companiesWithUnpaid);

        if (companiesWithUnpaid.length === 0) {
          console.warn("[WARNING] No companies found with unpaid amount > 0");
        }
      } catch (error) {
        console.error("[ERROR] Error fetching data:", error);
        setFilteredCompanies([]);
        setPaymentInformation([]);
        setFilteredProducts([]);
        message.error("Failed to load company data");
      } finally {
        setLoading(false);
        console.log("[DEBUG] Data fetching completed");
      }
    };

    if (visible && !isStatusOnlyUpdate) {
      console.log("[DEBUG] Modal visible - starting data fetch");
      fetchData();
    } else {
      console.log(
        "[DEBUG] Modal not visible or edit mode - skipping data fetch"
      );
    }
  }, [visible, dispatch, isStatusOnlyUpdate]);

  useEffect(() => {
    if (feeError || paymentError) {
      console.error("[ERROR] Redux errors:", { feeError, paymentError });
      setFilteredCompanies([]);
      setPaymentInformation([]);
      setFilteredProducts([]);
      message.error("Error loading data");
    }
  }, [feeError, paymentError]);

  useEffect(() => {
    if (visible && initialValues) {
      console.log("[DEBUG] Setting initial form values:", initialValues);
      const paymentDate = initialValues.paymentDate
        ? dayjs(initialValues.paymentDate)
        : null;
      const expiryDate = initialValues.expiryDate
        ? dayjs(initialValues.expiryDate)
        : null;

      form.setFieldsValue({
        companyFeeStructureID: initialValues.companyFeeStructureID || "",
        companyName: initialValues.companyName || "",
        productIDs: initialValues.productIDs || [],
        unpaidAmount: initialValues.unpaidAmount || 0,
        unapprovedAmount: initialValues.unapprovedAmount || 0,
        paidAmount: initialValues.paidAmount || 0,
        reference: initialValues.reference || "",
        paymentDate,
        expiryDate,
        status: initialValues.status || PaymentStatus.Prepared,
        paymentDocument: initialValues.paymentDocument
          ? [{ url: initialValues.paymentDocument }]
          : [],
        narration: initialValues.narration || "",
      });

      if (initialValues.companyFeeStructureID) {
        setSelectedCompany(initialValues.companyFeeStructureID);
        handleCompanyChange(initialValues.companyFeeStructureID);
      }
    } else {
      console.log("[DEBUG] Resetting form fields");
      form.resetFields();
      setSelectedCompany(null);
      setFilteredProducts([]);
    }
  }, [visible, initialValues, form]);

  const handleCompanyChange = (companyFeeStructureID) => {
    console.log("[DEBUG] Company selected:", companyFeeStructureID);
    setSelectedCompany(companyFeeStructureID);

    const selectedCompanyData = filteredCompanies.find(
      (company) => company.companyFeeStructureID === companyFeeStructureID
    );

    if (selectedCompanyData) {
      console.log("[DEBUG] Selected company data:", selectedCompanyData);
      setMaxPaidAmount(selectedCompanyData.unpaidAmount);

      form.setFieldsValue({
        companyName: selectedCompanyData.companyName,
        unpaidAmount: selectedCompanyData.unpaidAmount,
        paidAmount: 0,
        productIDs: [],
      });

      // Filter products based on companyName and ensure companyProductID exists
      const companyFees = filteredCompanies.filter(
        (company) =>
          company.companyName === selectedCompanyData.companyName &&
          company.companyProductID
      );
      const availableProducts = companyFees.map((fee) => ({
        productID: fee.companyProductID,
        productName: fee.productName,
      }));

      console.log("[DEBUG] Available products for company:", availableProducts);
      setFilteredProducts(availableProducts);
    } else {
      console.log("[DEBUG] No company data found for selected ID");
      setFilteredProducts([]);
    }
  };

  const convertToDate = (dateValue) => {
    if (!dateValue) {
      console.log("[DEBUG] No date value to convert");
      return null;
    }

    if (dayjs.isDayjs(dateValue)) {
      console.log("[DEBUG] Date value is dayjs object");
      if (dateValue.isValid()) {
        return dateValue.toDate();
      } else {
        console.error("[ERROR] Invalid dayjs object:", dateValue);
        message.error("Invalid date provided");
        return null;
      }
    }

    if (dateValue instanceof Date) {
      console.log("[DEBUG] Date value is already Date object");
      if (isNaN(dateValue.getTime())) {
        console.error("[ERROR] Invalid Date object:", dateValue);
        message.error("Invalid date provided");
        return null;
      }
      return dateValue;
    }

    if (typeof dateValue === "string") {
      console.log("[DEBUG] Converting string to Date");
      const parsedDate = dayjs(dateValue);
      if (parsedDate.isValid()) {
        return parsedDate.toDate();
      } else {
        console.error("[ERROR] Invalid date string:", dateValue);
        message.error("Invalid date string provided");
        return null;
      }
    }

    console.error("[ERROR] Unhandled date value type:", dateValue);
    message.error("Unable to process date");
    return null;
  };

  const handleFinish = async (values) => {
    console.log("[DEBUG] Form submitted with values:", values);
    let paymentDocument = null;

    const paymentDate = convertToDate(values.paymentDate);
    const expiryDate = convertToDate(values.expiryDate);

    console.log("[DEBUG] Converted paymentDate:", paymentDate);
    console.log("[DEBUG] Converted expiryDate:", expiryDate);

    if (initialValues && initialValues.paymentId && isStatusOnlyUpdate) {
      const initialStatus = initialValues.status;
      const newStatus = values.status;

      if (initialStatus !== newStatus) {
        try {
          if (newStatus === PaymentStatus.Approved) {
            console.log(
              "[DEBUG] Dispatching approvePayment for paymentId:",
              initialValues.paymentId
            );
            await dispatch(approvePayment(initialValues.paymentId)).unwrap();
            message.success("Payment approved successfully");
            onSubmit({ ...values, paymentId: initialValues.paymentId });
            onCancel(); // Close the modal
            return;
          } else if (newStatus === PaymentStatus.Cancelled) {
            console.log(
              "[DEBUG] Dispatching rejectPayment for paymentId:",
              initialValues.paymentId
            );
            await dispatch(rejectPayment(initialValues.paymentId)).unwrap();
            message.success("Payment rejected successfully");
            onSubmit({ ...values, paymentId: initialValues.paymentId });
            onCancel(); // Close the modal
            return;
          }
        } catch (error) {
          console.error("[ERROR] Error updating payment status:", error);
          message.error("Failed to update payment status");
          return;
        }
      } else {
        console.log(
          "[DEBUG] No status change detected, skipping status update"
        );
        message.info("No status change detected");
        return;
      }
    }

    const selectedCompanyData = filteredCompanies.find(
      (company) =>
        company.companyFeeStructureID === values.companyFeeStructureID
    );

    if (!selectedCompanyData) {
      console.error("[ERROR] Selected company data not found");
      message.error("Selected company data not found");
      return;
    }

    const isFullPayment = values.paidAmount === values.unpaidAmount;
    const status = isFullPayment
      ? PaymentStatus.Approved
      : PaymentStatus.Prepared;

    form.setFieldsValue({ status });

    const submissionData = {
      companyFeeStructureID: values.companyFeeStructureID,
      companyName: values.companyName,
      productIDs: values.productIDs,
      unpaidAmount: values.unpaidAmount,
      unapprovedAmount: values.unapprovedAmount,
      paidAmount: values.paidAmount,
      reference: values.reference,
      paymentDate: paymentDate,
      expiryDate: expiryDate,
      status: status,
      paymentDocument: null,
      narration: values.narration,
      paymentId: initialValues?.paymentId || null,
    };

    if (values.paymentDocument?.[0]?.originFileObj) {
      console.log("[DEBUG] Processing file upload");
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64String = event.target.result.split(",")[1];
        submissionData.paymentDocument = base64String;
        console.log("[DEBUG] File converted to base64");

        await processPaymentAndLicense(
          submissionData,
          selectedCompanyData,
          values.productIDs
        );
      };
      reader.onerror = (error) => {
        console.error("[ERROR] Error converting file to base64:", error);
        message.error("Failed to process file upload");
      };
      reader.readAsDataURL(values.paymentDocument[0].originFileObj);
    } else {
      console.log(
        "[DEBUG] No new file uploaded, using existing document if available"
      );
      submissionData.paymentDocument = initialValues?.paymentDocument || null;
      await processPaymentAndLicense(
        submissionData,
        selectedCompanyData,
        values.productIDs
      );
    }
    onCancel();
  };

  const processPaymentAndLicense = async (
    submissionData,
    selectedCompanyData,
    selectedProductIDs
  ) => {
    try {
      console.log("[DEBUG] Submitting payment data:", submissionData);
      onSubmit(submissionData);

      // Calculate the payment distribution across selected products
      const totalPaidAmount = submissionData.paidAmount;
      const numProducts = selectedProductIDs.length;
      const paidAmountPerProduct =
        numProducts > 0 ? totalPaidAmount / numProducts : totalPaidAmount;

      // Validate productIDs against filteredCompanies
      const validProductIDs = selectedProductIDs.filter((productID) =>
        filteredCompanies.some(
          (company) => company.companyProductID === productID
        )
      );

      if (validProductIDs.length !== selectedProductIDs.length) {
        console.warn(
          "[WARNING] Some productIDs are invalid:",
          selectedProductIDs.filter((id) => !validProductIDs.includes(id))
        );
        message.warning(
          "Some selected products are invalid and will be skipped"
        );
      }

      if (validProductIDs.length === 0) {
        console.error("[ERROR] No valid product IDs selected");
        message.error("No valid products selected for payment");
        return;
      }

      // Update company fee structure for each valid product
      for (const productID of validProductIDs) {
        const feeStructure = filteredCompanies.find(
          (company) => company.companyProductID === productID
        );

        if (!feeStructure) {
          console.error(
            "[ERROR] Fee structure not found for productID:",
            productID
          );
          message.error(`Fee structure not found for product: ${productID}`);
          continue;
        }

        // Calculate new unpaid amount for this product's fee structure
        const newUnpaidAmount =
          feeStructure.unpaidAmount - paidAmountPerProduct;
        if (newUnpaidAmount < 0) {
          console.error(
            "[ERROR] Calculated unpaid amount is negative for productID:",
            productID
          );
          message.error("Invalid payment amount calculation");
          continue;
        }

        const feeUpdateData = {
          companyFeeStructureID: feeStructure.companyFeeStructureID,
          unpaidAmount: newUnpaidAmount,
        };

        console.log(
          "[DEBUG] Updating company fee structure with data:",
          feeUpdateData
        );
        await dispatch(updateCompanyFeeStructure(feeUpdateData)).unwrap();
        console.log(
          `[DEBUG] Updated unpaid amount for companyFeeStructureID: ${feeStructure.companyFeeStructureID} to ${newUnpaidAmount}`
        );
      }

      if (submissionData.status === PaymentStatus.Approved) {
        for (const productID of validProductIDs) {
          const feeStructure = filteredCompanies.find(
            (company) => company.companyProductID === productID
          );

          if (!feeStructure) {
            console.error(
              "[ERROR] Fee structure not found for productID:",
              productID
            );
            message.error(`Fee structure not found for product: ${productID}`);
            continue;
          }

          const feeType = feeStructure.feeType || "Subscription";
          const licenseType =
            LicenseType[feeStructure.licenseType] ||
            LicenseType.TimeLimitedLicenses;
          const period = 12;
          const expiryDate = dayjs("2025-07-14T15:39:00+03:00")
            .add(period, "month")
            .toDate();

          let noOfUser = NoOfUsersOrDevices.Unlimited;
          let noOfDevice = NoOfUsersOrDevices.Unlimited;

          if (licenseType === LicenseType.DeviceLimitedLicenses) {
            noOfDevice = NoOfUsersOrDevices.ZeroToTen;
          } else if (licenseType === LicenseType.FloatingLicenses) {
            noOfUser = NoOfUsersOrDevices.ZeroToTen;
          }

          const licenseData = {
            companyProductID: feeStructure.companyProductID,
            expiryDate: expiryDate.toISOString(),
            noOfDevice,
            noOfUser,
            licenseType,
            publicKey: "default-public-key",
          };

          if (feeType === "Subscription") {
            console.log(
              "[DEBUG] Generating new license for subscription:",
              licenseData
            );
            const actionResult = await dispatch(
              generateLicense(licenseData)
            ).unwrap();
            if (onLicenseGenerated) {
              onLicenseGenerated();
            }
          } else if (feeType === "Renewal") {
            console.log("[DEBUG] Updating license for renewal:", licenseData);
            console.warn(
              "[DEBUG] updateLicense action not implemented, skipping license update"
            );
          }

          console.log("[DEBUG] Checking license expiry");
          await dispatch(checkExpiry()).unwrap();
        }

        message.success("Payment and license(s) processed successfully");
      } else {
        console.log("[DEBUG] Partial payment, no license generated");
        message.success(
          "Partial payment saved and fee structure updated successfully"
        );
      }

      // Close the modal after successful processing
      onCancel();
    } catch (error) {
      console.error("[ERROR] Error processing payment or license:", error);
      message.error("Failed to process payment or update fee structure");
    }
  };

  return (
    <Modal
      title={
        initialValues
          ? isStatusOnlyUpdate
            ? "Update Payment Status"
            : "Add Payment"
          : "Add Payment"
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={isStatusOnlyUpdate ? 400 : 800}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          companyFeeStructureID: "",
          companyName: "",
          productIDs: [],
          unpaidAmount: 0,
          unapprovedAmount: 0,
          paidAmount: 0,
          reference: "",
          paymentDate: null,
          expiryDate: null,
          status: PaymentStatus.Prepared,
        }}
      >
        {isStatusOnlyUpdate ? (
          <>
            <Form.Item name="companyName" label="Company Name">
              <Input value={initialValues?.companyName} disabled />
            </Form.Item>
            <Form.Item name="productIDs" label="Products">
              <Input value={initialValues?.productIDs?.join(", ")} disabled />
            </Form.Item>
            <Form.Item name="unpaidAmount" label="Unpaid Amount">
              <InputNumber
                value={initialValues?.unpaidAmount}
                disabled
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="unapprovedAmount" label="Unapproved Amount">
              <InputNumber
                value={initialValues?.unapprovedAmount}
                disabled
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="paidAmount" label="Paid Amount">
              <InputNumber
                value={initialValues?.paidAmount}
                disabled
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item name="reference" label="Reference">
              <Input value={initialValues?.reference} disabled />
            </Form.Item>
            <Form.Item name="paymentDate" label="Payment Date">
              <DatePicker
                value={
                  initialValues?.paymentDate
                    ? dayjs(initialValues.paymentDate)
                    : null
                }
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabled
              />
            </Form.Item>
            <Form.Item name="expiryDate" label="Expiry Date">
              <DatePicker
                value={
                  initialValues?.expiryDate
                    ? dayjs(initialValues.expiryDate)
                    : null
                }
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                disabled
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value={PaymentStatus.Prepared}>Prepared</Option>
                <Option value={PaymentStatus.Approved}>Approved</Option>
                <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
              </Select>
            </Form.Item>
            <Form.Item name="narration" label="Narration">
              <TextArea value={initialValues?.narration} disabled rows={3} />
            </Form.Item>
          </>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="companyFeeStructureID"
              label="Company Name"
              rules={[{ required: true, message: "Please select a company" }]}
            >
              <Select
                placeholder={
                  loading ||
                  feeStatus === "loading" ||
                  paymentStatus === "loading"
                    ? "Loading companies..."
                    : filteredCompanies.length > 0
                    ? "Select company"
                    : "No companies with unpaid amount"
                }
                onChange={handleCompanyChange}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                disabled={
                  loading ||
                  feeStatus === "loading" ||
                  paymentStatus === "loading" ||
                  filteredCompanies.length === 0
                }
                loading={
                  loading ||
                  feeStatus === "loading" ||
                  paymentStatus === "loading"
                }
                notFoundContent="No companies available"
              >
                {filteredCompanies.map((company) => (
                  <Option
                    key={company.companyFeeStructureID}
                    value={company.companyFeeStructureID}
                  >
                    {company.companyName} (Unpaid: ${company.unpaidAmount})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="companyName" label="Company Name" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="productIDs"
              label="Products"
              rules={[
                {
                  required: true,
                  message: "Please select at least one product",
                },
              ]}
            >
              <Checkbox.Group
                options={filteredProducts.map((product) => ({
                  label: product.productName,
                  value: product.productID,
                }))}
                disabled={!selectedCompany || filteredProducts.length === 0}
              />
            </Form.Item>

            <Form.Item
              name="unpaidAmount"
              label="Unpaid Amount"
              rules={[{ required: true, message: "Unpaid amount is required" }]}
            >
              <InputNumber
                placeholder="Unpaid amount (auto-filled)"
                disabled
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="unapprovedAmount"
              label="Unapproved Amount"
              rules={[{ required: true, message: "Unpaid amount is required" }]}
            >
              <InputNumber
                placeholder="Unapproved amount (auto-filled)"
                disabled
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="paidAmount"
              label="Paid Amount"
              rules={[
                { required: true, message: "Please enter paid amount" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const unpaidAmount = getFieldValue("unpaidAmount") || 0;
                    if (!value || value <= unpaidAmount) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Paid amount cannot be greater than unpaid amount"
                      )
                    );
                  },
                }),
              ]}
            >
              <InputNumber
                placeholder="Enter paid amount"
                style={{ width: "100%" }}
                max={maxPaidAmount}
                min={0}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="reference"
              label="Reference"
              rules={[{ required: true, message: "Please enter reference" }]}
            >
              <Input placeholder="Enter reference number" />
            </Form.Item>

            <Form.Item
              name="paymentDate"
              label="Payment Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[
                { required: true, message: "Please select an expiry date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status" disabled>
                <Option value={PaymentStatus.Prepared}>Prepared</Option>
                <Option value={PaymentStatus.Approved}>Approved</Option>
                <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
              </Select>
            </Form.Item>
          </div>
        )}

        {!isStatusOnlyUpdate && (
          <>
            <Form.Item
              name="paymentDocument"
              label="Upload Document"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item name="narration" label="Narration">
              <TextArea placeholder="Enter narration" rows={3} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {initialValues
                ? isStatusOnlyUpdate
                  ? "Update Status"
                  : "Save"
                : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

PaymentInformationForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    paymentId: PropTypes.string,
    companyFeeStructureID: PropTypes.string,
    companyName: PropTypes.string,
    productIDs: PropTypes.arrayOf(PropTypes.string),
    unpaidAmount: PropTypes.number,
    unapprovedAmount: PropTypes.number,
    paidAmount: PropTypes.number,
    reference: PropTypes.string,
    paymentDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    expiryDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    status: PropTypes.number,
    paymentDocument: PropTypes.string,
    narration: PropTypes.string,
    isStatusOnlyUpdate: PropTypes.bool,
  }),
  isStatusOnlyUpdate: PropTypes.bool,
  onLicenseGenerated: PropTypes.func,
};

export default PaymentInformationForm;
