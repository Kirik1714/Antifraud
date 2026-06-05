import React from 'react';
import styles from '../../pages/ClientsPage.module.scss';
import { ArrowUpRight, ArrowDownLeft, Percent } from 'lucide-react';

export default function HistoryTable({ transactions }) {
  const getStatusClass = (status) => {
    if (status === 'Fraud') return styles.statusFraud;
    if (status === 'High Risk') return styles.statusHighRisk;
    return styles.statusApproved;
  };

  const getAmountClass = (type) => {
    if (type === 'Deposit') return styles.amountDeposit;
    if (type === 'Withdraw') return styles.amountWithdraw;
    return styles.amountDefault;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.clientsTable} ${styles.hideOnMobile}`}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Client ID</th>
            <th>Type</th>
            <th>Amount (USD)</th>
            <th>Method / Description</th>
            <th>System Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx) => (
            <tr key={tx.id}>
              <td className={styles.linkText}>{tx.id}</td>
              <td>User #{tx.clientId}</td>
              <td>
                <span className={styles.statusTextWrapper}>
                  {tx.operationType === 'Deposit' && <ArrowDownLeft size={14} className={styles.iconGreen} />}
                  {tx.operationType === 'Withdraw' && <ArrowUpRight size={14} className={styles.iconRed} />}
                  {tx.operationType === 'Loan' && <Percent size={14} className={styles.iconBlue} />}
                  {tx.operationType}
                </span>
              </td>
              <td className={`${styles.boldText} ${getAmountClass(tx.operationType)}`}>
                {tx.operationType === 'Deposit' ? '+' : tx.operationType === 'Withdraw' ? '-' : ''}
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td>{tx.method}</td>
              <td className={`${styles.boldText} ${getStatusClass(tx.status)}`}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.mobileCardsGrid}>
        {transactions?.map((tx) => (
          <div key={tx.id} className={`${styles.mobileCard} ${getStatusClass(tx.status + 'Border')}`}>
            <div className={styles.cardHeader}>
              <span className={styles.linkText}>TX #{tx.id}</span>
              <span className={`${styles.cardAmount} ${getAmountClass(tx.operationType)}`}>
                {tx.operationType === 'Deposit' ? '+' : tx.operationType === 'Withdraw' ? '-' : ''}
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p><b>Client:</b> User #{tx.clientId}</p>
              <p>
                <b>Type:</b> 
                <span className={styles.mobileStatusTextWrapper}>
                  {tx.operationType === 'Deposit' && <ArrowDownLeft size={14} className={styles.iconGreen} />}
                  {tx.operationType === 'Withdraw' && <ArrowUpRight size={14} className={styles.iconRed} />}
                  {tx.operationType === 'Loan' && <Percent size={14} className={styles.iconBlue} />}
                  {tx.operationType}
                </span>
              </p>
              <p><b>Method:</b> {tx.method}</p>
              <p><b>Status:</b> <span className={`${styles.boldText} ${getStatusClass(tx.status)}`}>{tx.status}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}