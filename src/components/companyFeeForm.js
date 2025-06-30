// "use client";

// import { useState, useEffect } from "react";
// import {
//   Modal,
//   Form,
//   Button,
//   Input,
//   InputNumber,
//   message,
//   Row,
//   Col,
//   Space,
//   Select,
// } from "antd";
// import { useDispatch, useSelector } from "react-redux"; // Added useSelector
// import {
//   createCompanyFeeStructure,
//   updateCompanyFeeStructure,
// } from "../slices/companyFeeSlice";
// import { getSubscriptions } from "../slices/companyProductSubscriptionSlice"; // Added import

// const { Option } = Select;

// const CompanyFeeForm = ({ feeStructure, open, onClose }) => {
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const subscriptions = useSelector(
//     (state) => state.subscription?.subscriptions || []
//   ); // Access from Redux store

//   // Fetch subscriptions using Redux action
//   useEffect(() => {
//     if (open) {
//       dispatch(getSubscriptions());
//     }
//   }, [open, dispatch]);

//   useEffect(() => {
//     if (open) {
//       if (feeStructure) {
//         form.setFieldsValue({
//           companyProductID: feeStructure.companyProductID,
//           feeID: feeStructure.feeID,
//           paidAmount: feeStructure.paidAmount,
//           unpaidAmount: feeStructure.unpaidAmount,
//           payableAmount: feeStructure.payableAmount,
//         });
//       } else {
//         form.resetFields();
//       }
//     }
//   }, [feeStructure, form, open]);

//   const onFinish = async (values) => {
//     try {
//       setLoading(true);
//       const feeData = {
//         companyProductID: values.companyProductID,
//         feeID: values.feeID,
//         paidAmount: values.paidAmount,
//         unpaidAmount: values.unpaidAmount,
//         payableAmount: values.payableAmount,
//       };

//       if (feeStructure) {
//         await dispatch(
//           updateCompanyFeeStructure({
//             id: feeStructure.feeID,
//             data: feeData,
//           })
//         ).unwrap();
//         message.success("Company fee structure updated successfully");
//       } else {
//         await dispatch(createCompanyFeeStructure(feeData)).unwrap();
//         message.success("Company fee structure created successfully");
//       }

//       handleClose();
//     } catch (err) {
//       message.error("Failed to save company fee structure");
//       console.error("Error saving company fee structure:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     form.resetFields();
//     onClose();
//   };

//   return (
//     <Modal
//       title={
//         feeStructure
//           ? "Edit Company Fee Structure"
//           : "Add Company Fee Structure"
//       }
//       open={open}
//       onCancel={handleClose}
//       footer={null}
//       width={800}
//       destroyOnClose
//     >
//       <Form
//         form={form}
//         onFinish={onFinish}
//         layout="vertical"
//         initialValues={{
//           paidAmount: 0,
//           unpaidAmount: 0,
//           payableAmount: 0,
//         }}
//       >
//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="companyProductID"
//               label="Company Product ID"
//               rules={[
//                 { required: true, message: "Please select a subscription" },
//               ]}
//             >
//               <Select
//                 placeholder="Select a subscription"
//                 loading={!subscriptions.length}
//               >
//                 {subscriptions.map((sub) => (
//                   <Option key={sub.id} value={sub.id}>
//                     {sub.name || sub.id}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="feeID"
//               label="Fee ID"
//               rules={[{ required: true, message: "Please enter fee ID" }]}
//             >
//               <Input placeholder="Enter fee ID" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="paidAmount"
//               label="Paid Amount ($)"
//               rules={[
//                 { required: true, message: "Please enter paid amount" },
//                 {
//                   type: "number",
//                   min: 0,
//                   message: "Paid amount must be positive",
//                 },
//               ]}
//             >
//               <InputNumber
//                 min={0}
//                 step={0.01}
//                 placeholder="Enter paid amount"
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item
//               name="unpaidAmount"
//               label="Unpaid Amount ($)"
//               rules={[
//                 { required: true, message: "Please enter unpaid amount" },
//                 {
//                   type: "number",
//                   min: 0,
//                   message: "Unpaid amount must be positive",
//                 },
//               ]}
//             >
//               <InputNumber
//                 min={0}
//                 step={0.01}
//                 placeholder="Enter unpaid amount"
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item
//               name="payableAmount"
//               label="Payable Amount ($)"
//               rules={[
//                 { required: true, message: "Please enter payable amount" },
//                 {
//                   type: "number",
//                   min: 0,
//                   message: "Payable amount must be positive",
//                 },
//               ]}
//             >
//               <InputNumber
//                 min={0}
//                 step={0.01}
//                 placeholder="Enter payable amount"
//                 style={{ width: "100%" }}
//                 formatter={(value) =>
//                   `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                 }
//                 parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item className="mb-0 text-right">
//           <Space>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button type="primary" htmlType="submit" loading={loading}>
//               {feeStructure ? "Update" : "Create"} Company Fee Structure
//             </Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default CompanyFeeForm;

"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Input,
  InputNumber,
  message,
  Row,
  Col,
  Space,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  createCompanyFeeStructure,
  updateCompanyFeeStructure,
} from "../slices/companyFeeSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";

