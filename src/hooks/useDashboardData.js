import { useMemo } from "react";
import { useSelector } from "react-redux";
import { 
  useGetWithdrawTransactionsQuery, 
  useGetDepositTransactionsQuery, 
  useGetLoanTransactionsQuery 
} from "../features/clients/clientsSlice";
import { aggregateDashboardMetrics } from "../utils/transactionUtils";

export function useDashboardData() {
  // 1. Fetch background synchronized transactions ledger data
  const { isLoading: loadingWithdraws } = useGetWithdrawTransactionsQuery();
  const { isLoading: loadingDeposits } = useGetDepositTransactionsQuery();
  const { isLoading: loadingLoans } = useGetLoanTransactionsQuery();

  // 2. Select up-to-date transaction arrays from global Redux storage
  const withdraws = useSelector((state) => state.transactions.withdraws) || [];
  const deposits = useSelector((state) => state.transactions.deposits) || [];
  const loans = useSelector((state) => state.transactions.loans) || [];

  const isLoading = loadingWithdraws || loadingDeposits || loadingLoans;

  // 3. Compute entire analytical snapshot via unified utility pipeline.
  // Performance stays pristine: recalculates ONLY if a core Redux array reference changes.
  const metrics = useMemo(
    () => aggregateDashboardMetrics(withdraws, deposits, loans),
    [withdraws, deposits, loans]
  );

  return {
    isLoading,
    ...metrics // Spreads all calculated numbers and pieData smoothly into the page component
  };
}