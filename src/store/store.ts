import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import filtersReducer from '../slices/ComponentsListSlice';
import cartReducer from "../slices/cartSlice";
import powerReducer from "../slices/powerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    filters: filtersReducer,
    cart: cartReducer,
    power: powerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  