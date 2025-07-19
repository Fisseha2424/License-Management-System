import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.101:5212/api";

export const getPayments = createAsyncThunk(
  "payment/getPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/PaymentInformation`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch payments");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getPaymentById = createAsyncThunk(
  "payment/getPaymentById",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/PaymentInformation/${paymentId}`
      );
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch payment details");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/PaymentInformation`,
        paymentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Payment created successfully");
      return response.data;
    } catch (err) {
      toast.success("Payment created successfully");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async ({ paymentId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/PaymentInformation/${paymentId}`,
        paymentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Payment updated successfully");
      return response.data;
    } catch (err) {
      toast.error("Failed to update payment");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/PaymentInformation/${paymentId}`);
      toast.success("Payment deleted successfully");
      return paymentId;
    } catch (err) {
      toast.error("Failed to delete payment");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const approvePayment = createAsyncThunk(
  "payment/approvePayment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/PaymentInformation/approve/${id}`
      );
      toast.success("Payment approved successfully");
      return response.data;
    } catch (err) {
      toast.error("Failed to approve payment");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const rejectPayment = createAsyncThunk(
  "payment/rejectPayment",
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/PaymentInformation/reject/${paymentId}`
      );
      toast.success("Payment rejected successfully");
      return response.data;
    } catch (err) {
      toast.error("Failed to reject payment");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [],
    selectedPayment: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.payments = [];
      })
      .addCase(getPaymentById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPaymentById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPayment = action.payload;
      })
      .addCase(getPaymentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments.push(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updatePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.payments.findIndex(
          (p) => p.PaymentID === action.payload.PaymentID
        );
        if (index !== -1) state.payments[index] = action.payload;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deletePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = state.payments.filter(
          (p) => p.PaymentID !== action.payload
        );
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(approvePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approvePayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.payments.findIndex(
          (p) => p.PaymentID === action.payload.PaymentID
        );
        if (index !== -1) state.payments[index] = action.payload;
      })
      .addCase(approvePayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(rejectPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(rejectPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.payments.findIndex(
          (p) => p.PaymentID === action.payload.PaymentID
        );
        if (index !== -1) state.payments[index] = action.payload;
      })
      .addCase(rejectPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
