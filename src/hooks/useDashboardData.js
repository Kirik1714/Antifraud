import { useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetWithdrawTransactionsQuery, 
  useGetDepositTransactionsQuery, 
  useGetLoanTransactionsQuery 
} from "../features/clients/clientsSlice";

export function useDashboardData() {
  const { isLoading: loadingWithdraws } = useGetWithdrawTransactionsQuery();
  const { isLoading: loadingDeposits } = useGetDepositTransactionsQuery();
  const { isLoading: loadingLoans } = useGetLoanTransactionsQuery();

  const withdraws = useSelector((state) => state.transactions.withdraws) || [];
  const deposits = useSelector((state) => state.transactions.deposits) || [];
  const loans = useSelector((state) => state.transactions.loans) || [];

  const isLoading = loadingWithdraws || loadingDeposits || loadingLoans;

  const allTransactions = useMemo(() => [...withdraws, ...deposits, ...loans], [withdraws, deposits, loans]);
  const totalCount = allTransactions.length;
  
  const approvedCount = useMemo(() => allTransactions.filter(tx => tx.status === "Approved").length, [allTransactions]);
  const postponedCount = useMemo(() => allTransactions.filter(tx => tx.status === "High Risk").length, [allTransactions]);
  const rejectedCount = useMemo(() => allTransactions.filter(tx => tx.status === "Fraud").length, [allTransactions]);
  const pendingCount = totalCount - approvedCount - postponedCount - rejectedCount;

  const approvalRatePercent = useMemo(() => totalCount > 0 
    ? ((approvedCount / totalCount) * 100).toFixed(1) 
    : "0.0", [approvedCount, totalCount]);

  const safePercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const totalDepositsAmount = useMemo(() => deposits.reduce((sum, tx) => sum + (tx.amount || 0), 0), [deposits]);
  const totalLoansAmount = useMemo(() => loans.reduce((sum, tx) => sum + (tx.amount || 0), 0), [loans]);
  const totalWithdrawsAmount = useMemo(() => withdraws.reduce((sum, tx) => sum + (tx.amount || 0), 0), [withdraws]);

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