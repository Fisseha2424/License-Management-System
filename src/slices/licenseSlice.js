// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { toast } from "react-toastify";
// import axios from "axios";

// const API_URL =
//   process.env.REACT_APP_API_URL || "http://192.168.1.107:5212/api";

// export const generateLicense = createAsyncThunk(
//   "license/generateLicense",
//   async (data, { rejectWithValue }) => {
//     try {
//       console.log("Generate license payload:", JSON.stringify(data, null, 2));
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
//       console.error("Generate license error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const getLicenses = createAsyncThunk(
//   "license/getLicenses",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/License/getAll`);
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to fetch licenses";
//       console.error("Fetch licenses error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const validateLicense = createAsyncThunk(
//   "license/validateLicense",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/validate`,
//         { id },
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
//       console.error("Validate license error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const exportLicense = createAsyncThunk(
//   "license/exportLicense",
//   async (companyId, { rejectWithValue }) => {
//     if (!companyId) {
//       const errorMessage = "Company ID is undefined";
//       console.error("Export license error:", { message: errorMessage });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }

//     const url = `${API_URL}/License/export/${companyId}`;
//     try {
//       console.log("Exporting license, requesting:", url);
//       const response = await axios.get(url, {
//         headers: { "Content-Type": "application/json" },
//         responseType: "blob", // Expect a file/blob response
//       });
//       toast.success("License export initiated!");
//       return response.data; // Returns Blob for download
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to export license";
//       console.error("Export license error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         url,
//       });
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const checkExpiry = createAsyncThunk(
//   "license/checkExpiry",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${API_URL}/License/check-expiry`, {
//         headers: { "Content-Type": "application/json" },
//       });
//       // toast.success("Expiry checked successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to check expiry";
//       console.error("Check expiry error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });

//       // toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const getPublicKey = createAsyncThunk(
//   "license/getPublicKey",
//   async (companyId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${API_URL}/License/public-key/${companyId}`,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       // toast.success("Public key retrieved successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to get public key";
//       console.error("Get public key error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       // toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const importByPublicKey = createAsyncThunk(
//   "license/importByPublicKey",
//   async (data, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/License/by-public-key`,
//         data,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       // toast.success("License imported successfully!");
//       return response.data;
//     } catch (err) {
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Failed to import license";
//       console.error("Import license error:", {
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       // toast.error(errorMessage);
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
//       .addCase(getLicenses.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(getLicenses.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.licenses = Array.isArray(action.payload) ? action.payload : [];
//       })
//       .addCase(getLicenses.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//         state.licenses = [];
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
//         console.log("checkExpiry payload:", action.payload); // Debug log
//         let expiryData = [];
//         if (Array.isArray(action.payload)) {
//           expiryData = action.payload;
//         } else if (action.payload && typeof action.payload === "object") {
//           expiryData = [action.payload];
//         } else {
//           console.warn(
//             "Unexpected checkExpiry payload, skipping update:",
//             action.payload
//           );
//           return;
//         }
//         state.licenses = state.licenses.map((license) =>
//           expiryData.some(
//             (exp) => exp.companyProductID === license.companyProductID
//           )
//             ? {
//                 ...license,
//                 isExpired:
//                   expiryData.find(
//                     (exp) => exp.companyProductID === license.companyProductID
//                   ).isExpired || false,
//               }
//             : license
//         );
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

// export const { clearError, exportSuccess } = licenseSlice.actions;
// export default licenseSlice.reducer;
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import { toast } from "react-toastify";
// // import axios from "axios";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

// // export const generateLicense = createAsyncThunk(
// //   "license/generateLicense",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       console.log("Generate license payload:", JSON.stringify(data, null, 2));
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
// //       console.error("Generate license error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const getLicenses = createAsyncThunk(
// //   "license/getLicenses",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/License/getAll`); // Updated to match Swagger
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to fetch licenses";
// //       console.error("Fetch licenses error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const validateLicense = createAsyncThunk(
// //   "license/validateLicense",
// //   async (id, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/License/validate`,
// //         { id },
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
// //       console.error("Validate license error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const exportLicense = createAsyncThunk(
// //   "license/exportLicense",
// //   async (companyId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/License/export/${companyId}`,
// //         {
// //           headers: { "Content-Type": "application/json" },
// //         }
// //       );
// //       toast.success("License export initiated!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to export license";
// //       console.error("Export license error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const checkExpiry = createAsyncThunk(
// //   "license/checkExpiry",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(`${API_URL}/License/check-expiry`, {
// //         headers: { "Content-Type": "application/json" },
// //       });
// //       toast.success("Expiry checked successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to check expiry";
// //       console.error("Check expiry error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const getPublicKey = createAsyncThunk(
// //   "license/getPublicKey",
// //   async (companyId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(
// //         `${API_URL}/License/public-key/${companyId}`,
// //         {
// //           headers: { "Content-Type": "application/json" },
// //         }
// //       );
// //       toast.success("Public key retrieved successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to get public key";
// //       console.error("Get public key error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
// //       toast.error(errorMessage);
// //       return rejectWithValue(errorMessage);
// //     }
// //   }
// // );

// // export const importByPublicKey = createAsyncThunk(
// //   "license/importByPublicKey",
// //   async (data, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.post(
// //         `${API_URL}/License/by-public-key`,
// //         data,
// //         {
// //           headers: { "Content-Type": "application/json" },
// //         }
// //       );
// //       toast.success("License imported successfully!");
// //       return response.data;
// //     } catch (err) {
// //       const errorMessage =
// //         err.response?.data?.message ||
// //         err.response?.data ||
// //         err.message ||
// //         "Failed to import license";
// //       console.error("Import license error:", {
// //         status: err.response?.status,
// //         data: err.response?.data,
// //       });
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
// //       .addCase(getLicenses.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(getLicenses.fulfilled, (state, action) => {
// //         state.status = "succeeded";
// //         state.licenses = Array.isArray(action.payload) ? action.payload : [];
// //       })
// //       .addCase(getLicenses.rejected, (state, action) => {
// //         state.status = "failed";
// //         state.error = action.payload;
// //         state.licenses = [];
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
// //         // Update licenses with expiry status if needed
// //         state.licenses = state.licenses.map((license) =>
// //           action.payload.some(
// //             (exp) => exp.companyProductID === license.companyProductID
// //           )
// //             ? {
// //                 ...license,
// //                 isExpired: action.payload.find(
// //                   (exp) => exp.companyProductID === license.companyProductID
// //                 ).isExpired,
// //               }
// //             : license
// //         );
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

// // export const { clearError, exportSuccess } = licenseSlice.actions;
// // export default licenseSlice.reducer;

// // // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // // import { toast } from "react-toastify";
// // // import axios from "axios";
// // // import CryptoJS from "crypto-js";

// // // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";
// // // const ENCRYPTION_KEY =
// // //   process.env.REACT_APP_ENCRYPTION_KEY ||
// // //   "default-secret-key-32-characters-long"; // Must be 32 chars for AES-256

// // // export const generateLicense = createAsyncThunk(
// // //   "license/generateLicense",
// // //   async (data, { rejectWithValue }) => {
// // //     try {
// // //       // Combine all data into a single string for uniqueness
// // //       const dataString = `${data.companyProductID}-${data.expiryDate}-${data.noOfDevice}-${data.noOfUser}-${data.licenseType}`;
// // //       // Generate a unique hash (SHA-256) as the license base
// // //       const licenseHash = CryptoJS.SHA256(dataString).toString(
// // //         CryptoJS.enc.Hex
// // //       );

// // //       // Encrypt the data object
// // //       const encryptedData = CryptoJS.AES.encrypt(
// // //         JSON.stringify(data),
// // //         ENCRYPTION_KEY
// // //       ).toString();

// // //       // Prepare payload with hash and encrypted data
// // //       const payload = {
// // //         licenseKey: licenseHash, // Unique identifier
// // //         encryptedData: encryptedData, // Encrypted license details
// // //       };

// // //       console.log(
// // //         "Generate license payload:",
// // //         JSON.stringify(payload, null, 2)
// // //       );

// // //       const response = await axios.post(
// // //         `${API_URL}/License/generate`,
// // //         payload,
// // //         {
// // //           headers: { "Content-Type": "application/json" },
// // //         }
// // //       );
// // //       toast.success("License generated successfully!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to generate license (check server connection)";
// // //       console.error("Generate license error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const getLicenses = createAsyncThunk(
// // //   "license/getLicenses",
// // //   async (_, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/License`, {
// // //         headers: { "Content-Type": "application/json" },
// // //       });
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to fetch licenses (check server connection)";
// // //       console.error("Fetch licenses error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const validateLicense = createAsyncThunk(
// // //   "license/validateLicense",
// // //   async (id, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.post(
// // //         `${API_URL}/License/validate`,
// // //         { id },
// // //         {
// // //           headers: { "Content-Type": "application/json" },
// // //         }
// // //       );
// // //       toast.success("License validated successfully!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to validate license (check server connection)";
// // //       console.error("Validate license error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const exportLicense = createAsyncThunk(
// // //   "license/exportLicense",
// // //   async (companyId, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.get(
// // //         `${API_URL}/License/export/${companyId}`,
// // //         {
// // //           headers: { "Content-Type": "application/json" },
// // //         }
// // //       );
// // //       toast.success("License export initiated!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to export license (check server connection)";
// // //       console.error("Export license error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const checkExpiry = createAsyncThunk(
// // //   "license/checkExpiry",
// // //   async (_, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.get(`${API_URL}/License/check-expiry`, {
// // //         headers: { "Content-Type": "application/json" },
// // //       });
// // //       toast.success("Expiry checked successfully!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to check expiry (check server connection)";
// // //       console.error("Check expiry error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const getPublicKey = createAsyncThunk(
// // //   "license/getPublicKey",
// // //   async (companyId, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.get(
// // //         `${API_URL}/License/public-key/${companyId}`,
// // //         {
// // //           headers: { "Content-Type": "application/json" },
// // //         }
// // //       );
// // //       toast.success("Public key retrieved successfully!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to get public key (check server connection)";
// // //       console.error("Get public key error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // export const importByPublicKey = createAsyncThunk(
// // //   "license/importByPublicKey",
// // //   async (data, { rejectWithValue }) => {
// // //     try {
// // //       const response = await axios.post(
// // //         `${API_URL}/License/by-public-key`,
// // //         data,
// // //         {
// // //           headers: { "Content-Type": "application/json" },
// // //         }
// // //       );
// // //       toast.success("License imported successfully!");
// // //       return response.data;
// // //     } catch (err) {
// // //       const errorMessage =
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Failed to import license (check server connection)";
// // //       console.error("Import license error:", {
// // //         status: err.response?.status,
// // //         data: err.response?.data,
// // //         message: err.message,
// // //       });
// // //       toast.error(errorMessage);
// // //       return rejectWithValue(errorMessage);
// // //     }
// // //   }
// // // );

// // // const licenseSlice = createSlice({
// // //   name: "license",
// // //   initialState: {
// // //     licenses: [],
// // //     status: "idle",
// // //     error: null,
// // //     exportData: null,
// // //     publicKey: null,
// // //   },
// // //   reducers: {
// // //     clearError: (state) => {
// // //       state.error = null;
// // //     },
// // //     exportSuccess: (state, action) => {
// // //       state.exportData = action.payload;
// // //     },
// // //   },
// // //   extraReducers: (builder) => {
// // //     builder
// // //       .addCase(generateLicense.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(generateLicense.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.licenses.push(action.payload);
// // //       })
// // //       .addCase(generateLicense.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       })
// // //       .addCase(getLicenses.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(getLicenses.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.licenses = Array.isArray(action.payload) ? action.payload : [];
// // //       })
// // //       .addCase(getLicenses.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //         state.licenses = [];
// // //       })
// // //       .addCase(validateLicense.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(validateLicense.fulfilled, (state) => {
// // //         state.status = "succeeded";
// // //       })
// // //       .addCase(validateLicense.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       })
// // //       .addCase(exportLicense.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(exportLicense.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.exportData = action.payload;
// // //       })
// // //       .addCase(exportLicense.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       })
// // //       .addCase(checkExpiry.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(checkExpiry.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.licenses = state.licenses.map((license) =>
// // //           action.payload.some(
// // //             (exp) => exp.companyProductID === license.companyProductID
// // //           )
// // //             ? {
// // //                 ...license,
// // //                 isExpired: action.payload.find(
// // //                   (exp) => exp.companyProductID === license.companyProductID
// // //                 ).isExpired,
// // //               }
// // //             : license
// // //         );
// // //       })
// // //       .addCase(checkExpiry.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       })
// // //       .addCase(getPublicKey.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(getPublicKey.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.publicKey = action.payload;
// // //       })
// // //       .addCase(getPublicKey.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       })
// // //       .addCase(importByPublicKey.pending, (state) => {
// // //         state.status = "loading";
// // //       })
// // //       .addCase(importByPublicKey.fulfilled, (state, action) => {
// // //         state.status = "succeeded";
// // //         state.licenses.push(action.payload);
// // //       })
// // //       .addCase(importByPublicKey.rejected, (state, action) => {
// // //         state.status = "failed";
// // //         state.error = action.payload;
// // //       });
// // //   },
// // // });

// // // export const { clearError, exportSuccess } = licenseSlice.actions;
// // // export default licenseSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.101:5212/api";

export const generateLicense = createAsyncThunk(
  "license/generateLicense",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Generate license payload:", JSON.stringify(data, null, 2));
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
      console.error("Generate license error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getLicenses = createAsyncThunk(
  "license/getLicenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/License/getAll`);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to fetch licenses";
      console.error("Fetch licenses error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const validateLicense = createAsyncThunk(
  "license/validateLicense",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/License/validate`,
        { id },
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
      console.error("Validate license error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const exportLicense = createAsyncThunk(
  "license/exportLicense",
  async (payload, { rejectWithValue }) => {
    if (!payload?.companyId) {
      const errorMessage = "Company ID is undefined";
      console.error("Export license error:", { message: errorMessage });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }

    const url = `${API_URL}/License/export/${payload.companyId}`;
    try {
      console.log("Exporting license, requesting:", url);
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
        responseType: "blob", // Expect a file/blob response
      });
      toast.success("License export initiated!");
      return response.data; // Returns Blob for download
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to export license";
      console.error("Export license error:", {
        status: err.response?.status,
        data: err.response?.data,
        url,
      });
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkExpiry = createAsyncThunk(
  "license/checkExpiry",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/License/check-expiry`, {
        headers: { "Content-Type": "application/json" },
      });
      // toast.success("Expiry checked successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to check expiry";
      console.error("Check expiry error:", {
        status: err.response?.status,
        data: err.response?.data,
      });

      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getPublicKey = createAsyncThunk(
  "license/getPublicKey",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/License/public-key/${companyId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // toast.success("Public key retrieved successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to get public key";
      console.error("Get public key error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      // toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const importByPublicKey = createAsyncThunk(
  "license/importByPublicKey",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/License/by-public-key`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // toast.success("License imported successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to import license";
      console.error("Import license error:", {
        status: err.response?.status,
        data: err.response?.data,
      });
      // toast.error(errorMessage);
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
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    exportSuccess: (state, action) => {
      state.exportData = action.payload;
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
      })
      .addCase(generateLicense.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getLicenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLicenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.licenses = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getLicenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.licenses = [];
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
        console.log("checkExpiry payload:", action.payload); // Debug log
        let expiryData = [];
        if (Array.isArray(action.payload)) {
          expiryData = action.payload;
        } else if (action.payload && typeof action.payload === "object") {
          expiryData = [action.payload];
        } else {
          console.warn(
            "Unexpected checkExpiry payload, skipping update:",
            action.payload
          );
          return;
        }
        state.licenses = state.licenses.map((license) =>
          expiryData.some(
            (exp) => exp.companyProductID === license.companyProductID
          )
            ? {
                ...license,
                isExpired:
                  expiryData.find(
                    (exp) => exp.companyProductID === license.companyProductID
                  ).isExpired || false,
              }
            : license
        );
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

export const { clearError, exportSuccess } = licenseSlice.actions;
export default licenseSlice.reducer;
