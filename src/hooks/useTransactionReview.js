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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTxId = searchParams.get("txId");
  const dispatch = useDispatch();
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  useGetWithdrawTransactionsQuery();
  useGetDepositTransactionsQuery();
  useGetLoanTransactionsQuery();
  useGetClientsQuery({ limit: 100, skip: 0 });

  const { withdraws, deposits, loans, clients, isInitialized } = useSelector(
    (state) => state.transactions,
  );

  const clientsMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < clients.length; i++) {
      map[clients[i].id] = clients[i];
    }
    return map;
  }, [clients]);

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

  useEffect(() => {
    if (!urlTxId && allCases.length > 0) {
      setSearchParams({ txId: allCases[0].id });
    }
  }, [allCases, urlTxId, setSearchParams]);

  const currentCase = useMemo(
    () => allCases.find((c) => c.id === urlTxId),
    [allCases, urlTxId],
  );

  const currentClient = useMemo(
    () => (currentCase ? clientsMap[currentCase.clientId] || null : null),
    [currentCase, clientsMap],
  );

  const handleDecision = (newStatus) => {
    if (!currentCase) return;

    const currentIndex = allCases.findIndex((c) => c.id === currentCase.id);

    dispatch(
      updateStatusGlobally({
        id: currentCase.id,
        type: currentCase.type,
        newStatus,
      }),
    );

    if (newStatus === "Declined" && currentCase.type === "Withdraw") {
      dispatch(
        updateClientBalanceGlobally({
          clientId: currentCase.clientId,
          amount: currentCase.amount,
        }),
      );
    }

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