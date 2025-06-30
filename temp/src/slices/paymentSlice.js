import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axios from 'axios';

// Base URL for API (updated for IIS on port 5001)
const API_URL = 'http://localhost:5001/api';

export const getPayments = createAsyncThunk(
  'payment/getPayments',
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Payment/company/${companyId}`);
      return response.data;
    } catch (err) {
      toast.error('Failed to fetch payments');
      return rejectWithValue(err.message);
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/Payment/make-payment`, paymentData);
      toast.success('Payment initiated successfully');
      return response.data;
    } catch (err) {
      toast.error('Failed to initiate payment');
      return rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPayments.pending, (state) => { state.status = 'loading'; })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.payments = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.payments = [];
      })
      .addCase(initiatePayment.pending, (state) => { state.status = 'loading'; })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.payments.findIndex((p) => p.PaymentID === action.payload.PaymentID);
        if (index !== -1) state.payments[index] = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;