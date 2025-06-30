import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5212/api";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Product`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch products");
      return rejectWithValue(err.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Product/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch product");
      return rejectWithValue(err.message);
    }
  }
);

export const getProductsByName = createAsyncThunk(
  "product/getProductsByName",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Product/name/${name}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      toast.error("Failed to fetch products by name");
      return rejectWithValue(err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/Product`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product created successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to create product");
      return rejectWithValue(err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/Product/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product updated successfully!");
      return response.data;
    } catch (err) {
      toast.error("Failed to update product");
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/Product/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product deleted successfully!");
      return id;
    } catch (err) {
      toast.error("Failed to delete product");
      return rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.productID === action.payload.productID
        );
        if (index !== -1) state.products[index] = action.payload;
        else state.products.push(action.payload);
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.productID === action.payload.productID
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.productID !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
