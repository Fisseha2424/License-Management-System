import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "axios";

// Base URL for API (updated for IIS on port 5001)
const API_URL =
  process.env.REACT_APP_API_URL || "http://192.168.1.101:5212/api";

export const getLicenses = createAsyncThunk(
  "dashboard/getLicenses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/License/check-expiry`);
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch licenses");
      return rejectWithValue(err.message);
    }
  }
);

export const getSessions = createAsyncThunk(
  "dashboard/getSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Session`); // Adjust endpoint if needed
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch sessions");
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    licenses: [],
    sessions: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(getSessions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.sessions = [];
      });
  },
});

export default dashboardSlice.reducer;
