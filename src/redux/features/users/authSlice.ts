import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  role: string | null;
  email: string | null;
}

const initialState: AuthState = {
  role: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<{role: string; email: string}>) => {
      state.role = action.payload.role;
      state.email = action.payload.email;
    },

    clearUserRole(state) {
      state.role = null;
      state.email = null;
    },
  },
});

export const { setUserRole, clearUserRole } = authSlice.actions;

export default authSlice.reducer;
