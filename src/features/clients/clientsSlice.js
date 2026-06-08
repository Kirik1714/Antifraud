import { baseApi } from "../../core/api/baseApi";


export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Fetches a paginated slice of global user profiles
    getClients: builder.query({
      query: ({ limit = 10, skip = 0 }) => `/users?limit=${limit}&skip=${skip}`,
      providesTags: ["Clients"], // Cache identifier for automatic refetch triggers
    }),

    // Fetches details for a single targeted user entity
    getSingleClient: builder.query({
      query: (id) => `/users/${id}`,
      // Advanced cache invalidation binding an implicit type ID signature
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),

    // Fetches sync data from /carts to simulate a stream of withdrawal events
    getWithdrawTransactions: builder.query({ 
      query: () => "/carts",
      transformResponse: (response) => {
        // Hydrate and transform raw cart items into financial withdrawal models
        return response.carts.map((cart) => {
          let status = "Approved";
          // Risk engine rule parameters determined at runtime based on balance volume
          if (cart.total > 2000) status = "Fraud"; 
          else if (cart.total > 800) status = "High Risk"; 

          return {
            id: `TX-WID${cart.id}`, // Custom pseudo-unique transaction prefix
            clientId: cart.userId,
            amount: cart.total, 
            totalProducts: cart.totalProducts,
            status: status,
            date: "2026-05-27 15:40", 
            method: cart.id % 2 === 0 ? "Visa / Mastercard" : "Wire Transfer",
          };
        });
      },
      providesTags: ["Transactions"], // Attached to global transaction invalidation channel
    }),

    // Fetches data from /products to simulate a stream of deposit events
    getDepositTransactions: builder.query({
      query: () => "/products?limit=15",
      transformResponse: (response) => {
        // Maps physical product metrics directly into monetary cash inflows
        return response.products.map((item) => ({
          id: `TX-DEP${item.id}`,
          clientId: (item.id % 10) + 1, // Deterministic client distribution math
          amount: item.price * 5, 
          method: item.id % 2 === 0 ? "ATM Deposit" : "ACH Transfer",
          status: "Approved",
          date: "2026-05-27 12:15",
        }));
      },
      providesTags: ["Transactions"],
    }),

    // Fetches data from /quotes to simulate credit line extensions (loans)
    getLoanTransactions: builder.query({
      query: () => "/quotes?limit=10",
      transformResponse: (response) => {
        // Translates mock quote IDs into structured synthetic lending profiles
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

    // Handles analyst review state patches ('Approved' / 'Declined')
    updateTransactionStatus: builder.mutation({
      query: ({ id, type, status }) => ({
        url: `/transactions/${type.toLowerCase()}s/${id}`,
        method: 'PATCH',
        body: { status }, 
      }),
      // Evicts transaction caches, forcing active queries to reload fresh datasets
      invalidatesTags: ['Transactions'], 
    }),
  }),
});

// Auto-generated runtime hooks bound directly to React presentation tree nodes
export const {
  useGetClientsQuery,
  useGetSingleClientQuery,
  useGetWithdrawTransactionsQuery,
  useGetDepositTransactionsQuery,
  useGetLoanTransactionsQuery,
  useUpdateTransactionStatusMutation,
} = clientsApi;

export default clientsApi.reducer;