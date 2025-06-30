import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../slices/companySlice";
import CompanyForm from "../components/CompanyForm";
import { Table, Button, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CompanyPage = () => {
  const dispatch = useDispatch();
  const { companies, status, error } = useSelector(
    (state) => state.company || {}
  );
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState(null);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedCompany(record);
    setIsFormOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deleteCompany(record.companyID));
  };

  const columns = [
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "TIN No", dataIndex: "tinNo", key: "tinNo" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Mobile No", dataIndex: "mobileNo", key: "mobileNo" },
    { title: "Company Type", dataIndex: "companyType", key: "companyType" },
    { title: "State", dataIndex: "state", key: "state" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            className="!bg-blue-600 !text-white !border-none hover:!bg-blue-700 rounded-md px-4 py-1 transition-all duration-300"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            className="rounded-md px-4 py-1 hover:!bg-red-100 transition-all duration-300"
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Manage Companies
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
        >
          Add Company
        </Button>
      </div>

      {/* Alert */}
      {error && (
        <Alert
          message={`Error: ${error}`}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <Table
          columns={columns}
          dataSource={companies}
          rowKey="companyID"
          loading={status === "loading"}
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal */}
      <CompanyForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        company={selectedCompany}
      />
    </div>
  );
};

export default CompanyPage;
