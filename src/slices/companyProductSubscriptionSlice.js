import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import {
  createCompanyFeeStructure,
  getCompanyFeeStructures,
} from "./companyFeeSlice";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

export const getSubscriptions = createAsyncThunk(
  "subscription/getSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/CompanyProductSubscription`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subscriptions";
      console.error("Get subscriptions error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSubscriptionById = createAsyncThunk(
  "subscription/getSubscriptionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/CompanyProductSubscription/${id}`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subscription";
      console.error("Get subscription by ID error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getSubscriptionsByCompanyId = createAsyncThunk(
  "subscription/getSubscriptionsByCompanyId",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/CompanyProductSubscription/company/${companyId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch subscriptions by company";
      console.error("Get subscriptions by company ID error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      console.log("createSubscription input data:", data);
      const subscriptionData = {
        companyID: data.companyID,
        productID: data.productID,
        notifyBeforeXDays: data.notifyBeforeXDays,
        noOfUsers: data.noOfUsers,
        noOfDevice: data.noOfDevice,
      };
      const subscriptionResponse = await axios.post(
        `${API_URL}/CompanyProductSubscription`,
        subscriptionData,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Subscription created:", subscriptionResponse.data);
      toast.success("Subscription created successfully!");

      // Fetch fee structure based on noOfUsers, noOfDevice, and feeType
      const feeStructuresResponse = await axios.get(
        `${API_URL}/FeeStructure/fee-type/Subscription`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Fee structures fetched:", feeStructuresResponse.data);
      const matchingFee = feeStructuresResponse.data.find(
        (fee) =>
          fee.feeType === "Subscription" &&
          fee.noOfUsers === data.noOfUsers &&
          fee.noOfDevice === data.noOfDevice
      );

      if (!matchingFee) {
        throw new Error(
          `No matching fee structure found for noOfUsers: ${data.noOfUsers}, noOfDevice: ${data.noOfDevice}`
        );
      }

      // Create CompanyFeeStructure entry
      const companyFeeStructureData = {
        companyProductID: subscriptionResponse.data.companyProductID,
        feeID: matchingFee.feeID,
        paidAmount: 0,
        unpaidAmount: matchingFee.feeAmount,
        payableAmount: matchingFee.feeAmount,
        state: true,
      };
      console.log("Creating CompanyFeeStructure:", companyFeeStructureData);
      const feeStructureResponse = await dispatch(
        createCompanyFeeStructure(companyFeeStructureData)
      ).unwrap();
      console.log("CompanyFeeStructure created:", feeStructureResponse);

      // Refresh all companyFeeStructures
      await dispatch(getCompanyFeeStructures()).unwrap();

      return subscriptionResponse.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create subscription";
      console.error("Create subscription error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "subscription/updateSubscription",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const subscriptionData = {
        companyID: data.companyID,
        productID: data.productID,
        notifyBeforeXDays: data.notifyBeforeXDays,
        noOfUsers: data.noOfUsers,
        noOfDevice: data.noOfDevice,
      };
      const response = await axios.put(
        `${API_URL}/CompanyProductSubscription/${id}`,
        subscriptionData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Subscription updated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update subscription";
      console.error("Update subscription error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  "subscription/deleteSubscription",
  async (companyProductID, { rejectWithValue }) => {
    try {
      console.log("Deleting subscription with ID:", companyProductID);
      const response = await axios.delete(
        `${API_URL}/CompanyProductSubscription/${companyProductID}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Delete response:", response.data);
      toast.success("Subscription deleted successfully!");
      return companyProductID;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete subscription";
      console.error("Delete subscription error:", {
        status: err.response?.status,
        data: err.response?.data,
        companyProductID,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const companyProductSubscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getSubscriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.subscriptions = [];
      })
      .addCase(getSubscriptionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.subscriptions.findIndex(
          (s) => s.companyProductID === action.payload.companyProductID
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        } else {
          state.subscriptions.push(action.payload);
        }
      })
      .addCase(getSubscriptionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getSubscriptionsByCompanyId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getSubscriptionsByCompanyId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.subscriptions.findIndex(
          (s) => s.companyProductID === action.payload.companyProductID
        );
        if (index !== -1) state.subscriptions[index] = action.payload;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = state.subscriptions.filter(
          (s) => s.companyProductID !== action.payload
        );
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = companyProductSubscriptionSlice.actions;
export default companyProductSubscriptionSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { toast } from "react-toastify";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// export const getSubscriptions = createAsyncThunk(
//   "subscription/getSubscriptions",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/CompanyProductSubscription`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to fetch subscriptions";
//       console.error("Get subscriptions error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const getSubscriptionById = createAsyncThunk(
//   "subscription/getSubscriptionById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/CompanyProductSubscription/${id}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to fetch subscription";
//       console.error("Get subscription by ID error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const getSubscriptionsByCompanyId = createAsyncThunk(
//   "subscription/getSubscriptionsByCompanyId",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/CompanyProductSubscription/company/${companyId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to fetch subscriptions by company";
//       console.error("Get subscriptions by company ID error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const createSubscription = createAsyncThunk(
//   "subscription/createSubscription",
//   async (data, { dispatch, rejectWithValue }) => {
//     try {
//       console.log("createSubscription data:", data);
//       const response = await axios.post(
//         `${API_URL}/CompanyProductSubscription`,
//         data,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Subscription created successfully!");

//       // Extract feeAmount and feeID from feeStructures based on feeType
//       const feeType = data.feeType;
//       const feeStructuresResponse = await axios.get(
//         `${API_URL}/FeeStructure/fee-type/${feeType}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       const feeStructure = feeStructuresResponse.data[0]; // Assuming first match
//       const feeAmount = feeStructure ? feeStructure.feeAmount : 0;
//       const feeID = feeStructure ? feeStructure.feeID : null;

//       // Create CompanyFeeStructure entry
//       if (response.data.companyProductID && feeID) {
//         const companyFeeStructureData = {
//           companyProductID: response.data.companyProductID,
//           feeID: feeID,
//           paidAmount: 0, // Assuming unpaid initially
//           unpaidAmount: feeAmount, // Total amount due
//           payableAmount: feeAmount, // Total amount due
//         };
//         await dispatch(
//           createCompanyFeeStructure(companyFeeStructureData)
//         ).unwrap();
//       }

//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to create subscription";
//       console.error("Create subscription error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const updateSubscription = createAsyncThunk(
//   "subscription/updateSubscription",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${API_URL}/CompanyProductSubscription/${id}`,
//         data,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Subscription updated successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to update subscription";
//       console.error("Update subscription error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const deleteSubscription = createAsyncThunk(
//   "subscription/deleteSubscription",
//   async (companyProductID, { rejectWithValue }) => {
//     try {
//       console.log("Deleting subscription with ID:", companyProductID);
//       const response = await axios.delete(
//         `${API_URL}/CompanyProductSubscription/${companyProductID}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       console.log("Delete response:", response.data);
//       toast.success("Subscription deleted successfully!");
//       return companyProductID;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to delete subscription";
//       console.error("Delete subscription error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         companyProductID,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const createCompanyFeeStructure = createAsyncThunk(
//   "subscription/createCompanyFeeStructure",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/CompanyFeeStructure`,
//         data,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Company fee structure created successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to create company fee structure";
//       console.error("Create company fee structure error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const companyProductSubscriptionSlice = createSlice({
//   name: "subscription",
//   initialState: {
//     subscriptions: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getSubscriptions.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getSubscriptions.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.subscriptions = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })
//       .addCase(getSubscriptions.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.subscriptions = [];
//       })
//       .addCase(getSubscriptionById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.subscriptions.findIndex(
//           (s) => s.companyProductID === action.payload.companyProductID
//         );
//         if (index !== -1) {
//           state.subscriptions[index] = action.payload;
//         } else {
//           state.subscriptions.push(action.payload);
//         }
//       })
//       .addCase(getSubscriptionById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(getSubscriptionsByCompanyId.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.subscriptions = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })
//       .addCase(getSubscriptionsByCompanyId.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(createSubscription.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createSubscription.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.subscriptions.push(action.payload);
//       })
//       .addCase(createSubscription.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(updateSubscription.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(updateSubscription.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.subscriptions.findIndex(
//           (s) => s.companyProductID === action.payload.companyProductID
//         );
//         if (index !== -1) state.subscriptions[index] = action.payload;
//       })
//       .addCase(updateSubscription.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(deleteSubscription.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteSubscription.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.subscriptions = state.subscriptions.filter(
//           (s) => s.companyProductID !== action.payload
//         );
//       })
//       .addCase(deleteSubscription.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(createCompanyFeeStructure.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createCompanyFeeStructure.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         // No need to update subscriptions state with fee structure data
//       })
//       .addCase(createCompanyFeeStructure.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = companyProductSubscriptionSlice.actions;
// export default companyProductSubscriptionSlice.reducer;
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";
// // import { toast } from "react-toastify";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// // export const getSubscriptions = createAsyncThunk(
// //   "subscription/getSubscriptions",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/CompanyProductSubscription`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to fetch subscriptions";
// //       console.error("Get subscriptions error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const getSubscriptionById = createAsyncThunk(
// //   "subscription/getSubscriptionById",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/CompanyProductSubscription/${id}`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to fetch subscription";
// //       console.error("Get subscription by ID error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const getSubscriptionsByCompanyId = createAsyncThunk(
// //   "subscription/getSubscriptionsByCompanyId",
// //   async (companyId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/CompanyProductSubscription/company/${companyId}`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to fetch subscriptions by company";
// //       console.error("Get subscriptions by company ID error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const createSubscription = createAsyncThunk(
// //   "subscription/createSubscription",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       console.log("createSubscription data:", data);
// //       const response = await axios.post(
// //         `${API_URL}/CompanyProductSubscription`,
// //         data,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("Subscription created successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to create subscription";
// //       console.error("Create subscription error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const updateSubscription = createAsyncThunk(
// //   "subscription/updateSubscription",
// //   async ({ id, data }, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.put(
// //         `${API_URL}/CompanyProductSubscription/${id}`,
// //         data,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("Subscription updated successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to update subscription";
// //       console.error("Update subscription error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // export const deleteSubscription = createAsyncThunk(
// // //   "subscription/deleteSubscription",
// // //   async (companyProductID, { rejectWithValue }) => {
// // //     try {
// // //       console.log("Deleting subscription with ID:", companyProductID);
// // //       await axios.delete(
// // //         `${API_URL}/CompanyProductSubscription/${companyProductID}`,
// // //         { headers: { "Content-Type": "application/json" } }
// // //       );
// // //       toast.success("Subscription deleted successfully!");
// // //       return companyProductID;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to delete subscription";
// // //       console.error("Delete subscription error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // export const deleteSubscription = createAsyncThunk(
// //   "subscription/deleteSubscription",
// //   async (companyProductID, { rejectWithValue }) => {
// //     try {
// //       console.log("Deleting subscription with ID:", companyProductID);
// //       const response = await axios.delete(
// //         `${API_URL}/CompanyProductSubscription/${companyProductID}`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       console.log("Delete response:", response.data);
// //       toast.success("Subscription deleted successfully!");
// //       return companyProductID;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Failed to delete subscription";
// //       console.error("Delete subscription error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //         companyProductID,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );
// // const companyProductSubscriptionSlice = createSlice({
// //   name: "subscription",
// //   initialState: {
// //     subscriptions: [],
// //     status: "idle",
// //     error: null,
// //   },
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(getSubscriptions.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(getSubscriptions.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.subscriptions = Array.isArray(action.payload)
// //           ? action.payload
// //           : [];
// //       })
// //       .addCase(getSubscriptions.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //         state.subscriptions = [];
// //       })
// //       .addCase(getSubscriptionById.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         const index = state.subscriptions.findIndex(
// //           (s) => s.companyProductID === action.payload.companyProductID
// //         );
// //         if (index !== -1) {
// //           state.subscriptions[index] = action.payload;
// //         } else {
// //           state.subscriptions.push(action.payload);
// //         }
// //       })
// //       .addCase(getSubscriptionById.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })
// //       .addCase(getSubscriptionsByCompanyId.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.subscriptions = Array.isArray(action.payload)
// //           ? action.payload
// //           : [];
// //       })
// //       .addCase(getSubscriptionsByCompanyId.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })
// //       .addCase(createSubscription.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(createSubscription.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.subscriptions.push(action.payload);
// //       })
// //       .addCase(createSubscription.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })
// //       .addCase(updateSubscription.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(updateSubscription.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         const index = state.subscriptions.findIndex(
// //           (s) => s.companyProductID === action.payload.companyProductID
// //         );
// //         if (index !== -1) state.subscriptions[index] = action.payload;
// //       })
// //       .addCase(updateSubscription.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })
// //       .addCase(deleteSubscription.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(deleteSubscription.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.subscriptions = state.subscriptions.filter(
// //           (s) => s.companyProductID !== action.payload
// //         );
// //       })
// //       .addCase(deleteSubscription.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export const { clearError } = companyProductSubscriptionSlice.actions;
// // export default companyProductSubscriptionSlice.reducer;
