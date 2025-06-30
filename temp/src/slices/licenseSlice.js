// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { toast } from "react-toastify";
// // import axios from "axios";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// // // 1. There is NO GET /api/License endpoint! Remove getLicenses and use local state or another way if needed.

// // // Generate License
// // export const generateLicense = createAsyncThunk(
// //   "license/generateLicense",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.post(`${API_URL}/License/generate`, data, {
// //         headers: { "Content-Type": "application/json" },
// //       });
// //       toast.success("License generated successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to generate license";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // Validate License (expects a license key or object, clarify with your backend)
// // export const validateLicense = createAsyncThunk(
// //   "license/validateLicense",
// //   async (licensePayload, { rejectWithValue }) => {
// //     try {
// //       // licensePayload should be the license object, not just an id
// //       const response = await axios.post(
// //         `${API_URL}/License/validate`,
// //         licensePayload,
// //         {
// //           headers: { "Content-Type": "application/json" },
// //         }
// //       );
// //       toast.success("License validated successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to validate license";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // Export License (GET /export/{companyId})
// // export const exportLicense = createAsyncThunk(
// //   "license/exportLicense",
// //   async (companyId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/License/export/${companyId}`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("License export initiated!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to export license";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // Check Expiry
// // export const checkExpiry = createAsyncThunk(
// //   "license/checkExpiry",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/License/check-expiry`);
// //       toast.success("Expiry checked successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to check expiry";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // Get Public Key
// // export const getPublicKey = createAsyncThunk(
// //   "license/getPublicKey",
// //   async (companyId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/License/public-key/${companyId}`,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("Public key retrieved successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to get public key";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // // Import by Public Key
// // export const importByPublicKey = createAsyncThunk(
// //   "license/importByPublicKey",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/License/by-public-key`,
// //         data,
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       toast.success("License imported successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to import license";
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // const licenseSlice = createSlice({
// //   name: "license",
// //   initialState: {
// //     licenses: [],
// //     status: "idle",
// //     error: null,
// //     exportData: null,
// //     publicKey: null,
// //   },
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //     exportSuccess: (state, action) => {
// //       state.exportData = action.payload;
// //     },
// //     setLicenses: (state, action) => {
// //       state.licenses = action.payload;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(generateLicense.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(generateLicense.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.licenses.push(action.payload);
// //       })
// //       .addCase(generateLicense.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       .addCase(validateLicense.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(validateLicense.fulfilled, (state) => {
// //         state.status = "succeeded";
// //       })
// //       .addCase(validateLicense.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       .addCase(exportLicense.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(exportLicense.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.exportData = action.payload;
// //       })
// //       .addCase(exportLicense.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       .addCase(checkExpiry.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(checkExpiry.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         // If you want to update licenses with expiry status, implement here
// //       })
// //       .addCase(checkExpiry.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       .addCase(getPublicKey.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(getPublicKey.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.publicKey = action.payload;
// //       })
// //       .addCase(getPublicKey.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       })

// //       .addCase(importByPublicKey.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(importByPublicKey.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.licenses.push(action.payload);
// //       })
// //       .addCase(importByPublicKey.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //       });
// //   },
// // });

// // export const { clearError, exportSuccess, setLicenses } = licenseSlice.actions;
// // export default licenseSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// // Generate License
// export const generateLicense = createAsyncThunk(
//   "license/generateLicense",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/License/generate`, data, {
//         headers: { "Content-Type": "application/json" },
//       });
//       toast.success("License generated successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to generate license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Validate License
// export const validateLicense = createAsyncThunk(
//   "license/validateLicense",
//   async (licensePayload, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/validate`,
//         licensePayload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       toast.success("License validated successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to validate license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const exportLicense = createAsyncThunk(
//   "license/exportLicense",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/License/export/${companyId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Licenses retrieved successfully!"); // Updated message for clarity
//       return response.data; // Expecting an array of licenses
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to retrieve licenses";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Check Expiry
// export const checkExpiry = createAsyncThunk(
//   "license/checkExpiry",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/License/check-expiry`);
//       toast.success("Expiry checked successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to check expiry";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Get Public Key
// export const getPublicKey = createAsyncThunk(
//   "license/getPublicKey",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/License/public-key/${companyId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Public key retrieved successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to get public key";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Import by Public Key
// export const importByPublicKey = createAsyncThunk(
//   "license/importByPublicKey",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/by-public-key`,
//         data,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("License imported successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to import license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const licenseSlice = createSlice({
//   name: "license",
//   initialState: {
//     licenses: [],
//     status: "idle",
//     error: null,
//     exportData: null,
//     publicKey: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     exportSuccess: (state, action) => {
//       state.exportData = action.payload;
//     },
//     setLicenses: (state, action) => {
//       state.licenses = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(generateLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(generateLicense.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses.push(action.payload);
//       })
//       .addCase(generateLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(validateLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(validateLicense.fulfilled, (state) => {
//         state.status = "succeeded";
//       })
//       .addCase(validateLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(exportLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(exportLicense.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses = Array.isArray(action.payload)
//           ? action.payload
//           : state.licenses; // Update licenses state
//       })
//       .addCase(exportLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(checkExpiry.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(checkExpiry.fulfilled, (state, action) => {
//         state.status = "succeeded";
//       })
//       .addCase(checkExpiry.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(getPublicKey.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getPublicKey.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.publicKey = action.payload;
//       })
//       .addCase(getPublicKey.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(importByPublicKey.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(importByPublicKey.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses.push(action.payload);
//       })
//       .addCase(importByPublicKey.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, exportSuccess, setLicenses } = licenseSlice.actions;
// export default licenseSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// // Generate License
// export const generateLicense = createAsyncThunk(
//   "license/generateLicense",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/License/generate`, data, {
//         headers: { "Content-Type": "application/json" },
//       });
//       toast.success("License generated successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to generate license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Validate License
// export const validateLicense = createAsyncThunk(
//   "license/validateLicense",
//   async (licensePayload, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/validate`,
//         licensePayload,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       toast.success("License validated successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to validate license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Export License
// export const exportLicense = createAsyncThunk(
//   "license/exportLicense",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/License/export/${companyId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Licenses retrieved successfully!");
//       return response.data; // Expecting an array of licenses
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to retrieve licenses";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Check Expiry
// export const checkExpiry = createAsyncThunk(
//   "license/checkExpiry",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/License/check-expiry`);
//       toast.success("Expiry checked successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to check expiry";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Get Public Key
// export const getPublicKey = createAsyncThunk(
//   "license/getPublicKey",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/License/public-key/${companyId}`,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("Public key retrieved successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to get public key";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Import by Public Key
// export const importByPublicKey = createAsyncThunk(
//   "license/importByPublicKey",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/by-public-key`,
//         data,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       toast.success("License imported successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to import license";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const licenseSlice = createSlice({
//   name: "license",
//   initialState: {
//     licenses: [],
//     status: "idle",
//     error: null,
//     exportData: null,
//     publicKey: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     exportSuccess: (state, action) => {
//       state.exportData = action.payload;
//     },
//     setLicenses: (state, action) => {
//       state.licenses = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(generateLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(generateLicense.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses.push(action.payload);
//       })
//       .addCase(generateLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(validateLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(validateLicense.fulfilled, (state) => {
//         state.status = "succeeded";
//       })
//       .addCase(validateLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(exportLicense.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(exportLicense.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses = Array.isArray(action.payload)
//           ? action.payload
//           : state.licenses;
//         state.exportData = action.payload;
//       })
//       .addCase(exportLicense.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(checkExpiry.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(checkExpiry.fulfilled, (state, action) => {
//         state.status = "succeeded";
//       })
//       .addCase(checkExpiry.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(getPublicKey.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getPublicKey.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.publicKey = action.payload;
//       })
//       .addCase(getPublicKey.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(importByPublicKey.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(importByPublicKey.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses.push(action.payload);
//       })
//       .addCase(importByPublicKey.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, exportSuccess, setLicenses } = licenseSlice.actions;
// export default licenseSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// Generate License
export const generateLicense = createAsyncThunk(
  "license/generateLicense",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/License/generate`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("License generated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to generate license";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Validate License
export const validateLicense = createAsyncThunk(
  "license/validateLicense",
  async (licensePayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/License/validate`,
        licensePayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("License validated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to validate license";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Export License
export const exportLicense = createAsyncThunk(
  "license/exportLicense",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/License/export/${companyId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Licenses retrieved successfully!");
      return response.data; // Expecting an array of licenses
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to retrieve licenses";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Check Expiry
export const checkExpiry = createAsyncThunk(
  "license/checkExpiry",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/License/check-expiry`);
      toast.success("Expiry checked successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to check expiry";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Get Public Key
export const getPublicKey = createAsyncThunk(
  "license/getPublicKey",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/License/public-key/${companyId}`,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Public key retrieved successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to get public key";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Import by Public Key
export const importByPublicKey = createAsyncThunk(
  "license/importByPublicKey",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/License/by-public-key`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("License imported successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to import license";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const licenseSlice = createSlice({
  name: "license",
  initialState: {
    licenses: [],
    status: "idle",
    error: null,
    exportData: null,
    publicKey: null,
    formData: {
      companySubscription: "",
      expiryDate: "",
      numDevices: "",
      numUsers: "",
      licenseType: "",
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    exportSuccess: (state, action) => {
      state.exportData = action.payload;
    },
    setLicenses: (state, action) => {
      state.licenses = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLicense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(generateLicense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.licenses.push(action.payload);
        state.formData = {
          companySubscription: "",
          expiryDate: "",
          numDevices: "",
          numUsers: "",
          licenseType: "",
        };
      })
      .addCase(generateLicense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(validateLicense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(validateLicense.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(validateLicense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(exportLicense.pending, (state) => {
        state.status = "loading";
      })
      .addCase(exportLicense.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.licenses = Array.isArray(action.payload)
          ? action.payload
          : state.licenses;
        state.exportData = action.payload;
      })
      .addCase(exportLicense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkExpiry.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkExpiry.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(checkExpiry.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPublicKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPublicKey.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.publicKey = action.payload;
      })
      .addCase(getPublicKey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(importByPublicKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(importByPublicKey.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.licenses.push(action.payload);
      })
      .addCase(importByPublicKey.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, exportSuccess, setLicenses, setFormData } =
  licenseSlice.actions;
export default licenseSlice.reducer;
