import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

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
  async (data, { rejectWithValue }) => {
    try {
      console.log("createSubscription data:", data);
      const response = await axios.post(
        `${API_URL}/CompanyProductSubscription`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Subscription created successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create subscription";
      console.error("Create subscription error:", {
        status: err.response?.status,
        data: err.response?.data,
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
      const response = await axios.put(
        `${API_URL}/CompanyProductSubscription/${id}`,
        data,
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
      await axios.delete(
        `${API_URL}/CompanyProductSubscription/${companyProductID}`,
        { headers: { "Content-Type": "application/json" } }
      );
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
