import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/features/authSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});