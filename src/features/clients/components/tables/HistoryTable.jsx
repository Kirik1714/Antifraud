import React from 'react';
import styles from '../../pages/ClientsPage.module.scss';
import { ArrowUpRight, ArrowDownLeft, Percent } from 'lucide-react';

export default function HistoryTable({ transactions }) {
  const getStatusColor = (status) => {
    if (status === 'Fraud') return '#c5221f';
    if (status === 'High Risk') return '#b06000';
    return '#137333';
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
                <span className={styles.statusText} style={{ fontWeight: 600 }}>
                  {tx.operationType === 'Deposit' && <ArrowDownLeft size={14} style={{ color: '#137333' }} />}
                  {tx.operationType === 'Withdraw' && <ArrowUpRight size={14} style={{ color: '#c5221f' }} />}
                  {tx.operationType === 'Loan' && <Percent size={14} style={{ color: '#1a73e8' }} />}
                  {tx.operationType}
                </span>
              </td>
              <td className={styles.boldText} style={{
                color: tx.operationType === 'Deposit' ? '#137333' : tx.operationType === 'Withdraw' ? '#c5221f' : '#000000'
              }}>
                {tx.operationType === 'Deposit' ? '+' : tx.operationType === 'Withdraw' ? '-' : ''}
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td>{tx.method}</td>
              <td className={styles.boldText} style={{ color: getStatusColor(tx.status) }}>
                {tx.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.mobileCardsGrid}>
        {transactions?.map((tx) => (
          <div key={tx.id} className={styles.mobileCard} style={{ borderLeft: `4px solid ${getStatusColor(tx.status)}` }}>
            <div className={styles.cardHeader}>
              <span className={styles.linkText}>TX #{tx.id}</span>
              <span className={styles.cardAmount} style={{
                fontWeight: 600,
                color: tx.operationType === 'Deposit' ? '#137333' : tx.operationType === 'Withdraw' ? '#c5221f' : '#000000'
              }}>
                {tx.operationType === 'Deposit' ? '+' : tx.operationType === 'Withdraw' ? '-' : ''}
                ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.cardBody}>
              <p><b>Client:</b> User #{tx.clientId}</p>
              <p>
                <b>Type:</b> 
                <span className={styles.statusText} style={{ display: 'inline-flex', marginLeft: '6px', fontWeight: 500 }}>
                  {tx.operationType === 'Deposit' && <ArrowDownLeft size={14} style={{ color: '#137333', marginRight: '2px' }} />}
                  {tx.operationType === 'Withdraw' && <ArrowUpRight size={14} style={{ color: '#c5221f', marginRight: '2px' }} />}
                  {tx.operationType === 'Loan' && <Percent size={14} style={{ color: '#1a73e8', marginRight: '2px' }} />}
                  {tx.operationType}
                </span>
              </p>
              <p><b>Method:</b> {tx.method}</p>
              <p><b>Status:</b> <span style={{ fontWeight: 600, color: getStatusColor(tx.status) }}>{tx.status}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}