import React from "react";
import { formatTxDate } from "../../../utils/dateUtils"; 
import styles from "./CaseListItem.module.scss";

export default function CaseListItem({ c, clientObj, isSelected, onClick }) {
  const typeLabel = c.type === "Deposit" ? "Cash-in" : "Cash-out";
  const scoreClass = c.status === "Fraud" ? styles.fraudScore : styles.highRiskScore;

  return (
    <div
      className={`${styles.caseItem} ${isSelected ? styles.activeCase : ""}`}
      onClick={onClick}
    >
      <div className={styles.caseMainInfo}>
        <span className={styles.name}>
          {clientObj ? `${clientObj.firstName} ${clientObj.lastName}` : `User #${c.clientId}`}
        </span>
        <div className={styles.metaVerticalStack}>
          <span className={styles.txId}>#{c.id.substring(0, 7)}</span>
          <span className={styles.date}>{formatTxDate(c.date)}</span>
        </div>
      </div>

      <div className={styles.caseRightSide}>
        <div className={styles.badgeAndAmount}>
          <span className={`${styles.typeBadge} ${typeLabel === "Cash-in" ? styles.cashIn : styles.cashOut}`}>
            {typeLabel}
          </span>
          <span className={styles.amount}>
            ${c.amount?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className={`${styles.scoreSquare} ${scoreClass}`}>
          {c.stableScore}
        </div>
      </div>
    </div>
  );
}