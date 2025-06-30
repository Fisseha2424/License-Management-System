import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

// Base URL for API (updated for IIS on port 5001)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

export const getCompanies = createAsyncThunk(
  "fee/getCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Company`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch companies");
      return rejectWithValue(err.message);
    }
  }
);

export const getFeeStructures = createAsyncThunk(
  "fee/getFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Payment/structure`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch fee structures");
      return rejectWithValue(err.message);
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  "fee/createFeeStructure",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", JSON.stringify(data));
      const response = await axios.post(`${API_URL}/Payment/structure`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Fee structure added successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to create fee structure");
      return rejectWithValue(err.message);
    }
  }
);

export const updateFeeStructure = createAsyncThunk(
  "fee/updateFeeStructure",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/Payment/structure/${id}`,
        data
      );
      toast.success("Fee structure updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update fee structure");
      return rejectWithValue(err.message);
    }
  }
);

const feeSlice = createSlice({
  name: "fee",
  initialState: {
    feeStructures: [],
    companies: [], // Added to store companies
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.companies = [];
      })
      .addCase(getFeeStructures.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeeStructures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFeeStructures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.feeStructures = [];
      })
      .addCase(createFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.feeStructures.findIndex(
          (f) => f.FeeStructureID === action.payload.FeeStructureID
        );
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;
