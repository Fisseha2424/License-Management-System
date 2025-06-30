import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../slices/productSlice";
import ProductForm from "../components/ProductForm";
import { Button, Alert } from "antd";

const ProductPage = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    status = "idle",
    error = null,
  } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Manage Products</h2>
          <Button
            type="primary"
            onClick={handleAdd}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Product
          </Button>
        </div>
        {status === "loading" ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <Alert
                message={`Error: ${error}`}
                type="error"
                className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-md"
              />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productID}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Description:</span>{" "}
                      {product.productDescription}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="font-medium">State:</span>{" "}
                      {product.state}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="primary"
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(product)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No products found.</p>
              )}
            </div>
          </>
        )}
        <ProductForm
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default ProductPage;
