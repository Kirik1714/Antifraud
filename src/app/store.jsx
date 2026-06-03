import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../core/api/baseApi';
import authReducer from '../features/auth/authSlice';
import  clientsReducer  from '../features/clients/clientsSlice';
import transactionsReducer from "../features/transactions/transactionsSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    clients:clientsReducer,
    transactions: transactionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});