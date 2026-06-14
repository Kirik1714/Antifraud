import { getStableScore } from "./geoUtils";

export const buildClientsMap = (clients = []) => {
  const map = {};
  for (let i = 0; i < clients.length; i++) {
    map[clients[i].id] = clients[i];
  }
  return map;
};

export const extractFraudCases = (list = [], type) => {
  return list
    .filter((t) => t.status === "High Risk" || t.status === "Fraud")
    .map((t) => ({
      ...t,
      type, 
      stableScore: getStableScore(t.id, t.status),
    }));
};

/**
 * High-Performance Single-Pass Aggregator.
 * Loops through each array exactly ONCE to extract both monetary amounts and counters.
 * Reduces algorithmic complexity from O(9N) down to a pristine O(3N).
 */
export const aggregateDashboardMetrics = (withdraws = [], deposits = [], loans = []) => {
  const totalCount = withdraws.length + deposits.length + loans.length;

  let approvedCount = 0;
  let postponedCount = 0;
  let rejectedCount = 0;

  let totalWithdrawsAmount = 0;
  let totalDepositsAmount = 0;
  let totalLoansAmount = 0;

  // 1. Single pass for withdraws
  for (let i = 0; i < withdraws.length; i++) {
    const tx = withdraws[i];
    totalWithdrawsAmount += (tx.amount || 0);
    
    if (tx.status === "Approved") approvedCount++;
    else if (tx.status === "High Risk") postponedCount++;
    else if (tx.status === "Fraud" || tx.status === "Declined") rejectedCount++;
  }

  // 2. Single pass for deposits
  for (let i = 0; i < deposits.length; i++) {
    const tx = deposits[i];
    totalDepositsAmount += (tx.amount || 0);

    if (tx.status === "Approved") approvedCount++;
    else if (tx.status === "High Risk") postponedCount++;
    else if (tx.status === "Fraud" || tx.status === "Declined") rejectedCount++;
  }

  // 3. Single pass for loans
  for (let i = 0; i < loans.length; i++) {
    const tx = loans[i];
    totalLoansAmount += (tx.amount || 0);

    if (tx.status === "Approved") approvedCount++;
    else if (tx.status === "High Risk") postponedCount++;
    else if (tx.status === "Fraud" || tx.status === "Declined") rejectedCount++;
  }

  // Calculate remaining metrics using instant scalar math
  const pendingCount = totalCount - approvedCount - postponedCount - rejectedCount;
  const rate = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;
  
  return {
    totalCount,
    approvedCount,
    postponedCount,
    rejectedCount,
    pendingCount,
    approvalRatePercent: rate.toFixed(1),
    safePercentage: Math.round(rate),
    pieData: [
      { name: 'Deposits', value: totalDepositsAmount },    
      { name: 'Loans', value: totalLoansAmount },       
      { name: 'Withdrawals', value: totalWithdrawsAmount },  
    ],
  };
};