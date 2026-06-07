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

    updateClientBalanceGlobally: (state, action) => {
      const { clientId, amount } = action.payload;
      state.clients = state.clients.map((client) => 
        client.id === clientId 
          ? { ...client, bankAccountBalance: (client.bankAccountBalance || 43601.95) + amount }
          : client
      );
    }
  },
  
  extraReducers: (builder) => {
    builder
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
      .addMatcher(
        clientsApi.endpoints.getClients.matchFulfilled,
        (state, action) => {
          if (state.clients.length === 0) {
            state.clients = action.payload.users || [];
            state.isInitialized = true;
          }
        }
      )
      .addMatcher(
        clientsApi.endpoints.updateTransactionStatus.matchFulfilled,
        (state, action) => {
          const { id, type, status } = action.meta.arg; 
          
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