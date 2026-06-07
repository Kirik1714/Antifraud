import { createSlice } from '@reduxjs/toolkit';
import { baseApi } from '../../core/api/baseApi';

const initialState = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.accessToken; 
        state.user = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          username: payload.username,
          image: payload.image,
        };
        state.isAuthenticated = true;

        localStorage.setItem('token', payload.accessToken);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    );

    builder.addMatcher(
      authApi.endpoints.register.matchFulfilled,
      (state, { payload }) => {
      
        state.token = "fake-token";
        
        const [firstName, ...lastNameParts] = payload.firstName.split(' ');
        const lastName = lastNameParts.join(' ') || 'Analyst';

        state.user = {
          firstName: firstName,
          lastName: lastName,
          username: payload.username,
          image: "https://dummyjson.com/icon/emilys/120", 
        };
        state.isAuthenticated = true;

        localStorage.setItem('token', state.token);
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    );
  },
});


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: credentials, 
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/add',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: userData, 
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
export const { logout } = authSlice.actions;
export default authSlice.reducer;