import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../slices/productSlice";
import ProductForm from "../components/ProductForm";
import { Table, Button, Alert, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const ProductPage = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    status = "idle",
    error = null,
  } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    // Filter products based on search text
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        product.productDescription
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchText]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedProduct(record);
    setIsFormOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deleteProduct(record.productID));
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Description",
      dataIndex: "productDescription",
      key: "productDescription",
      sorter: (a, b) =>
        a.productDescription.localeCompare(b.productDescription),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => a.state.localeCompare(b.state),
      sortDirections: ["ascend", "descend"],
    },
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
          Manage Products
        </h1>
        <div className="flex space-x-4">
          <Search
            placeholder="Search products..."
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
            enterButton={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="!bg-blue-600 hover:!bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            Add Product
          </Button>
        </div>
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
          dataSource={filteredProducts}
          rowKey="productID"
          loading={status === "loading"}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
        />
      </div>

      {/* Modal */}
      <ProductForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductPage;
