import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import {
  getSubscriptions,
  deleteSubscription,
} from "../slices/companyProductSubscriptionSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import SubscriptionForm from "../components/SubscriptionForm";
import { Button, Alert } from "antd";

const selectSubscriptionState = createSelector(
  (state) => state.companyProductSubscription || {},
  (subscriptionState) => ({
    subscriptions: subscriptionState.subscriptions || [],
    status: subscriptionState.status || "idle",
    error: subscriptionState.error || null,
  })
);

const CompanyProductSubscriptionPage = () => {
  const dispatch = useDispatch();
  const { subscriptions, status, error } = useSelector(selectSubscriptionState);
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    dispatch(getSubscriptions());
    dispatch(getCompanies());
    dispatch(getProducts());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedSubscription(null);
    setIsFormOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedSubscription(record);
    setIsFormOpen(true);
  };

  const handleDelete = (record) => {
    dispatch(deleteSubscription(record.companyProductID));
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Manage Subscriptions
        </h2>
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
            <div className="mb-6">
              <Button
                type="primary"
                onClick={handleAdd}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Subscription
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(subscriptions) && subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription.companyProductID}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {companies?.find(
                        (c) => c.companyID === subscription.companyID
                      )?.companyName || "Unknown"}{" "}
                      -{" "}
                      {products?.find(
                        (p) => p.productID === subscription.productID
                      )?.productName || "Unknown"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Subscription ID:</span>{" "}
                      {subscription.companyProductID}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Notify Before (Days):</span>{" "}
                      {subscription.notifyBeforeXDays}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">State:</span>{" "}
                      {subscription.state}
                    </p>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Created Date:</span>{" "}
                      {new Date(subscription.createdDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="font-medium">Updated Date:</span>{" "}
                      {new Date(subscription.updatedDate).toLocaleDateString()}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="primary"
                        onClick={() => handleEdit(subscription)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(subscription)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">
                  No subscriptions found.
                </p>
              )}
            </div>
            <SubscriptionForm
              open={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              subscription={selectedSubscription}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProductSubscriptionPage;
