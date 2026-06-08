import { createSlice } from "@reduxjs/toolkit";
import { clientsApi } from "../clients/clientsSlice"; 

const loadStoredStatuses = () => {
  try {
    const stored = localStorage.getItem("fraud_management_statuses");
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
};


const saveStatusToStorage = (id, status) => {
  try {
    const current = loadStoredStatuses();
    current[id] = status;
    localStorage.setItem("fraud_management_statuses", JSON.stringify(current));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}; 

const initialState = {
  withdraws: [],
  deposits: [],
  loans: [],
  clients: [],
  isInitialized: false,
};


const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Manually forces a status rewrite inside the Redux memory maps and local storage
    updateStatusGlobally: (state, action) => {
      const { id, type, newStatus } = action.payload;
      saveStatusToStorage(id, newStatus);

      if (type === "Withdraw") {
        state.withdraws = state.withdraws.map((t) => t.id === id ? { ...t, status: newStatus } : t);
      } else if (type === "Deposit") {
        state.deposits = state.deposits.map((t) => t.id === id ? { ...t, status: newStatus } : t);
      } else if (type === "Loan") {
        state.loans = state.loans.map((t) => t.id === id ? { ...t, status: newStatus } : t);
      }
    },

    // Handles client balance updates during automated fraud reversals
    updateClientBalanceGlobally: (state, action) => {
      const { clientId, amount } = action.payload;
      state.clients = state.clients.map((client) => 
        client.id === clientId 
          ? { ...client, bankAccountBalance: (client.bankAccountBalance || 43601.95) + amount }
          : client
      );
    }
  }, 
  
  // Intercept layer: listens to incoming RTK Query payloads before they reach presentational nodes
  extraReducers: (builder) => {
    builder
      // Intercepts resolved withdrawals stream and injects disk-stored manual status overrides
      .addMatcher(
        clientsApi.endpoints.getWithdrawTransactions.matchFulfilled,
        (state, action) => {
          const savedStatuses = loadStoredStatuses();
          state.withdraws = action.payload.map(tx => ({
            ...tx,
            status: savedStatuses[tx.id] ? savedStatuses[tx.id] : tx.status
          }));
        }
      )
      // Intercepts resolved deposits stream and injects disk-stored manual status overrides
      .addMatcher(
        clientsApi.endpoints.getDepositTransactions.matchFulfilled,
        (state, action) => {
          const savedStatuses = loadStoredStatuses();
          state.deposits = action.payload.map(tx => ({
            ...tx,
            status: savedStatuses[tx.id] ? savedStatuses[tx.id] : tx.status
          }));
        }
      )
      // Intercepts resolved loans stream and injects disk-stored manual status overrides
      .addMatcher(
        clientsApi.endpoints.getLoanTransactions.matchFulfilled,
        (state, action) => {
          const savedStatuses = loadStoredStatuses();
          state.loans = action.payload.map(tx => ({
            ...tx,
            status: savedStatuses[tx.id] ? savedStatuses[tx.id] : tx.status
          }));
        }
      )
      // Caches primary client directory lists inside local store partitions once upon application launch
      .addMatcher(
        clientsApi.endpoints.getClients.matchFulfilled,
        (state, action) => {
          if (state.clients.length === 0) {
            state.clients = action.payload.users || [];
            state.isInitialized = true;
          }
        }
      )
      // Monitors active server mutations to append analyst decisions onto the local storage ledger
      .addMatcher(
        clientsApi.endpoints.updateTransactionStatus.matchFulfilled,
        (state, action) => {
          const { id, type, status } = action.meta.arg; // Extract original arguments sent during the dispatch trigger
          
          saveStatusToStorage(id, status);

          if (type === "Withdraw") {
            state.withdraws = state.withdraws.map((t) => t.id === id ? { ...t, status } : t);
          } else if (type === "Deposit") {
            state.deposits = state.deposits.map((t) => t.id === id ? { ...t, status } : t);
          } else if (type === "Loan") {
            state.loans = state.loans.map((t) => t.id === id ? { ...t, status } : t);
          }
        }
      );
  }
});

export const { updateStatusGlobally, updateClientBalanceGlobally } = transactionsSlice.actions;
export default transactionsSlice.reducer;