import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


items: Array<{
  componentId: number;
  powerId: number;
  quantity: number;
}>

//interface CartItem {
//  componentId: number;
//  powerId: number;
//  quantity: number;
//}

interface CartState {
  draftId: number | null;
  componentsCount: number;
}

const initialState: CartState = {
  draftId: null,
  componentsCount: 0,
};

export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const res = await axios.get(`${API_URL}/powers/cart`, {
      withCredentials: true,
    });

    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.draftId = null;
      state.componentsCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
  console.log("CART SLICE:", action.payload);

  state.draftId = action.payload.draftId;
  state.componentsCount = action.payload.componentsCount;
});

    builder.addCase(fetchCartAsync.rejected, (state) => {
      state.draftId = null;
      state.componentsCount = 0;
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;