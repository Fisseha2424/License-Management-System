// import React from "react";
// import { Modal, Form, Input, DatePicker, Upload, Button, Select } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { TextArea } = Input;
// const { Option } = Select;

// const PaymentInformationForm = ({
//   visible,
//   onCancel,
//   onSubmit,
//   initialValues,
// }) => {
//   const [form] = Form.useForm();

//   React.useEffect(() => {
//     if (visible && initialValues) {
//       form.setFieldsValue({
//         companyFeeStructureID:
//           initialValues.companyFeeStructureID ||
//           "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//         reference: initialValues.reference || "string",
//         paymentDate: initialValues.paymentDate
//           ? new Date(initialValues.paymentDate)
//           : null,
//         expiryDate: initialValues.expiryDate
//           ? new Date(initialValues.expiryDate)
//           : null,
//         status: initialValues.status || 1,
//         paymentDocument: initialValues.paymentDocument
//           ? [{ url: initialValues.paymentDocument }]
//           : [],
//         remark: initialValues.remark || "string",
//       });
//     } else {
//       form.resetFields();
//     }
//   }, [visible, initialValues, form]);

//   const handleFinish = (values) => {
//     let paymentDocument = null;
//     if (values.paymentDocument?.[0]?.originFileObj) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const base64String = event.target.result.split(",")[1]; // Extract base64 data (remove data URL prefix)
//         paymentDocument = base64String;
//         onSubmit({
//           companyFeeStructureID: values.companyFeeStructureID,
//           reference: values.reference,
//           paymentDate: values.paymentDate.toISOString(),
//           expiryDate: values.expiryDate.toISOString(),
//           status: values.status,
//           paymentDocument: paymentDocument,
//           remark: values.remark,
//         });
//       };
//       reader.onerror = (error) => {
//         console.error("Error converting file to base64:", error);
//       };
//       reader.readAsDataURL(values.paymentDocument[0].originFileObj); // Reads file as data URL
//     } else {
//       paymentDocument = initialValues?.paymentDocument || null;
//       onSubmit({
//         companyFeeStructureID: values.companyFeeStructureID,
//         reference: values.reference,
//         paymentDate: values.paymentDate.toISOString(),
//         expiryDate: values.expiryDate.toISOString(),
//         status: values.status,
//         paymentDocument: paymentDocument,
//         remark: values.remark,
//       });
//     }
//   };

//   return (
//     <Modal
//       title={initialValues ? "Edit Payment" : "Add Payment"}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//     >
//       <Form
//         form={form}
//         onFinish={handleFinish}
//         layout="vertical"
//         initialValues={{
//           companyFeeStructureID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//           reference: "string",
//           paymentDate: null,
//           expiryDate: null,
//           status: 1,
//           paymentDocument: [],
//           remark: "string",
//         }}
//       >
//         <Form.Item
//           name="companyFeeStructureID"
//           label="Fee Structure ID"
//           rules={[{ required: true, message: "Please enter Fee Structure ID" }]}
//         >
//           <Input placeholder="Enter Fee Structure ID" />
//         </Form.Item>
//         <Form.Item
//           name="reference"
//           label="Reference"
//           rules={[{ required: true, message: "Please enter reference" }]}
//         >
//           <Input placeholder="Enter reference number" />
//         </Form.Item>
//         <Form.Item
//           name="paymentDate"
//           label="Payment Date"
//           rules={[{ required: true, message: "Please select a date" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="expiryDate"
//           label="Expiry Date"
//           rules={[{ required: true, message: "Please select an expiry date" }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//         <Form.Item
//           name="paymentDocument"
//           label="Upload Document"
//           valuePropName="fileList"
//           getValueFromEvent={(e) => e.fileList}
//         >
//           <Upload beforeUpload={() => false} maxCount={1}>
//             <Button icon={<UploadOutlined />}>Click to Upload</Button>
//           </Upload>
//         </Form.Item>
//         <Form.Item
//           name="status"
//           label="Status"
//           rules={[{ required: true, message: "Please select status" }]}
//         >
//           <Select placeholder="Select status">
//             <Option value={1}>Pending</Option>
//             <Option value={2}>Approved</Option>
//             <Option value={3}>Rejected</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="remark" label="Remark">
//           <TextArea placeholder="Enter remarks" />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit">
//             {initialValues ? "Update" : "Save"}
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default PaymentInformationForm;

import React from "react";
import { Modal, Form, Input, DatePicker, Upload, Button, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const PaymentInformationForm = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        companyFeeStructureID:
          initialValues.companyFeeStructureID ||
          "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        reference: initialValues.reference || "string",
        paymentDate: initialValues.paymentDate
          ? new Date(initialValues.paymentDate)
          : null,
        expiryDate: initialValues.expiryDate
          ? new Date(initialValues.expiryDate)
          : null,
        status: initialValues.status || 1,
        paymentDocument: initialValues.paymentDocument
          ? [{ url: initialValues.paymentDocument }]
          : [],
        remark: initialValues.remark || "string",
      });
    } else {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values) => {
    let paymentDocument = null;
    if (values.paymentDocument?.[0]?.originFileObj) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        paymentDocument = base64String;
        // Convert moment objects to Date objects
        const paymentDate = values.paymentDate
          ? values.paymentDate.toDate()
          : null;
        const expiryDate = values.expiryDate
          ? values.expiryDate.toDate()
          : null;
        onSubmit({
          companyFeeStructureID: values.companyFeeStructureID,
          reference: values.reference,
          paymentDate: paymentDate,
          expiryDate: expiryDate,
          status: values.status,
          paymentDocument: paymentDocument,
          remark: values.remark,
        });
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
      reader.readAsDataURL(values.paymentDocument[0].originFileObj);
    } else {
      paymentDocument = initialValues?.paymentDocument || null;
      // Convert moment objects to Date objects
      const paymentDate = values.paymentDate
        ? values.paymentDate.toDate()
        : null;
      const expiryDate = values.expiryDate ? values.expiryDate.toDate() : null;
      onSubmit({
        companyFeeStructureID: values.companyFeeStructureID,
        reference: values.reference,
        paymentDate: paymentDate,
        expiryDate: expiryDate,
        status: values.status,
        paymentDocument: paymentDocument,
        remark: values.remark,
      });
    }
  };

  return (
    <Modal
      title={initialValues ? "Edit Payment" : "Add Payment"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          companyFeeStructureID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          reference: "string",
          paymentDate: null,
          expiryDate: null,
          status: 1,
          paymentDocument: [],
          remark: "string",
        }}
      >
        <Form.Item
          name="companyFeeStructureID"
          label="Fee Structure ID"
          rules={[{ required: true, message: "Please enter Fee Structure ID" }]}
        >
          <Input placeholder="Enter Fee Structure ID" />
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
          rules={[{ required: true, message: "Please select an expiry date" }]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
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
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status">
            <Option value={1}>Pending</Option>
            <Option value={2}>Approved</Option>
            <Option value={3}>Rejected</Option>
          </Select>
        </Form.Item>
        <Form.Item name="remark" label="Remark">
          <TextArea placeholder="Enter remarks" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentInformationForm;
