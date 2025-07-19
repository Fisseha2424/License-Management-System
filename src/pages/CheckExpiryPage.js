import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkExpiry, getLicenses } from "../slices/licenseSlice";
import { getCompanies } from "../slices/companySlice";
import { getProducts } from "../slices/productSlice";
import {
  getFeeStructuresByFeeType,
  getFeeStructureById,
} from "../slices/feeSlice";
import {
  getFeeStructuresByCompanyProductId,
  updateCompanyFeeStructure,
} from "../slices/companyFeeSlice";
import { getSubscriptions } from "../slices/companyProductSubscriptionSlice";
import { Table, Alert, Button, Space, Collapse } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Panel } = Collapse;

const CheckExpiryPage = () => {
  const dispatch = useDispatch();
  const [expandedRows, setExpandedRows] = useState({});
  const [companyFeeData, setCompanyFeeData] = useState({});
  const [feeStructureDetails, setFeeStructureDetails] = useState({});
  const [processedPayments, setProcessedPayments] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem("processedPayments");
    return saved ? JSON.parse(saved) : {};
  });
  const [isDataFetched, setIsDataFetched] = useState(false);

  const { licenses, status, error } = useSelector(
    (state) => state.license || {}
  );
  const { companies } = useSelector((state) => state.company || {});
  const { products } = useSelector((state) => state.product || {});
  const { subscriptions = [] } = useSelector(
    (state) => state.subscription || {}
  );
  const { feeStructures } = useSelector((state) => state.fee || {});

  const memoizedSubscriptions = useMemo(() => subscriptions, [subscriptions]);

  // Persist processedPayments to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "processedPayments",
      JSON.stringify(processedPayments)
    );
  }, [processedPayments]);

  useEffect(() => {
    if (isDataFetched) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(getLicenses()),
          dispatch(checkExpiry()),
          dispatch(getCompanies()),
          dispatch(getProducts()),
          dispatch(getFeeStructuresByFeeType("renewal")),
          dispatch(getSubscriptions()),
        ]);

        const allCompanyProductIDs = memoizedSubscriptions.map(
          (sub) => sub.companyProductID
        );
        const uniqueCompanyProductIDs = [...new Set(allCompanyProductIDs)];

        const companyFeePromises = uniqueCompanyProductIDs.map(
          async (companyProductID) => {
            try {
              const companyFeeResult = await dispatch(
                getFeeStructuresByCompanyProductId(companyProductID)
              );
              if (companyFeeResult.payload) {
                setCompanyFeeData((prev) => ({
                  ...prev,
                  [companyProductID]: Array.isArray(companyFeeResult.payload)
                    ? companyFeeResult.payload
                    : [],
                }));

                const feeStructurePromises = (
                  Array.isArray(companyFeeResult.payload)
                    ? companyFeeResult.payload
                    : []
                ).map(async (fee) => {
                  const feeStructureResult = await dispatch(
                    getFeeStructureById(fee.feeID)
                  );
                  return {
                    feeID: fee.feeID,
                    data: feeStructureResult.payload,
                  };
                });

                const feeStructureResults = await Promise.all(
                  feeStructurePromises
                );
                const feeStructureMap = {};
                feeStructureResults.forEach((result) => {
                  if (result.data) {
                    feeStructureMap[result.feeID] = result.data;
                  }
                });

                setFeeStructureDetails((prev) => ({
                  ...prev,
                  [companyProductID]: feeStructureMap,
                }));
              }
            } catch (error) {
              console.error(
                `Error fetching fee structures for companyProductID ${companyProductID}:`,
                error
              );
              setCompanyFeeData((prev) => ({
                ...prev,
                [companyProductID]: [],
              }));
            }
          }
        );

        await Promise.all(companyFeePromises);
        setIsDataFetched(true);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [dispatch, memoizedSubscriptions, isDataFetched]);

  const getCompanyName = (companyID) => {
    const company = companies.find((c) => c.companyID === companyID);
    return company ? company.companyName : "Unknown";
  };

  const getProductName = (productID) => {
    const product = products.find((p) => p.productID === productID);
    return product ? product.productName : "Unknown";
  };

  const getSubscriptionDetails = (companyProductID) => {
    const subscription = memoizedSubscriptions.find(
      (s) => s.companyProductID === companyProductID
    );
    if (subscription) {
      return {
        companyName: getCompanyName(subscription.companyID),
        productName: getProductName(subscription.productID),
      };
    }
    return { companyName: "Unknown", productName: "Unknown" };
  };

  const handleExpandRow = async (companyProductID) => {
    setExpandedRows((prev) => ({
      ...prev,
      [companyProductID]: !prev[companyProductID],
    }));
  };

  const getLicenseType = (companyProductID) => {
    if (
      expiredLicenses.some(
        (license) => license.companyProductID === companyProductID
      )
    ) {
      return "expired";
    }
    if (
      nearToExpireLicenses.some(
        (license) => license.companyProductID === companyProductID
      )
    ) {
      return "nearToExpire";
    }
    if (
      validLicenses.some(
        (license) => license.companyProductID === companyProductID
      )
    ) {
      return "valid";
    }
    if (
      unlicensedSubscriptions.some(
        (subscription) => subscription.companyProductID === companyProductID
      )
    ) {
      return "unlicensed";
    }
    return "unknown";
  };

  const hasUnpaidAmount = (companyProductID) => {
    const companyFees = companyFeeData[companyProductID] || [];
    return companyFees.some((fee) => (fee.unpaidAmount || 0) !== 0);
  };

  const calculatePayableAmount = (companyProductID) => {
    const companyFees = companyFeeData[companyProductID] || [];
    const feeDetails = feeStructureDetails[companyProductID] || {};
    const licenseType = getLicenseType(companyProductID);
    const isProcessed = processedPayments[companyProductID];

    if (!companyFees.length || !feeDetails) {
      return 0;
    }

    if (licenseType === "valid") {
      return 0; // Valid licenses always show 0
    }

    if (licenseType === "unlicensed") {
      return companyFees.reduce((total, fee) => {
        return total + (fee.unpaidAmount || 0);
      }, 0);
    }

    if (licenseType === "expired" || licenseType === "nearToExpire") {
      if (!isProcessed) {
        return 0; // Show 0 before payment is processed
      }
      return companyFees.reduce((total, fee) => {
        const feeStructure = feeDetails[fee.feeID] || {};
        return total + (feeStructure.feeAmount || 0); // Show Base Fee Amount after payment
      }, 0);
    }

    return 0;
  };

  const renderExpandedContent = (companyProductID) => {
    const companyFees = companyFeeData[companyProductID] || [];
    const feeDetails = feeStructureDetails[companyProductID] || {};
    const licenseType = getLicenseType(companyProductID);

    if (!companyFees.length) {
      return <div>No fee structures found for this subscription.</div>;
    }

    return (
      <div className="p-4 bg-gray-50 rounded-md">
        <h4 className="font-semibold mb-3">Company Fee Details:</h4>
        {companyFees.map((fee, index) => {
          const feeStructure = feeDetails[fee.feeID] || {};
          return (
            <div
              key={fee.feeID || index}
              className="mb-3 p-3 bg-white rounded border"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Number of Devices:</strong>{" "}
                    {feeStructure.noOfDevice || "N/A"}
                  </p>
                  <p>
                    <strong>Number of Users:</strong>{" "}
                    {feeStructure.noOfUsers || "N/A"}
                  </p>
                  <p>
                    <strong>License Type:</strong>{" "}
                    {feeStructure.licenseType || "N/A"}
                  </p>
                  <p>
                    <strong>Fee Type:</strong> {feeStructure.feeType || "N/A"}
                  </p>
                  <p>
                    <strong>Period:</strong> {feeStructure.period || "N/A"}
                  </p>
                </div>
                <div>
                  {licenseType !== "unlicensed" && (
                    <p>
                      <strong>Base Fee Amount:</strong> $
                      {feeStructure.feeAmount || 0}
                    </p>
                  )}
                  <p>
                    <strong>Paid Amount:</strong> ${fee.paidAmount || 0}
                  </p>
                  <p>
                    <strong>Unpaid Amount:</strong> ${fee.unpaidAmount || 0}
                  </p>
                  <p>
                    <strong>Payable Amount:</strong> ${fee.payableAmount || 0}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const currentDate = new Date("2025-06-21T21:23:00Z");
  const thirtyDaysLater = new Date(currentDate);
  thirtyDaysLater.setDate(currentDate.getDate() + 30);

  const expiredLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return license.isExpired !== undefined
      ? license.isExpired
      : expiryDate < currentDate;
  });

  const nearToExpireLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return (
      !license.isExpired &&
      expiryDate >= currentDate &&
      expiryDate <= thirtyDaysLater
    );
  });

  const validLicenses = licenses.filter((license) => {
    const expiryDate = new Date(license.expiryDate);
    return !license.isExpired && expiryDate > thirtyDaysLater;
  });

  const unlicensedSubscriptions = memoizedSubscriptions
    .filter(
      (subscription) =>
        !licenses.some(
          (license) =>
            license.companyProductID === subscription.companyProductID
        )
    )
    .map((subscription) => ({
      ...subscription,
      ...getSubscriptionDetails(subscription.companyProductID),
    }));

  const handleProcessPayment = async (companyProductID, licenseType) => {
    const companyFees = companyFeeData[companyProductID] || [];
    const feeDetails = feeStructureDetails[companyProductID] || {};

    if (!companyFees.length || !feeDetails) {
      toast.error("Fee structure data not available");
      return;
    }

    try {
      const updatePromises = companyFees.map(async (fee) => {
        if (!fee.companyFeeStructureID) {
          console.error("Invalid companyFeeStructureID for fee:", fee);
          throw new Error("Invalid companyFeeStructureID detected");
        }

        const feeStructure = feeDetails[fee.feeID] || {};
        const baseFee = feeStructure.feeAmount || 0;

        // Calculate new values
        const newPaidAmount = fee.paidAmount || 0;
        const newUnpaidAmount = baseFee;
        const newPayableAmount = (fee.payableAmount || 0) + baseFee; // Set to Base Fee Amount after payment
        //const newPaidAmount = baseFee; // PaidAmount = renewal fee (base fee)
        //const newUnpaidAmount = 0; // UnpaidAmount = 0 as full payment is made
        //const newPayableAmount = (fee.payableAmount || 0) + baseFee;
        // Prepare updated fee data
        const updatedFeeData = {
          companyProductID: fee.companyProductID,
          feeID: fee.feeID,
          paidAmount: newPaidAmount,
          unpaidAmount: newUnpaidAmount,
          payableAmount: newPayableAmount,
        };

        // Dispatch updateCompanyFeeStructure
        const result = await dispatch(
          updateCompanyFeeStructure({
            CompanyFeeStructureID: fee.companyFeeStructureID,
            data: updatedFeeData,
          })
        );

        if (updateCompanyFeeStructure.fulfilled.match(result)) {
          // Update local state
          setCompanyFeeData((prev) => ({
            ...prev,
            [companyProductID]: prev[companyProductID].map((f) =>
              f.companyFeeStructureID === fee.companyFeeStructureID
                ? { ...f, ...updatedFeeData }
                : f
            ),
          }));
        } else {
          throw new Error("Failed to update fee structure");
        }
      });

      await Promise.all(updatePromises);

      // Mark payment as processed
      setProcessedPayments((prev) => ({
        ...prev,
        [companyProductID]: true,
      }));

      const totalAmount = companyFees.reduce((total, fee) => {
        const feeStructure = feeDetails[fee.feeID] || {};
        return total + (feeStructure.feeAmount || 0);
      }, 0);

      toast.success(
        `Payment of $${totalAmount.toFixed(2)} processed successfully!`
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    }
  };

  const handleSendEmail = (companyProductID) => {
    console.log(`Sending email notification for license ${companyProductID}`);
  };

  const getLicenseTypeForRecord = (record) => {
    if (
      expiredLicenses.some(
        (license) => license.companyProductID === record.companyProductID
      )
    ) {
      return "expired";
    }
    if (
      nearToExpireLicenses.some(
        (license) => license.companyProductID === record.companyProductID
      )
    ) {
      return "nearToExpire";
    }
    if (
      validLicenses.some(
        (license) => license.companyProductID === record.companyProductID
      )
    ) {
      return "valid";
    }
    if (
      unlicensedSubscriptions.some(
        (subscription) =>
          subscription.companyProductID === record.companyProductID
      )
    ) {
      return "unlicensed";
    }
    return "unknown";
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text, record) => (
        <div className="flex items-center">
          <Button
            type="text"
            size="small"
            icon={
              expandedRows[record.companyProductID] ? (
                <MinusOutlined />
              ) : (
                <PlusOutlined />
              )
            }
            onClick={() => handleExpandRow(record.companyProductID)}
            className="mr-2 border border-gray-300"
          />
          {text}
        </div>
      ),
    },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Payable Information",
      key: "payableInfo",
      render: (_, record) => {
        const payableAmount = calculatePayableAmount(record.companyProductID);
        return (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">${payableAmount.toFixed(2)}</span>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const licenseType = getLicenseTypeForRecord(record);
        const isProcessed = processedPayments[record.companyProductID];

        if (licenseType === "expired" || licenseType === "nearToExpire") {
          if (!isProcessed) {
            return (
              <Button
                size="small"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-1 px-2 rounded-md transition duration-200"
                onClick={() =>
                  handleProcessPayment(record.companyProductID, licenseType)
                }
              >
                Process Payment
              </Button>
            );
          }
          return (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition duration-200"
              onClick={() => handleSendEmail(record.companyProductID)}
            >
              Send Email
            </Button>
          );
        }

        if (licenseType === "valid" || licenseType === "unlicensed") {
          return (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md transition duration-200"
              onClick={() => handleSendEmail(record.companyProductID)}
            >
              Send Email
            </Button>
          );
        }

        return null;
      },
    },
  ];

  const renderTableWithExpandableRows = (dataSource, title) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="companyProductID"
        loading={status === "loading"}
        pagination={false}
        className="ant-table-custom"
        expandable={{
          expandedRowRender: (record) =>
            expandedRows[record.companyProductID]
              ? renderExpandedContent(record.companyProductID)
              : null,
          expandedRowKeys: Object.keys(expandedRows).filter(
            (key) => expandedRows[key]
          ),
          showExpandColumn: false,
        }}
      />
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Check Expiry</h1>
      {status === "loading" ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {error && (
            <Alert
              message={`Error: ${error}`}
              type="error"
              className="mb-6 rounded-md"
            />
          )}
          {renderTableWithExpandableRows(
            expiredLicenses.map((license) => ({
              ...license,
              ...getSubscriptionDetails(license.companyProductID),
            })),
            "Expired Licenses"
          )}
          {renderTableWithExpandableRows(
            nearToExpireLicenses.map((license) => ({
              ...license,
              ...getSubscriptionDetails(license.companyProductID),
            })),
            "Near to Expire Licenses"
          )}
          {renderTableWithExpandableRows(
            validLicenses.map((license) => ({
              ...license,
              ...getSubscriptionDetails(license.companyProductID),
            })),
            "Valid Licenses"
          )}
          {renderTableWithExpandableRows(
            unlicensedSubscriptions,
            "Unlicensed Subscriptions"
          )}
        </>
      )}
    </div>
  );
};

export default CheckExpiryPage;
