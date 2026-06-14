import React from 'react';
import styles from '../../pages/ClientsPage.module.scss';

export default function ClientsTable({ filteredUsers }) {
  
  return (
    <div className={styles.tableContainer}>
      <table className={styles.clientsTable}>
        <thead>
          <tr>
            <th>CID</th>
            <th>Full Name</th>
            <th>City</th>
            <th>State</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Acc Balance</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className={styles.boldText}>{user.firstName} {user.lastName}</td>
                <td>{user.address?.city || 'N/A'}</td>
                <td className={styles.uppercaseText}>{user.address?.stateCode || 'NY'}</td>
                <td>{user.address?.address || 'N/A'}</td>
                <td>{user.phone}</td>
                
                <td className={`${styles.boldText} ${styles.balancePositive}`}>
                  {`$${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className={styles.emptyRow}>
                No clients found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}