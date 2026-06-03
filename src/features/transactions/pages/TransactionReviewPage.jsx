import React, { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetWithdrawTransactionsQuery,
  useGetDepositTransactionsQuery,
  useGetLoanTransactionsQuery,
  useGetClientsQuery,
} from "../../clients/clientsSlice";
import {
  updateStatusGlobally,
  updateClientBalanceGlobally,
} from "../transactionsSlice";
import { getStableScore } from "../../../utils/geoUtils";
import { formatTxDate } from "../../../utils/dateUtils";

import CaseListItem from "../components/CaseListItem";
import CaseDetailsHeader from "../components/CaseDetailsHeader";
import TerminalMap from "../components/TerminalMap";
import styles from "./TransactionReviewPage.module.scss";

export default function TransactionReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTxId = searchParams.get("txId");
  const dispatch = useDispatch();

  const [activeDetailTab, setActiveDetailTab] = useState("info"); 

  // Запуск хуков RTK Query
  const { isLoading: wLoading } = useGetWithdrawTransactionsQuery();
  const { isLoading: dLoading } = useGetDepositTransactionsQuery();
  const { isLoading: lLoading } = useGetLoanTransactionsQuery();
  const { isLoading: cLoading } = useGetClientsQuery({ limit: 100, skip: 0 });

  const { withdraws, deposits, loans, clients, isInitialized } = useSelector(
    (state) => state.transactions,
  );

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
    () =>
      currentCase ? clients.find((u) => u.id === currentCase.clientId) : null,
    [currentCase, clients],
  );

  const handleDecision = (newStatus) => {
    if (!currentCase) return;

    const currentIndex = allCases.findIndex((c) => c.id === currentCase.id);

    dispatch(
      updateStatusGlobally({
        id: currentCase.id,
        type: currentCase.type,
        newStatus: newStatus,
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

  if (!isInitialized) {
    return (
      <div className={styles.layoutWrapper}>
        <div className={styles.centered}>
          <div className={styles.spinner}></div>
          <span>Initializing secure store...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.contentArea}>
        <div className={styles.workspace}>
          <div className={styles.caseList}>
            {allCases.map((c) => (
              <CaseListItem
                key={c.id}
                c={c}
                clientObj={clients.find((u) => u.id === c.clientId)}
                isSelected={c.id === urlTxId}
                onClick={() => setSearchParams({ txId: c.id })}
              />
            ))}
          </div>

          {currentCase ? (
            <div className={styles.caseDetails}>
              <div className={styles.alertHeader}>
                Fraudulent Activity Alert
              </div>
              <CaseDetailsHeader
                currentCase={currentCase}
                currentClient={currentClient}
              />

              <div className={styles.detailTabsHeader}>
                <button
                  className={`${styles.detailTabBtn} ${activeDetailTab === "info" ? styles.activeDetailTab : ""}`}
                  onClick={() => setActiveDetailTab("info")}
                >
                  Scoring Info
                </button>
                <button
                  className={`${styles.detailTabBtn} ${activeDetailTab === "map" ? styles.activeDetailTab : ""}`}
                  onClick={() => setActiveDetailTab("map")}
                >
                  Location Map
                </button>
              </div>

              <div className={styles.gridInfo}>
                <div className={`${styles.leftInfoColumn} ${activeDetailTab === "info" ? "" : styles.hideOnTabToggle}`}>
                  <div className={styles.infoBlock}>
                    <h3>Summary</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Risk Status</span>
                      <span
                        className={styles.value}
                        style={{
                          color: currentCase.status === "Fraud" ? "#c5221f" : "#b06000",
                        }}
                      >
                        {currentCase.status}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>CVV2 Verification</span>
                      <span className={styles.success}>Match (M)</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Payment Method</span>
                      <span className={styles.value}>
                        {currentCase.method || "VISA"}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Issuing Bank</span>
                      <span className={styles.value}>
                        AMERICAN EXPRESS INTERNATIONAL (NZ) INC.
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoBlock}>
                    <h3>Account</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Account Number</span>
                      <span className={styles.value}>488754555</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Order Amount</span>
                      <span className={styles.value}>
                        $
                        {currentCase.amount?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Creation Date</span>
                      <span className={styles.value}>
                        {formatTxDate(currentCase.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.infoBlock} ${styles.atmBlock} ${activeDetailTab === "map" ? "" : styles.hideOnTabToggle}`}>
                  <h3>ATM</h3>
                  <div className={styles.atmAddressText}>
                    {currentClient?.address?.address || "547 First Street"}
                  </div>
                  <div className={styles.mapFlexHost}>
                    <TerminalMap
                      cityName={currentClient?.address?.city}
                      addressText={currentClient?.address?.address}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.bottomActions}>
                <button
                  className={styles.btnApprove}
                  onClick={() => handleDecision("Approved")}
                >
                  Approve
                </button>
                <button
                  className={styles.btnDecline}
                  onClick={() => handleDecision("Declined")}
                >
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.centered}>
              Select a transaction case to start investigation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}