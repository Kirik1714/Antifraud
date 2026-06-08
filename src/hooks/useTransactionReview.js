import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMemo, useState, useEffect } from "react";
import {
  useGetWithdrawTransactionsQuery,
  useGetDepositTransactionsQuery,
  useGetLoanTransactionsQuery,
  useGetClientsQuery,
} from "../features/clients/clientsSlice";
import {
  updateStatusGlobally,
  updateClientBalanceGlobally,
} from "../features/transactions/transactionsSlice";
import { getStableScore } from "../utils/geoUtils";

export function useTransactionReview() {
  // Read and manage the transaction ID parameter in the browser URL (?txId=...)
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTxId = searchParams.get("txId");
  const dispatch = useDispatch();
  
  // Tab switcher state for the right panel details (Scoring Info / Location Map)
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  // Trigger background asynchronous data fetching via RTK Query
  useGetWithdrawTransactionsQuery();
  useGetDepositTransactionsQuery();
  useGetLoanTransactionsQuery();
  useGetClientsQuery({ limit: 100, skip: 0 });

  // Select up-to-date transaction arrays from Redux (already synced with localStorage)
  const { withdraws, deposits, loans, clients, isInitialized } = useSelector( 
    (state) => state.transactions,
  );

  // High-performance dictionary lookup: transform array to object format -> { client_id: client_data }
  const clientsMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < clients.length; i++) {
      map[clients[i].id] = clients[i];
    }
    return map;
  }, [clients]);

  // Build investigation backlog queue: merge streams, filter for high-risk flags, and inject risk scores
  const allCases = useMemo(() => {
    const combined = [
      ...withdraws.map((t) => ({ ...t, type: "Withdraw" })),
      ...deposits.map((t) => ({ ...t, type: "Deposit" })),
      ...loans.map((t) => ({ ...t, type: "Loan" })),
    ];

    return combined
      .filter((t) => t.status === "High Risk" || t.status === "Fraud")
      .map((t) => ({
        ...t,
        stableScore: getStableScore(t.id, t.status),
      }));
  }, [withdraws, deposits, loans]);

  // Queue Auto-Selection: if URL query is empty, automatically open the first case file in line
  useEffect(() => {
    if (!urlTxId && allCases.length > 0) {
      setSearchParams({ txId: allCases[0].id });
    }
  }, [allCases, urlTxId, setSearchParams]);

  // Find the exact transaction object currently selected by the browser URL reference
  const currentCase = useMemo(
    () => allCases.find((c) => c.id === urlTxId),
    [allCases, urlTxId],
  );

  // Link client profile parameters directly to the currently loaded investigation case file
  const currentClient = useMemo(
    () => (currentCase ? clientsMap[currentCase.clientId] || null : null),
    [currentCase, clientsMap],
  );

  // Master handler triggered by interactive workflow action keys ("Approve" / "Decline")
  const handleDecision = (newStatus) => {
    if (!currentCase) return;

    // Track original array sequence position of the case before updating its state
    const currentIndex = allCases.findIndex((c) => c.id === currentCase.id);

    // 1. Commit status change locally within Redux state tree and sync to localStorage
    dispatch(
      updateStatusGlobally({
        id: currentCase.id,
        type: currentCase.type,
        newStatus,
      }),
    );

    // 2. Automated Chargeback Reversal: if a fraudulent withdrawal is declined, return money to user balance
    if (newStatus === "Declined" && currentCase.type === "Withdraw") {
      dispatch(
        updateClientBalanceGlobally({
          clientId: currentCase.clientId,
          amount: currentCase.amount,
        }),
      );
    }

    // Automated Queue Advancement: cycle parameters to pull up the next pending investigation file
    if (allCases.length > 1) {
      const nextIndex =
        currentIndex === allCases.length - 1
          ? currentIndex - 1 
          : currentIndex + 1; 
      setSearchParams({ txId: allCases[nextIndex].id });
    } else {
      searchParams.delete("txId");
      setSearchParams(searchParams);
    }
  };

  return {
    isInitialized,
    allCases,
    urlTxId,
    currentCase,
    currentClient,
    clientsMap,
    activeDetailTab,
    setActiveDetailTab,
    handleDecision,
    setSearchParams,
  };
}