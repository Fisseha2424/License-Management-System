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
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructures = createAsyncThunk(
  "fee/getFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/FeeStructure`); // Changed from /Payment/structure
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch fee structures");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructureById = createAsyncThunk(
  "fee/getFeeStructureById",
  async (feeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/FeeStructure/${feeId}`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructuresByLicenseType = createAsyncThunk(
  "fee/getFeeStructuresByLicenseType",
  async (licenseType, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/FeeStructure/licenseType/${licenseType}`
      );
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch fee structures by license type");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  "fee/createFeeStructure",
  async (data, { rejectWithValue }) => {
    try {
      console.log("data", JSON.stringify(data));
      const response = await axios.post(`${API_URL}/FeeStructure`, data, {
        // Changed from /Payment/structure
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Fee structure added successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to create fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateFeeStructure = createAsyncThunk(
  "fee/updateFeeStructure",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/FeeStructure/${id}`, data); // Changed from /Payment/structure/${id}
      toast.success("Fee structure updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteFeeStructure = createAsyncThunk(
  // Renamed from deleteFee
  "fee/deleteFeeStructure",
  async (feeID, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/FeeStructure/${feeID}`, {
        // Changed from /Payment/structure/${feeID}
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Fee deleted successfully!");
      return feeID;
    } catch (err) {
      toast.error("Failed to delete fee");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createCompanyFeeStructure = createAsyncThunk(
  "fee/createCompanyFeeStructure",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/CompanyFeeStructure`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Company fee structure created successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to create company fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getCompanyFeeStructures = createAsyncThunk(
  "fee/getCompanyFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/CompanyFeeStructure`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch company fee structures");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getCompanyFeeStructureById = createAsyncThunk(
  "fee/getCompanyFeeStructureById",
  async (companyFeeStructureId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/CompanyFeeStructure/${companyFeeStructureId}`
      );
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch company fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getCompanyFeeStructuresByLicenseType = createAsyncThunk(
  "fee/getCompanyFeeStructuresByLicenseType",
  async (licenseType, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/CompanyFeeStructure/licenseType/${licenseType}`
      );
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch company fee structures by license type");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateCompanyFeeStructure = createAsyncThunk(
  "fee/updateCompanyFeeStructure",
  async ({ companyFeeStructureId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/CompanyFeeStructure/${companyFeeStructureId}`,
        data
      );
      toast.success("Company fee structure updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update company fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteCompanyFeeStructure = createAsyncThunk(
  "fee/deleteCompanyFeeStructure",
  async (companyFeeStructureId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/CompanyFeeStructure/${companyFeeStructureId}`
      );
      toast.success("Company fee structure deleted successfully!");
      return companyFeeStructureId;
    } catch (err) {
      toast.error("Failed to delete company fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const feeSlice = createSlice({
  name: "fee",
  initialState: {
    feeStructures: [],
    companyFeeStructures: [], // Added to store CompanyFeeStructure data
    companies: [],
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
      .addCase(getFeeStructureById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeeStructureById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.feeStructures.findIndex(
          (f) => f.FeeID === action.payload.FeeID
        ); // Changed to FeeID
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(getFeeStructureById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFeeStructuresByLicenseType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeeStructuresByLicenseType.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFeeStructuresByLicenseType.rejected, (state, action) => {
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
          (f) => f.FeeID === action.payload.FeeID
        ); // Changed to FeeID
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feeStructures = state.feeStructures.filter(
          (fee) => fee.FeeID !== action.payload // Changed to FeeID
        );
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createCompanyFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCompanyFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companyFeeStructures.push(action.payload);
      })
      .addCase(createCompanyFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCompanyFeeStructures.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyFeeStructures.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companyFeeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getCompanyFeeStructures.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.companyFeeStructures = [];
      })
      .addCase(getCompanyFeeStructureById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCompanyFeeStructureById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companyFeeStructures.findIndex(
          (f) =>
            f.CompanyFeeStructureID === action.payload.CompanyFeeStructureID
        );
        if (index !== -1) state.companyFeeStructures[index] = action.payload;
      })
      .addCase(getCompanyFeeStructureById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getCompanyFeeStructuresByLicenseType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getCompanyFeeStructuresByLicenseType.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.companyFeeStructures = Array.isArray(action.payload)
            ? action.payload
            : [];
        }
      )
      .addCase(
        getCompanyFeeStructuresByLicenseType.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          state.companyFeeStructures = [];
        }
      )
      .addCase(updateCompanyFeeStructure.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCompanyFeeStructure.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.companyFeeStructures.findIndex(
          (f) =>
            f.CompanyFeeStructureID === action.payload.CompanyFeeStructureID
        );
        if (index !== -1) state.companyFeeStructures[index] = action.payload;
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
        state.companyFeeStructures = state.companyFeeStructures.filter(
          (f) => f.CompanyFeeStructureID !== action.payload
        );
      })
      .addCase(deleteCompanyFeeStructure.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;
