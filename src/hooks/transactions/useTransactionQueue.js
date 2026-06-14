import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  useGetWithdrawTransactionsQuery,
  useGetDepositTransactionsQuery,
  useGetLoanTransactionsQuery,
  useGetClientsQuery,
} from "../../features/clients/clientsSlice";
import { buildClientsMap, extractFraudCases } from "../../utils/transactionUtils";

export function useTransactionQueue() {
  useGetWithdrawTransactionsQuery();
  useGetDepositTransactionsQuery();
  useGetLoanTransactionsQuery();
  useGetClientsQuery({ limit: 100, skip: 0 });

  // 2. Get fresh data arrays from Redux store
  const { withdraws, deposits, loans, clients, isInitialized } = useSelector(
    (state) => state.transactions
  );

  //  Cache the clients lookup map 
  const clientsMap = useMemo(() => buildClientsMap(clients), [clients]);

  // 4. Isolate streams: Each array filters separately using the imported helper.

  const fraudWithdraws = useMemo(() => extractFraudCases(withdraws, "Withdraw"), [withdraws]);
  const fraudDeposits = useMemo(() => extractFraudCases(deposits, "Deposit"), [deposits]);
  const fraudLoans = useMemo(() => extractFraudCases(loans, "Loan"), [loans]);

  // 5. Final merge: Fast and lightweight glue operation
  const allCases = useMemo(() => {
    return [...fraudWithdraws, ...fraudDeposits, ...fraudLoans];
  }, [fraudWithdraws, fraudDeposits, fraudLoans]);

  return {
    isInitialized,
    allCases,
    clientsMap,
  };
}