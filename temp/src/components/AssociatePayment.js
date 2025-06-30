// import React, { useState, useEffect } from 'react';
// import { Table, Input, Button, Space, Select, message } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { SearchOutlined } from '@ant-design/icons';
// import { getCompanies, getPayments, initiatePayment } from '../slices/licenseSlice';

// const { Option } = Select;

// const AssociatePayment = () => {
//   const dispatch = useDispatch();
//   const { companies, payments, status } = useSelector((state) => state.license);
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [searchText, setSearchText] = useState('');
//   const [searchedColumn, setSearchedColumn] = useState('');
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   // useEffect(() => {
//   //   dispatch(getCompanies());
//   //   dispatch(getPayments());
//   // }, [dispatch]);
//   useEffect(() => {
//   dispatch(getCompanies());
//   if (selectedCompany) {
//     dispatch(getPayments(selectedCompany));
//   }
// }, [dispatch, selectedCompany]);

//   useEffect(() => {
//     setPagination((prev) => ({ ...prev, total: payments.length }));
//   }, [payments]);

//   const handleTableChange = (pagination) => {
//     setPagination(pagination);
//   };

//   const getColumnSearchProps = (dataIndex, title) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//       <div style={{ padding: 8 }}>
//         <Input
//           placeholder={`Search ${title}`}
//           value={selectedKeys[0]}
//           onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{ width: 188, marginBottom: 8, display: 'block' }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => handleReset(clearFilters)}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Reset
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex]
//         ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
//         : '',
//   });

//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText('');
//   };

//   const handleInitiatePayment = async (payment) => {
//     if (!selectedCompany) {
//       message.error('Please select a company');
//       return;
//     }
//     try {
//       await dispatch(initiatePayment({
//         PaymentID: payment.PaymentID,
//         CompanyID: selectedCompany,
//         Amount: payment.Amount,
//         Date: new Date().toISOString(),
//         Status: 'Pending',
//       })).unwrap();
//       message.success('Payment initiated via Telebirr');
//     } catch (err) {
//       message.error('Failed to initiate payment');
//     }
//   };

//   const columns = [
//     {
//       title: 'Payment ID',
//       dataIndex: 'PaymentID',
//       key: 'PaymentID',
//       ...getColumnSearchProps('PaymentID', 'Payment ID'),
//     },
//     {
//       title: 'Company Name',
//       dataIndex: 'CompanyID',
//       key: 'CompanyID',
//       render: (companyID) => {
//         const company = companies.find((c) => c.CompanyID === companyID);
//         return company ? company.CompanyName : companyID;
//       },
//       ...getColumnSearchProps('CompanyID', 'Company Name'),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'Amount',
//       key: 'Amount',
//       render: (amount) => `$${amount.toFixed(2)}`,
//     },
//     {
//       title: 'Date',
//       dataIndex: 'Date',
//       key: 'Date',
//       render: (date) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: 'Status',
//       dataIndex: 'Status',
//       key: 'Status',
//       render: (status) => (
//         <span
//           style={{
//             color: status === 'Pending' || status === 'Initiated' ? '#ff4d4f' : '#52c41a',
//             fontWeight: 'bold',
//           }}
//         >
//           {status}
//         </span>
//       ),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_, record) => (
//         <Button
//           type="primary"
//           onClick={() => handleInitiatePayment(record)}
//           disabled={record.Status !== 'Pending'}
//         >
//           Initiate Payment
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="container p-6">
//       <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
//       <Space style={{ marginBottom: 16 }}>
//         <Select
//           placeholder="Select Company"
//           style={{ width: 200 }}
//           onChange={(value) => setSelectedCompany(value)}
//           value={selectedCompany}
//         >
//           {companies.map((company) => (
//             <Option key={company.CompanyID} value={company.CompanyID}>
//               {company.CompanyName}
//             </Option>
//           ))}
//         </Select>
//       </Space>
//       <Table
//         columns={columns}
//         dataSource={payments}
//         loading={status === 'loading'}
//         pagination={pagination}
//         onChange={handleTableChange}
//         rowKey="PaymentID"
//         scroll={{ x: 'max-content' }}
//       />
//     </div>
//   );
// };

// export default AssociatePayment;

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Space, Select, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
// import { getCompanies, getPayments, initiatePayment } from '../slices/paymentSlice';

const { Option } = Select;

const AssociatePayment = () => {
  const dispatch = useDispatch();
  const { companies, payments, status } = useSelector((state) => state.payment);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // useEffect(() => {
  //   dispatch(getCompanies());
  //   if (selectedCompany) {
  //     dispatch(getPayments(selectedCompany));
  //   }
  // }, [dispatch, selectedCompany]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, total: payments.length }));
  }, [payments]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${title}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const handleInitiatePayment = async (payment) => {
    if (!selectedCompany) {
      message.error('Please select a company');
      return;
    }
    try {
      await dispatch(initiatePayment({
        PaymentID: payment.PaymentID,
        CompanyID: selectedCompany,
        Amount: payment.Amount,
        Date: new Date().toISOString(),
        Status: 'Pending',
      })).unwrap();
      message.success('Payment initiated via Telebirr');
    } catch (err) {
      message.error('Failed to initiate payment');
    }
  };

  const columns = [
    {
      title: 'Payment ID',
      dataIndex: 'PaymentID',
      key: 'PaymentID',
      ...getColumnSearchProps('PaymentID', 'Payment ID'),
    },
    {
      title: 'Company Name',
      dataIndex: 'CompanyID',
      key: 'CompanyID',
      render: (companyID) => {
        const company = companies.find((c) => c.companyID === companyID); // Adjusted to companyID
        return company ? company.companyName : companyID; // Adjusted to companyName
      },
      ...getColumnSearchProps('CompanyID', 'Company Name'),
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'Date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => (
        <span
          style={{
            color: status === 'Pending' || status === 'Initiated' ? '#ff4d4f' : '#52c41a',
            fontWeight: 'bold',
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleInitiatePayment(record)}
          disabled={record.Status !== 'Pending'}
        >
          Initiate Payment
        </Button>
      ),
    },
  ];

  return (
    <div className="container p-6">
      <h2 className="text-2xl font-bold mb-4">Payment Management</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Company"
          style={{ width: 200 }}
          onChange={(value) => setSelectedCompany(value)}
          value={selectedCompany}
        >
          {companies.map((company) => (
            <Option key={company.companyID} value={company.companyID}> {/* Adjusted to companyID */}
              {company.companyName} {/* Adjusted to companyName */}
            </Option>
          ))}
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={payments}
        loading={status === 'loading'}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="PaymentID"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default AssociatePayment;