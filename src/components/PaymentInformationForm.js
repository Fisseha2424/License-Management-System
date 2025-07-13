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
//   message,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import PropTypes from "prop-types";
// import dayjs from "dayjs";
// import { getCompanyFeeStructures } from "../slices/companyFeeSlice";
// import {
//   getPayments,
//   approvePayment,
//   rejectPayment,
// } from "../slices/paymentSlice";

// const { TextArea } = Input;
// const { Option } = Select;

// const PaymentStatus = {
//   Pending: 1,
//   Partial: 2,
//   Completed: 3,
//   Overdue: 4,
//   Cancelled: 5,
//   Rejected: 6,
// };

// const PaymentInformationForm = ({
//   visible,
//   onCancel,
//   onSubmit,
//   initialValues,
//   isStatusOnlyUpdate,
// }) => {
//   const [form] = Form.useForm();
//   const [paymentInformation, setPaymentInformation] = useState([]);
//   const [filteredCompanies, setFilteredCompanies] = useState([]);
//   const [maxPaidAmount, setMaxPaidAmount] = useState(0);
//   const [loading, setLoading] = useState(false);

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

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         console.log(
//           "[DEBUG] Starting to fetch company fee structures and payments..."
//         );

//         const [feeStructuresResult, paymentsResult] = await Promise.all([
//           dispatch(getCompanyFeeStructures()).unwrap(),
//           dispatch(getPayments()).unwrap(),
//         ]);

//         console.log(
//           "[DEBUG] Raw company fee structures from Redux:",
//           feeStructuresResult
//         );
//         console.log("[DEBUG] Raw payments from Redux:", paymentsResult);

//         if (!Array.isArray(paymentsResult)) {
//           console.error(
//             "[ERROR] Payments response is not an array:",
//             paymentsResult
//           );
//           setPaymentInformation([]);
//         } else {
//           setPaymentInformation(paymentsResult);
//         }

//         const companiesWithPayments = (feeStructuresResult || []).filter(
//           (company) => {
//             const hasUnpaid = company.unpaidAmount > 0;
//             const hasPaid = company.paidAmount > 0;
//             console.log(
//               `[DEBUG] Company ${company.companyName} - unpaid: ${
//                 company.unpaidAmount
//               }, paid: ${company.paidAmount}, included: ${hasUnpaid && hasPaid}`
//             );
//             return hasUnpaid && hasPaid;
//           }
//         );

//         console.log("[DEBUG] Filtered companies:", companiesWithPayments);
//         setFilteredCompanies(companiesWithPayments);

//         if (companiesWithPayments.length === 0) {
//           console.warn(
//             "[WARNING] No companies found with both unpaid and paid amount > 0"
//           );
//         }
//       } catch (error) {
//         console.error("[ERROR] Error fetching data:", error);
//         setFilteredCompanies([]);
//         setPaymentInformation([]);
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
//         productName: initialValues.productName || "",
//         unpaidAmount: initialValues.unpaidAmount || 0,
//         unapprovedAmount: initialValues.unapprovedAmount || 0,
//         paidAmount: initialValues.paidAmount || 0,
//         reference: initialValues.reference || "",
//         paymentDate,
//         expiryDate,
//         status: initialValues.status || PaymentStatus.Pending,
//         paymentDocument: initialValues.paymentDocument
//           ? [{ url: initialValues.paymentDocument }]
//           : [],
//         narration: initialValues.narration || "",
//       });
//     } else {
//       console.log("[DEBUG] Resetting form fields");
//       form.resetFields();
//     }
//   }, [visible, initialValues, form]);

//   const handleCompanyChange = (companyFeeStructureID) => {
//     console.log("[DEBUG] Company selected:", companyFeeStructureID);
//     const selectedCompanyData = filteredCompanies.find(
//       (company) => company.companyFeeStructureID === companyFeeStructureID
//     );

//     if (selectedCompanyData) {
//       console.log("[DEBUG] Selected company data:", selectedCompanyData);
//       setMaxPaidAmount(selectedCompanyData.unpaidAmount);

//       form.setFieldsValue({
//         companyName: selectedCompanyData.companyName,
//         productName: selectedCompanyData.productName,
//         unpaidAmount: selectedCompanyData.unpaidAmount,
//         paidAmount: 0,
//       });

//       const matchingPayment = paymentInformation.find(
//         (payment) => payment.companyFeeStructureID === companyFeeStructureID
//       );

//       if (matchingPayment) {
//         console.log("[DEBUG] Found matching payment:", matchingPayment);
//         if (matchingPayment.status === PaymentStatus.Pending) {
//           console.log(
//             "[DEBUG] Setting unapproved amount to:",
//             matchingPayment.feeAmount
//           );
//           form.setFieldsValue({
//             unapprovedAmount: matchingPayment.feeAmount,
//           });
//         } else {
//           console.log(
//             "[DEBUG] Payment status is not pending, setting unapproved to 0"
//           );
//           form.setFieldsValue({
//             unapprovedAmount: 0,
//           });
//         }
//       } else {
//         console.log(
//           "[DEBUG] No matching payment found, setting unapproved to 0"
//         );
//         form.setFieldsValue({
//           unapprovedAmount: 0,
//         });
//       }
//     } else {
//       console.log("[DEBUG] No company data found for selected ID");
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
//           if (newStatus === PaymentStatus.Completed) {
//             console.log(
//               "[DEBUG] Dispatching approvePayment for paymentId:",
//               initialValues.paymentId
//             );
//             await dispatch(approvePayment(initialValues.paymentId)).unwrap();
//             message.success("Payment approved successfully");
//             onSubmit({ ...values, paymentId: initialValues.paymentId });
//             return;
//           } else if (
//             newStatus === PaymentStatus.Rejected ||
//             newStatus === PaymentStatus.Cancelled
//           ) {
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

//     if (values.paymentDocument?.[0]?.originFileObj) {
//       console.log("[DEBUG] Processing file upload");
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const base64String = event.target.result.split(",")[1];
//         paymentDocument = base64String;
//         console.log("[DEBUG] File converted to base64");

//         const submissionData = {
//           companyFeeStructureID: values.companyFeeStructureID,
//           companyName: values.companyName,
//           productName: values.productName,
//           unpaidAmount: values.unpaidAmount,
//           unapprovedAmount: values.unapprovedAmount,
//           paidAmount: values.paidAmount,
//           reference: values.reference,
//           paymentDate: paymentDate,
//           expiryDate: expiryDate,
//           status: values.status,
//           paymentDocument: paymentDocument,
//           narration: values.narration,
//           paymentId: initialValues?.paymentId || null,
//         };

//         console.log("[DEBUG] Submitting data:", submissionData);
//         onSubmit(submissionData);
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
//       paymentDocument = initialValues?.paymentDocument || null;

//       const submissionData = {
//         companyFeeStructureID: values.companyFeeStructureID,
//         companyName: values.companyName,
//         productName: values.productName,
//         unpaidAmount: values.unpaidAmount,
//         unapprovedAmount: values.unapprovedAmount,
//         paidAmount: values.paidAmount,
//         reference: values.reference,
//         paymentDate: paymentDate,
//         expiryDate: expiryDate,
//         status: values.status,
//         paymentDocument: paymentDocument,
//         narration: values.narration,
//         paymentId: initialValues?.paymentId || null,
//       };

//       console.log("[DEBUG] Submitting data:", submissionData);
//       onSubmit(submissionData);
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
//           productName: "",
//           unpaidAmount: 0,
//           unapprovedAmount: 0,
//           paidAmount: 0,
//           reference: "",
//           paymentDate: null,
//           expiryDate: null,
//           status: PaymentStatus.Pending,
//         }}
//       >
//         {isStatusOnlyUpdate ? (
//           <>
//             <Form.Item name="companyName" label="Company Name">
//               <Input value={initialValues?.companyName} disabled />
//             </Form.Item>
//             <Form.Item name="productName" label="Product Name">
//               <Input value={initialValues?.productName} disabled />
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
//                 <Option value={PaymentStatus.Pending}>Pending</Option>
//                 <Option value={PaymentStatus.Partial}>Partial</Option>
//                 <Option value={PaymentStatus.Completed}>Completed</Option>
//                 <Option value={PaymentStatus.Overdue}>Overdue</Option>
//                 <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
//                 <Option value={PaymentStatus.Rejected}>Rejected</Option>
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
//                     : "No companies with unpaid and paid amount"
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
//                     {company.companyName} (Unpaid: ${company.unpaidAmount},
//                     Paid: ${company.paidAmount})
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item name="companyName" label="Company Name" hidden>
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="productName"
//               label="Product Name"
//               rules={[{ required: true, message: "Product name is required" }]}
//             >
//               <Input placeholder="Product name (auto-filled)" disabled />
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
//               rules={[
//                 { required: true, message: "Unapproved amount is required" },
//               ]}
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
//               <Select placeholder="Select status">
//                 <Option value={PaymentStatus.Pending}>Pending</Option>
//                 <Option value={PaymentStatus.Partial}>Partial</Option>
//                 <Option value={PaymentStatus.Completed}>Completed</Option>
//                 <Option value={PaymentStatus.Overdue}>Overdue</Option>
//                 <Option value={PaymentStatus.Cancelled}>Cancelled</Option>
//                 <Option value={PaymentStatus.Rejected}>Rejected</Option>
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
//     productName: PropTypes.string,
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
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { getCompanyFeeStructures } from "../slices/companyFeeSlice";
import {
  getPayments,
  approvePayment,
  rejectPayment,
} from "../slices/paymentSlice";

const { TextArea } = Input;
const { Option } = Select;

const PaymentStatus = {
  Prepared: 1,
  Approved: 2,
  Cancelled: 3,
};

const PaymentInformationForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  isStatusOnlyUpdate,
}) => {
  const [form] = Form.useForm();
  const [paymentInformation, setPaymentInformation] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [maxPaidAmount, setMaxPaidAmount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log(
          "[DEBUG] Starting to fetch company fee structures and payments..."
        );

        const [feeStructuresResult, paymentsResult] = await Promise.all([
          dispatch(getCompanyFeeStructures()).unwrap(),
          dispatch(getPayments()).unwrap(),
        ]);

        console.log(
          "[DEBUG] Raw company fee structures from Redux:",
          feeStructuresResult
        );
        console.log("[DEBUG] Raw payments from Redux:", paymentsResult);

        if (!Array.isArray(paymentsResult)) {
          console.error(
            "[ERROR] Payments response is not an array:",
            paymentsResult
          );
          setPaymentInformation([]);
        } else {
          setPaymentInformation(paymentsResult);
        }

        const companiesWithPayments = (feeStructuresResult || []).filter(
          (company) => {
            const hasUnpaid = company.unpaidAmount > 0;
            const hasPaid = company.paidAmount > 0;
            console.log(
              `[DEBUG] Company ${company.companyName} - unpaid: ${
                company.unpaidAmount
              }, paid: ${company.paidAmount}, included: ${hasUnpaid && hasPaid}`
            );
            return hasUnpaid && hasPaid;
          }
        );

        console.log("[DEBUG] Filtered companies:", companiesWithPayments);
        setFilteredCompanies(companiesWithPayments);

        if (companiesWithPayments.length === 0) {
          console.warn(
            "[WARNING] No companies found with both unpaid and paid amount > 0"
          );
        }
      } catch (error) {
        console.error("[ERROR] Error fetching data:", error);
        setFilteredCompanies([]);
        setPaymentInformation([]);
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
        productName: initialValues.productName || "",
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
    } else {
      console.log("[DEBUG] Resetting form fields");
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleCompanyChange = (companyFeeStructureID) => {
    console.log("[DEBUG] Company selected:", companyFeeStructureID);
    const selectedCompanyData = filteredCompanies.find(
      (company) => company.companyFeeStructureID === companyFeeStructureID
    );

    if (selectedCompanyData) {
      console.log("[DEBUG] Selected company data:", selectedCompanyData);
      setMaxPaidAmount(selectedCompanyData.unpaidAmount);

      form.setFieldsValue({
        companyName: selectedCompanyData.companyName,
        productName: selectedCompanyData.productName,
        unpaidAmount: selectedCompanyData.unpaidAmount,
        paidAmount: 0,
      });

      const matchingPayment = paymentInformation.find(
        (payment) => payment.companyFeeStructureID === companyFeeStructureID
      );

      if (matchingPayment) {
        console.log("[DEBUG] Found matching payment:", matchingPayment);
        if (matchingPayment.status === PaymentStatus.Prepared) {
          console.log(
            "[DEBUG] Setting unapproved amount to:",
            matchingPayment.feeAmount
          );
          form.setFieldsValue({
            unapprovedAmount: matchingPayment.feeAmount,
          });
        } else {
          console.log(
            "[DEBUG] Payment status is not prepared, setting unapproved to 0"
          );
          form.setFieldsValue({
            unapprovedAmount: 0,
          });
        }
      } else {
        console.log(
          "[DEBUG] No matching payment found, setting unapproved to 0"
        );
        form.setFieldsValue({
          unapprovedAmount: 0,
        });
      }
    } else {
      console.log("[DEBUG] No company data found for selected ID");
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
            return;
          } else if (newStatus === PaymentStatus.Cancelled) {
            console.log(
              "[DEBUG] Dispatching rejectPayment for paymentId:",
              initialValues.paymentId
            );
            await dispatch(rejectPayment(initialValues.paymentId)).unwrap();
            message.success("Payment rejected successfully");
            onSubmit({ ...values, paymentId: initialValues.paymentId });
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

    if (values.paymentDocument?.[0]?.originFileObj) {
      console.log("[DEBUG] Processing file upload");
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        paymentDocument = base64String;
        console.log("[DEBUG] File converted to base64");

        const submissionData = {
          companyFeeStructureID: values.companyFeeStructureID,
          companyName: values.companyName,
          productName: values.productName,
          unpaidAmount: values.unpaidAmount,
          unapprovedAmount: values.unapprovedAmount,
          paidAmount: values.paidAmount,
          reference: values.reference,
          paymentDate: paymentDate,
          expiryDate: expiryDate,
          status: values.status,
          paymentDocument: paymentDocument,
          narration: values.narration,
          paymentId: initialValues?.paymentId || null,
        };

        console.log("[DEBUG] Submitting data:", submissionData);
        onSubmit(submissionData);
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
      paymentDocument = initialValues?.paymentDocument || null;

      const submissionData = {
        companyFeeStructureID: values.companyFeeStructureID,
        companyName: values.companyName,
        productName: values.productName,
        unpaidAmount: values.unpaidAmount,
        unapprovedAmount: values.unapprovedAmount,
        paidAmount: values.paidAmount,
        reference: values.reference,
        paymentDate: paymentDate,
        expiryDate: expiryDate,
        status: values.status,
        paymentDocument: paymentDocument,
        narration: values.narration,
        paymentId: initialValues?.paymentId || null,
      };

      console.log("[DEBUG] Submitting data:", submissionData);
      onSubmit(submissionData);
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
          productName: "",
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
            <Form.Item name="productName" label="Product Name">
              <Input value={initialValues?.productName} disabled />
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
                    : "No companies with unpaid and paid amount"
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
                    {company.companyName} (Unpaid: ${company.unpaidAmount},
                    Paid: ${company.paidAmount})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="companyName" label="Company Name" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="productName"
              label="Product Name"
              rules={[{ required: true, message: "Product name is required" }]}
            >
              <Input placeholder="Product name (auto-filled)" disabled />
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
              rules={[
                { required: true, message: "Unapproved amount is required" },
              ]}
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
              <Select placeholder="Select status">
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
    productName: PropTypes.string,
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
};

export default PaymentInformationForm;
