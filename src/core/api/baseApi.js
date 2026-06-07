import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
    
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
 tagTypes: ['Transactions', 'Clients'],
  endpoints: () => ({}), 
});