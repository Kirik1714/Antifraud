import { baseApi } from "../../core/api/baseApi";

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: ({ limit = 10, skip = 0 }) => `/users?limit=${limit}&skip=${skip}`,
      providesTags: ["User"],
    }),

    getSingleClient: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getWithdrawTransactions: builder.query({
      query: () => "/carts",
      transformResponse: (response) => {
        return response.carts.map((cart) => {
          let status = "Approved";
          if (cart.total > 2000) {
            status = "Fraud"; 
          } else if (cart.total > 800) {
            status = "High Risk"; 
          }

          return {
            id: `TX-WID${cart.id}`,
            clientId: cart.userId,
            amount: cart.total, 
            totalProducts: cart.totalProducts,
            status: status,
            date: "2026-05-27 15:40", 
            method: cart.id % 2 === 0 ? "Visa / Mastercard" : "Wire Transfer",
          };
        });
      },
      providesTags: ["Transactions"],
    }),
    getDepositTransactions: builder.query({
      query: () => "/products?limit=15",
      transformResponse: (response) => {
        return response.products.map((item) => ({
          id: `TX-DEP${item.id}`,
          clientId: (item.id % 10) + 1, 
          amount: item.price * 5, 
          method: item.id % 2 === 0 ? "ATM Deposit" : "ACH Transfer",
          status: "Approved",
          date: "2026-05-27 12:15",
        }));
      },
      providesTags: ["Transactions"],
    }),
    getLoanTransactions: builder.query({
      query: () => "/quotes?limit=10",
      transformResponse: (response) => {
        return response.quotes.map((quote) => {
          const loanAmount = quote.id * 1200;
          let status = "Approved";
          if (loanAmount > 25000) status = "Fraud";
          else if (loanAmount > 10000) status = "High Risk";

          return {
            id: `TX-LON${quote.id}`,
            clientId: (quote.id % 10) + 1,
            amount: loanAmount,
            method: quote.id % 2 === 0 ? "Personal Loan" : "Mortgage",
            status: status,
            date: "2026-05-26 10:00",
          };
        });
      },
      providesTags: ["Transactions"],
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ id, type, status }) => ({
        url: `/transactions/${type.toLowerCase()}s/${id}`,
        method: 'PATCH',
        body: { status }, 
      }),
      invalidatesTags: ['Transactions'], 
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetSingleClientQuery,
  useGetWithdrawTransactionsQuery,
  useGetDepositTransactionsQuery,
  useGetLoanTransactionsQuery,
  useUpdateTransactionStatusMutation,
} = clientsApi;

export default clientsApi.reducer;
