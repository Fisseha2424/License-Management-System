import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.101:5212/api";
export const getFeeStructures = createAsyncThunk(
  "fee/getFeeStructures",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching fee structures from API...");
      const response = await axios.get(`${API_URL}/FeeStructure`);
      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching fee structures:", err);
      toast.error("Failed to fetch fee structures");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructureById = createAsyncThunk(
  "fee/getFeeStructureById",
  async (feeId, { rejectWithValue }) => {
    try {
      console.log(`Fetching fee structure with ID: ${feeId}...`);
      const response = await axios.get(`${API_URL}/FeeStructure/${feeId}`);
      console.log("Fee structure by ID response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching fee structure by ID:", err);
      toast.error("Failed to fetch fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructuresByLicenseType = createAsyncThunk(
  "fee/getFeeStructuresByLicenseType",
  async (licenseType, { rejectWithValue }) => {
    try {
      console.log(
        `Fetching fee structures for license type: ${licenseType}...`
      );
      const response = await axios.get(
        `${API_URL}/FeeStructure/license-type/${licenseType}`
      );
      console.log("Fee structures by license type response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching fee structures by license type:", err);
      toast.error("Failed to fetch fee structures by license type");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getFeeStructuresByFeeType = createAsyncThunk(
  "fee/getFeeStructuresByFeeType",
  async (feeType, { rejectWithValue }) => {
    try {
      console.log(`Fetching fee structures for fee type: ${feeType}...`);
      const response = await axios.get(
        `${API_URL}/FeeStructure/fee-type/${feeType}`
      );
      console.log("Fee structures by fee type response:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching fee structures by fee type:", err);
      toast.error("Failed to fetch fee structures by fee type");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  "fee/createFeeStructure",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Creating fee structure with data:", JSON.stringify(data));
      const response = await axios.post(`${API_URL}/FeeStructure`, data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Created fee structure response:", response.data);
      toast.success("Fee structure added successfully!");
      return response.data;
    } catch (err) {
      console.error("Error creating fee structure:", err);
      toast.error("Failed to create fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateFeeStructure = createAsyncThunk(
  "fee/updateFeeStructure",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(
        `Updating fee structure with ID: ${id}, data:`,
        JSON.stringify(data)
      );
      const response = await axios.put(`${API_URL}/FeeStructure/${id}`, data);
      console.log("Updated fee structure response:", response.data);
      toast.success("Fee structure updated successfully!");
      return response.data;
    } catch (err) {
      console.error("Error updating fee structure:", err);
      toast.error("Failed to update fee structure");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteFeeStructure = createAsyncThunk(
  "fee/deleteFeeStructure",
  async (feeID, { rejectWithValue }) => {
    try {
      console.log(`Deleting fee structure with ID: ${feeID}...`);
      const response = await axios.delete(`${API_URL}/FeeStructure/${feeID}`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Deleted fee structure response:", response.data);
      toast.success("Fee deleted successfully!");
      return feeID;
    } catch (err) {
      console.error("Error deleting fee structure:", err);
      toast.error("Failed to delete fee");
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const feeSlice = createSlice({
  name: "fee",
  initialState: {
    feeStructures: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeStructures.pending, (state) => {
        console.log("Fee structures fetch pending...");
        state.status = "loading";
      })
      .addCase(getFeeStructures.fulfilled, (state, action) => {
        console.log("Fee structures fetch succeeded, data:", action.payload);
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFeeStructures.rejected, (state, action) => {
        console.log("Fee structures fetch failed, error:", action.payload);
        state.status = "failed";
        state.error = action.payload;
        state.feeStructures = [];
      })
      .addCase(getFeeStructureById.pending, (state) => {
        console.log("Fee structure by ID fetch pending...");
        state.status = "loading";
      })
      .addCase(getFeeStructureById.fulfilled, (state, action) => {
        console.log(
          "Fee structure by ID fetch succeeded, data:",
          action.payload
        );
        state.status = "succeeded";
        const index = state.feeStructures.findIndex(
          (f) => f.feeID === action.payload.feeID
        );
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(getFeeStructureById.rejected, (state, action) => {
        console.log("Fee structure by ID fetch failed, error:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFeeStructuresByLicenseType.pending, (state) => {
        console.log("Fee structures by license type fetch pending...");
        state.status = "loading";
      })
      .addCase(getFeeStructuresByLicenseType.fulfilled, (state, action) => {
        console.log(
          "Fee structures by license type fetch succeeded, data:",
          action.payload
        );
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFeeStructuresByLicenseType.rejected, (state, action) => {
        console.log(
          "Fee structures by license type fetch failed, error:",
          action.payload
        );
        state.status = "failed";
        state.error = action.payload;
        state.feeStructures = [];
      })
      .addCase(getFeeStructuresByFeeType.pending, (state) => {
        console.log("Fee structures by fee type fetch pending...");
        state.status = "loading";
      })
      .addCase(getFeeStructuresByFeeType.fulfilled, (state, action) => {
        console.log(
          "Fee structures by fee type fetch succeeded, data:",
          action.payload
        );
        state.status = "succeeded";
        state.feeStructures = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFeeStructuresByFeeType.rejected, (state, action) => {
        console.log(
          "Fee structures by fee type fetch failed, error:",
          action.payload
        );
        state.status = "failed";
        state.error = action.payload;
        state.feeStructures = [];
      })
      .addCase(createFeeStructure.pending, (state) => {
        console.log("Creating fee structure pending...");
        state.status = "loading";
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        console.log("Creating fee structure succeeded, data:", action.payload);
        state.status = "succeeded";
        state.feeStructures.push(action.payload);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        console.log("Creating fee structure failed, error:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateFeeStructure.pending, (state) => {
        console.log("Updating fee structure pending...");
        state.status = "loading";
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        console.log("Updating fee structure succeeded, data:", action.payload);
        state.status = "succeeded";
        const index = state.feeStructures.findIndex(
          (f) => f.feeID === action.payload.feeID
        );
        if (index !== -1) state.feeStructures[index] = action.payload;
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        console.log("Updating fee structure failed, error:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteFeeStructure.pending, (state) => {
        console.log("Deleting fee structure pending...");
        state.status = "loading";
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        console.log("Deleting fee structure succeeded, ID:", action.payload);
        state.status = "succeeded";
        state.feeStructures = state.feeStructures.filter(
          (fee) => fee.feeID !== action.payload
        );
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        console.log("Deleting fee structure failed, error:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// export const getFeeStructures = createAsyncThunk(
//   "fee/getFeeStructures",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/FeeStructure`);
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to fetch fee structures");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const getFeeStructureById = createAsyncThunk(
//   "fee/getFeeStructureById",
//   async (feeId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/FeeStructure/${feeId}`);
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to fetch fee structure");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const getFeeStructuresByLicenseType = createAsyncThunk(
//   "fee/getFeeStructuresByLicenseType",
//   async (licenseType, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/FeeStructure/license-type/${licenseType}`
//       );
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to fetch fee structures by license type");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const getFeeStructuresByFeeType = createAsyncThunk(
//   "fee/getFeeStructuresByFeeType",
//   async (feeType, { rejectWithValue }) => {
//     try {
//       console.log("fetch:", feeType);
//       const response = await axios.get(
//         `${API_URL}/FeeStructure/fee-type/${feeType}`
//       );
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to fetch fee structures by fee type");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const createFeeStructure = createAsyncThunk(
//   "fee/createFeeStructure",
//   async (data, { rejectWithValue }) => {
//     try {
//       console.log("data", JSON.stringify(data));
//       const response = await axios.post(`${API_URL}/FeeStructure`, data, {
//         headers: { "Content-Type": "application/json" },
//       });
//       toast.success("Fee structure added successfully!");
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to create fee structure");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const updateFeeStructure = createAsyncThunk(
//   "fee/updateFeeStructure",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_URL}/FeeStructure/${id}`, data);
//       toast.success("Fee structure updated successfully!");
//       return response.data;
//     } catch (err) {
//       toast.error("Failed to update fee structure");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// export const deleteFeeStructure = createAsyncThunk(
//   "fee/deleteFeeStructure",
//   async (feeID, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(`${API_URL}/FeeStructure/${feeID}`, {
//         headers: { "Content-Type": "application/json" },
//       });
//       toast.success("Fee deleted successfully!");
//       return feeID;
//     } catch (err) {
//       toast.error("Failed to delete fee");
//       return rejectWithValue(err.response?.data?.message || err.message);
//     }
//   }
// );

// const feeSlice = createSlice({
//   name: "fee",
//   initialState: {
//     feeStructures: [],
//     status: "idle",
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getFeeStructures.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getFeeStructures.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.feeStructures = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })
//       .addCase(getFeeStructures.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.feeStructures = [];
//       })
//       .addCase(getFeeStructureById.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getFeeStructureById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.feeStructures.findIndex(
//           (f) => f.feeID === action.payload.feeID
//         );
//         if (index !== -1) state.feeStructures[index] = action.payload;
//       })
//       .addCase(getFeeStructureById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(getFeeStructuresByLicenseType.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getFeeStructuresByLicenseType.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.feeStructures = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })
//       .addCase(getFeeStructuresByLicenseType.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.feeStructures = [];
//       })
//       .addCase(getFeeStructuresByFeeType.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getFeeStructuresByFeeType.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.feeStructures = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })
//       .addCase(getFeeStructuresByFeeType.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.feeStructures = [];
//       })
//       .addCase(createFeeStructure.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createFeeStructure.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.feeStructures.push(action.payload);
//       })
//       .addCase(createFeeStructure.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(updateFeeStructure.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(updateFeeStructure.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const index = state.feeStructures.findIndex(
//           (f) => f.feeID === action.payload.feeID
//         );
//         if (index !== -1) state.feeStructures[index] = action.payload;
//       })
//       .addCase(updateFeeStructure.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(deleteFeeStructure.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteFeeStructure.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.feeStructures = state.feeStructures.filter(
//           (fee) => fee.feeID !== action.payload
//         );
//       })
//       .addCase(deleteFeeStructure.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export default feeSlice.reducer;
