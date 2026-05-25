import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";

interface UserState {
  login: string | null;
  fullName: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem("user");

const parsedUser = savedUser ? JSON.parse(savedUser) : null;

const initialState: UserState = {
  login: parsedUser?.login ?? null,
  fullName: parsedUser?.fullName ?? null,
  role: parsedUser?.role ?? "guest",
  isAuthenticated: !!parsedUser?.login,
};



const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    setUser: (
        state,
        action: PayloadAction<{
            login: string;
            fullName: string;
            role: string;
        }>
        ) => {
        state.login = action.payload.login;
        state.fullName = action.payload.fullName;
        state.role = action.payload.role;
        state.isAuthenticated = true;

        localStorage.setItem("user", JSON.stringify(action.payload));
        },

    clearUser: (state) => {
      state.login = null;
      state.fullName = null;
      state.role = "guest";
      state.isAuthenticated = false;

      localStorage.removeItem("user");
    },
    
  },
  

});




export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;