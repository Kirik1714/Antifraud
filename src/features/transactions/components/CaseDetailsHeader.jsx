import React from "react";
import { formatTxDate } from "../../../utils/dateUtils"; 
import styles from "./CaseDetailsHeader.module.scss";

export default function CaseDetailsHeader({ currentCase, currentClient }) {
  const typeLabel = currentCase.type === "Deposit" ? "Cash-in" : "Cash-out";

  const riskClass = currentCase.status === "Fraud" ? styles.isFraud : styles.isHighRisk;

  return (
    <div className={`${styles.heroCard} ${riskClass}`}>
      <div className={styles.heroLeftContainer}>
        <div className={styles.heroScoreSquare}>
          {currentCase.stableScore}
        </div>

        <div className={styles.heroMetaText}>
          <div className={styles.clientTitle}>
            {currentClient ? `${currentClient.firstName} ${currentClient.lastName}` : `User #${currentCase.clientId}`}
          </div>
          <div className={styles.heroSubRow}>
            <span className={styles.heroTxId}>#{currentCase.id.substring(0, 7)}</span>
            <span className={styles.heroDate}>{formatTxDate(currentCase.date)}</span>
          </div>
        </div>
      </div>

      <div className={styles.heroRightContainer}>
        <span className={styles.heroTypeBadge}>{typeLabel}</span>
        <div className={styles.heroAmount}>
          <span className={styles.currencySign}>$</span>
          {currentCase.amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </div>
      </div>
    </div>
  );
}