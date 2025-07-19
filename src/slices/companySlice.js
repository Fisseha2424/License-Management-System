import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.101:5212/api";
export const getCompanies = createAsyncThunk(
  "company/getCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Company`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch companies");
      return rejectWithValue(err.message);
    }
  }
);

export const getCompanyById = createAsyncThunk(
  "company/getCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Company/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch company");
      return rejectWithValue(err.message);
    }
  }
);

export const getCompaniesByType = createAsyncThunk(
  "company/getCompaniesByType",
  async (type, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Company/type/${type}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch companies by type");
      return rejectWithValue(err.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/Company`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Company created successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to create company");
      return rejectWithValue(err.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/Company/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Company updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update company");
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/Company/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Company deleted successfully!");
      return id;
    } catch (err) {
      toast.error("Failed to delete company");
      return rejectWithValue(err.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
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
      .addCase(getCompanyById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companies.findIndex(
          (c) => c.companyID === action.payload.companyID
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        } else {
          state.companies.push(action.payload);
        }
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCompaniesByType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompaniesByType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCompaniesByType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companies.findIndex(
          (c) => c.companyID === action.payload.companyID
        );
        if (index !== -1) state.companies[index] = action.payload;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = state.companies.filter(
          (c) => c.companyID !== action.payload
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;
