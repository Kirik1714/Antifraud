import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetDepositTransactionsQuery,
  useGetWithdrawTransactionsQuery,
  useGetLoanTransactionsQuery,
} from "../../features/clients/clientsSlice";
import { calculateClientBalances, mergeAndLabelTransactions } from "../../utils/clientsUtils";

export function useClientTransactions(searchTerm, paginationSkip, pageSize) {
  // Sync background caches via RTK Query
  useGetDepositTransactionsQuery();
  useGetWithdrawTransactionsQuery();
  useGetLoanTransactionsQuery();

  // Extract raw logs from global Redux store
  const transactionsState = useSelector((state) => state.transactions);
  const allWithdraws = useMemo(() => transactionsState?.withdraws || [], [transactionsState]);
  const allDeposits = useMemo(() => transactionsState?.deposits || [], [transactionsState]);
  const allLoans = useMemo(() => transactionsState?.loans || [], [transactionsState]);

  // Fire our new utility tracker to build the O(1) balance dictionary map
  const balanceMap = useMemo(() => {
    return calculateClientBalances(allDeposits, allLoans, allWithdraws);
  }, [allDeposits, allLoans, allWithdraws]);

  const cleanSearchTerm = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);

  // Reusable pipeline matrix: filters a stream by search matches and slices it for active pages
  const processTableDataStream = (streamData) => {
    const filtered = streamData.filter(tx => 
      String(tx.id).toLowerCase().includes(cleanSearchTerm) || 
      `user #${tx.clientId}`.toLowerCase().includes(cleanSearchTerm)
    );
    return { 
      items: filtered.slice(paginationSkip, paginationSkip + pageSize), 
      total: filtered.length 
    };
  };

  const paginatedDeposits = useMemo(() => processTableDataStream(allDeposits), [allDeposits, paginationSkip, pageSize, cleanSearchTerm]);
  const paginatedWithdraws = useMemo(() => processTableDataStream(allWithdraws), [allWithdraws, paginationSkip, pageSize, cleanSearchTerm]);
  const paginatedLoans = useMemo(() => processTableDataStream(allLoans), [allLoans, paginationSkip, pageSize, cleanSearchTerm]);

  // Dynamic history merger utility call
  const masterCombinedHistory = useMemo(() => {
    return mergeAndLabelTransactions(allDeposits, allWithdraws, allLoans);
  }, [allDeposits, allWithdraws, allLoans]);

  const paginatedHistory = useMemo(() => processTableDataStream(masterCombinedHistory), [masterCombinedHistory, paginationSkip, pageSize, cleanSearchTerm]);

  return {
    balanceMap,
    paginatedDeposits,
    paginatedWithdraws,
    paginatedLoans,
    paginatedHistory,
  };
}