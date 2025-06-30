import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, deleteCompany } from "../slices/companySlice";
import CompanyForm from "../components/CompanyForm";
import { Button } from "antd";

const CompanyPage = () => {
  const dispatch = useDispatch();
  const { companies, status } = useSelector((state) => state.company);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Manage Companies</h2>
          <Button
            type="primary"
            onClick={handleAdd}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Company
          </Button>
        </div>
        {status === "loading" ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(companies) && companies.length > 0 ? (
              companies.map((company) => (
                <div
                  key={company.companyID}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {company.companyName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">TIN No:</span> {company.tinNo}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Email:</span> {company.email}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Mobile No:</span>{" "}
                    {company.mobileNo}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Company Type:</span>{" "}
                    {company.companyType}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    <span className="font-medium">State:</span> {company.state}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="primary"
                      onClick={() => handleEdit(company)}
                      className="bg-blue-500 hover:bg-white-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(company)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No companies found.</p>
            )}
          </div>
        )}
        <CompanyForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          company={selectedCompany}
        />
      </div>
    </div>
  );
};

export default CompanyPage;
