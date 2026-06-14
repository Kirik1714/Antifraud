/**
 * Computes a real-time balance lookup map for all banking clients.
 * Sums up 'Approved' deposits and loans, and subtracts approved withdrawals.
 */
export const calculateClientBalances = (deposits = [], loans = [], withdraws = []) => {
  const balanceMap = {};

  // 1. Process Deposits (+)
  for (let i = 0; i < deposits.length; i++) {
    const tx = deposits[i];
    if (tx.status === "Approved") {
      balanceMap[tx.clientId] = (balanceMap[tx.clientId] || 0) + Number(tx.amount || 0);
    }
  }

  // 2. Process Loans (+)
  for (let i = 0; i < loans.length; i++) {
    const tx = loans[i];
    if (tx.status === "Approved") {
      balanceMap[tx.clientId] = (balanceMap[tx.clientId] || 0) + Number(tx.amount || 0);
    }
  }

  // 3. Process Withdrawals (-)
  for (let i = 0; i < withdraws.length; i++) {
    const tx = withdraws[i];
    if (tx.status === "Approved") {
      balanceMap[tx.clientId] = (balanceMap[tx.clientId] || 0) - Number(tx.amount || 0);
    }
  }

  return balanceMap;
};

/**
 * Merges independent transaction streams into a unified history log array
 * and injects an explicit operation type indicator field.
 */
export const mergeAndLabelTransactions = (deposits = [], withdraws = [], loans = []) => {
  const combinedHistory = [];

  for (let i = 0; i < deposits.length; i++) {
    combinedHistory.push({ ...deposits[i], operationType: 'Deposit' });
  }
  for (let i = 0; i < withdraws.length; i++) {
    combinedHistory.push({ ...withdraws[i], operationType: 'Withdraw' });
  }
  for (let i = 0; i < loans.length; i++) {
    combinedHistory.push({ ...loans[i], operationType: 'Loan' });
  }

  return combinedHistory;
};

export const getSearchPlaceholder = (activeTab) => {
  switch (activeTab) {
    case "Clients":
      return "Search by name or city...";
    case "Deposit":
    case "Withdraw":
    case "Loans":
      return "Search by TX ID or Client ID...";
    case "Transaction History":
      return "Search history by ID...";
    default:
      return "Search...";
  }
};