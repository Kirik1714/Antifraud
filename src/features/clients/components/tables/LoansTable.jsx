import React from 'react';
import styles from '../../pages/ClientsPage.module.scss';
import { AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function LoansTable({ transactions }) {
  const getRowClass = (status) => {
    switch (status) {
      case 'Fraud': return styles.rowFraud;
      case 'High Risk': return styles.rowHighRisk;
      case 'Approved': return styles.rowApproved;
      default: return '';
    }
  };

  const renderStatusIcon = (status, size = 16) => {
    if (status === 'Approved') return <ShieldCheck size={size} className={styles.iconGreen} />;
    if (status === 'High Risk') return <AlertTriangle size={size} className={styles.iconOrange} />;
    if (status === 'Fraud') return <ShieldAlert size={size} className={styles.iconRed} />;
    return null;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.clientsTable} ${styles.hideOnMobile}`}>
        <thead>
          <tr>
            <th>Loan ID</th>
            <th>Client ID</th>
            <th>Requested Amount</th>
            <th>Loan Type</th>
            <th>Risk Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx) => (
            <tr key={tx.id} className={getRowClass(tx.status)}>
              <td className={styles.linkText}>{tx.id}</td>
              <td className={styles.boldText}>User #{tx.clientId}</td>
              <td className={styles.boldText}>
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td>{tx.method}</td>
              <td>
                <span className={styles.statusText}>
                  {renderStatusIcon(tx.status)} {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.mobileCardsGrid}>
        {transactions?.map((tx) => (
          <div key={tx.id} className={`${styles.mobileCard} ${getRowClass(tx.status)}`}>
            <div className={styles.cardHeader}>
              <span className={styles.linkText}>LOAN #{tx.id}</span>
              <span className={styles.boldText}>
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p><b>Client:</b> User #{tx.clientId}</p>
              <p><b>Type:</b> {tx.method}</p>
              <p className={styles.statusFlex}>
                <b>Status:</b> 
                <span className={styles.statusText}>
                  {renderStatusIcon(tx.status, 14)} {tx.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}