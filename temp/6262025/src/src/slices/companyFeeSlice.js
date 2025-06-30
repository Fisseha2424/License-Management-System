import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

const initialState = {
  feeStructures: [],
  status: "idle",
  error: null,
};

export const getCompanyFeeStructures = createAsyncThunk(
  "companyFee/getCompanyFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/CompanyFeeStructure`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch fee structures";
      console.error("Get fee structures error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const createCompanyFeeStructure = createAsyncThunk(
  "companyFee/createCompanyFeeStructure",
  async (feeData, { rejectWithValue }) => {
    try {
      console.log("create fee", feeData);
      const response = await axios.post(
        `${API_URL}/CompanyFeeStructure`,
        feeData,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Company fee structure created successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create company fee structure";
      console.error("Create fee structure error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCompanyFeeStructure = createAsyncThunk(
  "companyFee/updateCompanyFeeStructure",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/CompanyFeeStructure/${id}`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Company fee structure updated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update company fee structure";
      console.error("Update fee structure error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCompanyFeeStructure = createAsyncThunk(
  "companyFee/deleteCompanyFeeStructure",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Deleting fee structure with ID:", id);
      const response = await axios.delete(
        `${API_URL}/CompanyFeeStructure/${id}`,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Delete response:", response.data);
      toast.success("Company fee structure deleted successfully!");
      return id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to delete company fee structure";
      console.error("Delete fee structure error:", {
        status: err.response?.status,
        data: err.response?.data,
        id,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const companyFeeSlice = createSlice({
  name: "companyFee",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyFeeStructures.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyFeeStructures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getCompanyFeeStructures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.feeStructures = [];
      })
      .addCase(createCompanyFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCompanyFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures.push(action.payload);
      })
      .addCase(createCompanyFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCompanyFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompanyFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.feeStructures.findIndex(
          (fee) => fee.feeID === action.payload.feeID
        );
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(updateCompanyFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCompanyFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompanyFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures = state.feeStructures.filter(
          (fee) => fee.feeID !== action.payload
        );
      })
      .addCase(deleteCompanyFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = companyFeeSlice.actions;
export default companyFeeSlice.reducer;
