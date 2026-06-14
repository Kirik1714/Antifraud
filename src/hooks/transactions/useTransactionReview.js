import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useTransactionQueue } from "./useTransactionQueue"; 
import {
  updateStatusGlobally,
  updateClientBalanceGlobally,
} from "../../features/transactions/transactionsSlice"; 


export function useTransactionReview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTxId = searchParams.get("txId");
  const dispatch = useDispatch();
  
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  // Mount the underlying memoized data streaming layer
  const { allCases, clientsMap, isInitialized } = useTransactionQueue();

  // Queue Auto-Selection Rule: fallback to the highest priority pending case when parameters are blank
  useEffect(() => {
    if (!urlTxId && allCases.length > 0) {
      setSearchParams({ txId: allCases[0].id }, { replace: true });
    }
  }, [allCases, urlTxId, setSearchParams]);

  // Query-match execution: bind views directly to the targeted tracking index link
  const currentCase = useMemo(
    () => allCases.find((c) => c.id === urlTxId),
    [allCases, urlTxId]
  );

  // Pull associated account information via instantaneous schema mapping lookup paths
  const currentClient = useMemo(
    () => (currentCase ? clientsMap[currentCase.clientId] || null : null),
    [currentCase, clientsMap]
  );

  // Core execution handler routing critical system updates into global persistence layers
  const handleDecision = useCallback((newStatus) => {
    if (!currentCase) return;

    const currentIndex = allCases.findIndex((c) => c.id === currentCase.id);

    // Commit risk classification status switch within central global store blocks
    dispatch(
      updateStatusGlobally({
        id: currentCase.id,
        type: currentCase.type,
        newStatus,
      }),
    );

  // Automated Dispute Chargeback Reversal: reimburse stolen credit pools immediately if a threat is neutralized
    if (newStatus === "Declined" && currentCase.type === "Withdraw") {
      dispatch(
        updateClientBalanceGlobally({
          clientId: currentCase.clientId,
          amount: currentCase.amount,
        }),
      );
    }

    // Automated Queue Flow Transition: index onto the subsequent file, or remove query strings if clear
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
  }, [currentCase, allCases, dispatch, searchParams, setSearchParams]);

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