import { useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetWithdrawTransactionsQuery, 
  useGetDepositTransactionsQuery, 
  useGetLoanTransactionsQuery 
} from "../features/clients/clientsSlice";


export function useDashboardData() {
  // Trigger background data synchronization queries for all transaction categories
  const { isLoading: loadingWithdraws } = useGetWithdrawTransactionsQuery();
  const { isLoading: loadingDeposits } = useGetDepositTransactionsQuery();
  const { isLoading: loadingLoans } = useGetLoanTransactionsQuery();

  // Select real-time transaction arrays from global Redux storage
  const withdraws = useSelector((state) => state.transactions.withdraws) || [];
  const deposits = useSelector((state) => state.transactions.deposits) || [];
  const loans = useSelector((state) => state.transactions.loans) || [];

  // Unified loading state indicator across all active HTTP requests
  const isLoading = loadingWithdraws || loadingDeposits || loadingLoans;

  // Flatten all operational flows into a singular dataset array
  const allTransactions = useMemo(() => [...withdraws, ...deposits, ...loans], [withdraws, deposits, loans]);
  const totalCount = allTransactions.length;
  
  // Calculate specific totals based on risk status categorization rules
  const approvedCount = useMemo(() => allTransactions.filter(tx => tx.status === "Approved").length, [allTransactions]);
  const postponedCount = useMemo(() => allTransactions.filter(tx => tx.status === "High Risk").length, [allTransactions]);
  const rejectedCount = useMemo(() => allTransactions.filter(tx => tx.status === "Fraud").length, [allTransactions]);
  
  // Deduct classified counts to find items remaining in the unreviewed processing state
  const pendingCount = totalCount - approvedCount - postponedCount - rejectedCount;

  // Compute percentage ratio of seamless approvals formatted to 1 decimal point
  const approvalRatePercent = useMemo(() => totalCount > 0 
    ? ((approvedCount / totalCount) * 100).toFixed(1) 
    : "0.0", [approvedCount, totalCount]);

  // Round the safe operational percentage value specifically for the circular graph chart node
  const safePercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  // Aggregate global financial volumes across independent business domains via array reducers
  const totalDepositsAmount = useMemo(() => deposits.reduce((sum, tx) => sum + (tx.amount || 0), 0), [deposits]);
  const totalLoansAmount = useMemo(() => loans.reduce((sum, tx) => sum + (tx.amount || 0), 0), [loans]);
  const totalWithdrawsAmount = useMemo(() => withdraws.reduce((sum, tx) => sum + (tx.amount || 0), 0), [withdraws]);

  // Restructure calculated financial volumes into chart-friendly formats
  const pieData = useMemo(() => [
    { name: 'Deposits', value: totalDepositsAmount },    
    { name: 'Loans', value: totalLoansAmount },       
    { name: 'Withdrawals', value: totalWithdrawsAmount },  
  ], [totalDepositsAmount, totalLoansAmount, totalWithdrawsAmount]);

  return {
    isLoading,
    totalCount,
    approvedCount,
    postponedCount,
    rejectedCount,
    pendingCount,
    approvalRatePercent,
    safePercentage,
    pieData
  };
}