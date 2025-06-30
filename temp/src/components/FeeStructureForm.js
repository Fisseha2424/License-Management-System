import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Select, Input, InputNumber, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createFeeStructure, updateFeeStructure, getCompanies } from '../slices/feeSlice';
import moment from 'moment';

const { Option } = Select;

const FEE_TYPES = [
  { value: 1, label: 'Fixed' },
  { value: 2, label: 'Variable' },
  // Add more fee types as needed
];

const FeeStructureForm = ({ feeStructure, open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company?.companies || []);
  const status = useSelector((state) => state.company?.status || 'idle');
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    dispatch(getCompanies());
    if (feeStructure) {
      setSelectedCompany(feeStructure.companyID);
      form.setFieldsValue({
        companyID: feeStructure.companyID,
        feeType: feeStructure.feeType,
        feeAmount: feeStructure.feeAmount,
        paymentStartDate: feeStructure.paymentStartDate ? moment(feeStructure.paymentStartDate) : null,
        paymentEndDate: feeStructure.paymentEndDate ? moment(feeStructure.paymentEndDate) : null,
        category: feeStructure.category,
        discountPercentage: feeStructure.discountPercentage,
      });
    } else {
      form.resetFields();
      setSelectedCompany(null);
    }
  }, [feeStructure, form, dispatch]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const feeData = {
        companyID: values.companyID,
        feeType: values.feeType,
        feeAmount: values.feeAmount,
        paymentStartDate: values.paymentStartDate ? values.paymentStartDate.toISOString() : null,
        paymentEndDate: values.paymentEndDate ? values.paymentEndDate.toISOString() : null,
        category: values.category,
        discountPercentage: values.discountPercentage,
      };
      if (feeStructure) {
        await dispatch(updateFeeStructure({ id: feeStructure.FeeStructureID, data: feeData })).unwrap();
        message.success('Fee structure updated successfully');
      } else {
        await dispatch(createFeeStructure(feeData)).unwrap();
        message.success('Fee structure created successfully');
      }
      form.resetFields();
      setSelectedCompany(null);
      onClose();
    } catch (err) {
      message.error('Failed to save fee structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={feeStructure ? 'Edit Fee Structure' : 'Add Fee Structure'}
      open={open}
      onCancel={() => {
        form.resetFields();
        setSelectedCompany(null);
        onClose();
      }}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="companyID"
          label="Company"
          rules={[{ required: true, message: 'Please select a company' }]}
        >
          <Select
            placeholder="Select company"
            onChange={(value) => setSelectedCompany(value)}
            value={selectedCompany}
            loading={status === 'loading'}
          >
            {companies.map((company) => (
              <Option key={company.companyID} value={company.companyID}>
                {company.companyName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="feeType"
          label="Fee Type"
          rules={[{ required: true, message: 'Please select fee type' }]}
        >
          <Select placeholder="Select fee type">
            {FEE_TYPES.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="feeAmount"
          label="Fee Amount ($)"
          rules={[{ required: true, message: 'Please enter fee amount' }]}
        >
          <InputNumber
            min={0}
            placeholder="Enter amount"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          name="paymentStartDate"
          label="Payment Start Date"
          rules={[{ required: true, message: 'Please select start date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
          />
        </Form.Item>
        <Form.Item
          name="paymentEndDate"
          label="Payment End Date"
          rules={[{ required: true, message: 'Please select end date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm:ss"
            showTime
          />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please enter category' }]}
        >
          <Input placeholder="Enter category" />
        </Form.Item>
        <Form.Item
          name="discountPercentage"
          label="Discount Percentage (%)"
          rules={[{ required: true, message: 'Please enter discount percentage' }]}
        >
          <InputNumber
            min={0}
            max={100}
            placeholder="Enter percentage"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                form.resetFields();
                setSelectedCompany(null);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeeStructureForm;