import { configureStore } from '@reduxjs/toolkit';
import { alertSlice } from './features/auth/alertSlice';
import { authSlice } from './features/auth/authSlice';

export default configureStore({
    reducer: {
        alerts: alertSlice.reducer,
        auth: authSlice.reducer,
    },
});