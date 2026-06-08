import React from "react";
import { formatTxDate } from "../../../utils/dateUtils";
import { useTransactionReview } from "../../../hooks/useTransactionReview";

import CaseListItem from "../components/CaseListItem";
import CaseDetailsHeader from "../components/CaseDetailsHeader";
import TerminalMap from "../components/TerminalMap";
import styles from "./TransactionReviewPage.module.scss";

export default function TransactionReviewPage() {
  const data = useTransactionReview();

  if (!data.isInitialized) {
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
            {data.allCases.map((c) => (
              <CaseListItem
                key={c.id}
                c={c}
                clientObj={data.clientsMap[c.clientId]}
                isSelected={c.id === data.urlTxId}
                onClick={() => data.setSearchParams({ txId: c.id })}
              />
            ))}
          </div>

          {data.currentCase ? (
            <div className={styles.caseDetails}>
              <div className={styles.alertHeader}>
                Fraudulent Activity Alert
              </div>
              <CaseDetailsHeader
                currentCase={data.currentCase}
                currentClient={data.currentClient}
              />

              <div className={styles.detailTabsHeader}>
                <button
                  className={`${styles.detailTabBtn} ${data.activeDetailTab === "info" ? styles.activeDetailTab : ""}`}
                  onClick={() => data.setActiveDetailTab("info")}
                >
                  Scoring Info
                </button> 
                <button
                  className={`${styles.detailTabBtn} ${data.activeDetailTab === "map" ? styles.activeDetailTab : ""}`}
                  onClick={() => data.setActiveDetailTab("map")}
                >
                  Location Map
                </button>
              </div>

              <div className={styles.gridInfo}>
                <div className={`${styles.leftInfoColumn} ${data.activeDetailTab === "info" ? "" : styles.hideOnTabToggle}`}>
                  <div className={styles.infoBlock}>
                    <h3>Summary</h3>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Risk Status</span>
                      <span className={`${styles.value} ${data.currentCase.status === "Fraud" ? styles.statusTextFraud : styles.statusTextHighRisk}`}>
                        {data.currentCase.status}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>CVV2 Verification</span>
                      <span className={styles.success}>Match (M)</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Payment Method</span>
                      <span className={styles.value}>
                        {data.currentCase.method || "VISA"}
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
                        {data.currentCase.amount?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Creation Date</span>
                      <span className={styles.value}>
                        {formatTxDate(data.currentCase.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`${styles.infoBlock} ${styles.atmBlock} ${data.activeDetailTab === "map" ? "" : styles.hideOnTabToggle}`}>
                  <h3>ATM</h3>
                  <div className={styles.atmAddressText}>
                    {data.currentClient?.address?.address || "547 First Street"}
                  </div>
                  <div className={styles.mapFlexHost}>
                    <TerminalMap
                      cityName={data.currentClient?.address?.city}
                      addressText={data.currentClient?.address?.address}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.bottomActions}>
                <button
                  className={styles.btnApprove}
                  onClick={() => data.handleDecision("Approved")}
                >
                  Approve
                </button>
                <button
                  className={styles.btnDecline}
                  onClick={() => data.handleDecision("Declined")}
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