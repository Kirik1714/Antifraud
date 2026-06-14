import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../core/api/baseApi';
import authReducer from '../features/auth/authSlice';
import  clientsReducer  from '../features/clients/clientsSlice';
import transactionsReducer from "../features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    // Dynamically mounts the RTK Query caching layer state tree (default key: "api")
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    clients:clientsReducer,
    transactions: transactionsReducer,
  },
  //  Middleware Pipeline Augmentation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware), //"It hooks up automatic background refetching and tag invalidation so the app data stays synchronized in real-time.
});