const { Option } = Select;

const CompanyFeeForm = ({ feeStructure, open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const subscriptions = useSelector(
    (state) => state.subscription?.subscriptions || []
  );

  // Log subscriptions for debugging
  useEffect(() => {
    console.log("Subscriptions:", subscriptions);
  }, [subscriptions]);

  // Fetch subscriptions using Redux action
  useEffect(() => {
    if (open) {
      dispatch(getSubscriptions());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      if (feeStructure) {
        form.setFieldsValue({
          companyProductID: feeStructure.companyProductID,
          feeID: feeStructure.feeID,
          paidAmount: feeStructure.paidAmount,
          unpaidAmount: feeStructure.unpaidAmount,
          payableAmount: feeStructure.payableAmount,
        });
      } else {
        form.resetFields();
      }
    }
  }, [feeStructure, form, open]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const feeData = {
        companyProductID: values.companyProductID,
        feeID: values.feeID,
        paidAmount: values.paidAmount,
        unpaidAmount: values.unpaidAmount,
        payableAmount: values.payableAmount,
      };

      if (feeStructure) {
        await dispatch(
          updateCompanyFeeStructure({
            id: feeStructure.feeID,
            data: feeData,
          })
        ).unwrap();
        message.success("Company fee structure updated successfully");
      } else {
        await dispatch(createCompanyFeeStructure(feeData)).unwrap();
        message.success("Company fee structure created successfully");
      }

      handleClose();
    } catch (err) {
      message.error("Failed to save company fee structure");
      console.error("Error saving company fee structure:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        feeStructure
          ? "Edit Company Fee Structure"
          : "Add Company Fee Structure"
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          paidAmount: 0,
          unpaidAmount: 0,
          payableAmount: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyProductID"
              label="Company Product ID"
              rules={[
                { required: true, message: "Please select a subscription" },
              ]}
            >
              <Select
                placeholder="Select a subscription"
                loading={!subscriptions.length}
              >
                {subscriptions.map((sub, index) => (
                  <Option
                    key={sub.id || sub.companyProductID || index} // Fallback to index if id is missing
                    value={sub.id || sub.companyProductID} // Use companyProductID as fallback
                  >
                    {sub.name ||
                      sub.id ||
                      sub.companyProductID ||
                      "Unnamed Subscription"}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="feeID"
              label="Fee ID"
              rules={[{ required: true, message: "Please enter fee ID" }]}
            >
              <Input placeholder="Enter fee ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="paidAmount"
              label="Paid Amount ($)"
              rules={[
                { required: true, message: "Please enter paid amount" },
                {
                  type: "number",
                  min: 0,
                  message: "Paid amount must be positive",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter paid amount"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="unpaidAmount"
              label="Unpaid Amount ($)"
              rules={[
                { required: true, message: "Please enter unpaid amount" },
                {
                  type: "number",
                  min: 0,
                  message: "Unpaid amount must be positive",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter unpaid amount"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="payableAmount"
              label="Payable Amount ($)"
              rules={[
                { required: true, message: "Please enter payable amount" },
                {
                  type: "number",
                  min: 0,
                  message: "Payable amount must be positive",
                },
              ]}
            >
              <InputNumber
                min={0}
                step={0.01}
                placeholder="Enter payable amount"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0 text-right">
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {feeStructure ? "Update" : "Create"} Company Fee Structure
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CompanyFeeForm;
