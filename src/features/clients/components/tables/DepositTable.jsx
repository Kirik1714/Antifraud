import React from 'react';
import styles from '../../pages/ClientsPage.module.scss';
import {ShieldCheck} from '../../../../components/ui/Icons'

export default function DepositTable({ transactions }) {
  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.clientsTable} ${styles.hideOnMobile}`}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Client ID</th>
            <th>Amount (USD)</th>
            <th>Method</th>
            <th>Risk Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx) => (
            <tr key={tx.id} className={styles.rowApproved}>
              <td className={styles.linkText}>{tx.id}</td>
              <td className={styles.boldText}>User #{tx.clientId}</td>
              <td className={`${styles.boldText} ${styles.amountDeposit}`}>
                +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td>{tx.method}</td>
              <td>
                <span className={styles.statusText}>
                  <ShieldCheck size={16} className={styles.iconGreen} /> Approved
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.mobileCardsGrid}> 
        {transactions?.map((tx) => (
          <div key={tx.id} className={`${styles.mobileCard} ${styles.rowApproved}`}>
            <div className={styles.cardHeader}>
              <span className={styles.linkText}>TX #{tx.id}</span>
              <span className={`${styles.cardAmount} ${styles.amountDeposit}`}>
                +${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p><b>Client:</b> User #{tx.clientId}</p>
              <p><b>Method:</b> {tx.method}</p>
              <p className={styles.statusFlex}>
                <b>Status:</b> 
                <span className={styles.statusText}>
                  <ShieldCheck size={14} className={styles.iconGreen} /> Approved
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}