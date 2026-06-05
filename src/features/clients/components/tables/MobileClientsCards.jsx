import React from "react";
import styles from "../../pages/ClientsPage.module.scss";

export default function MobileClientsCards({ filteredUsers }) {
  return (
    <div className={styles.mobileClientCardContainer}>
      {filteredUsers.map((user, idx) => (
        <div key={user.id || idx} className={styles.mobileClientCard}>
          <div className={styles.mobileClientCardHeader}>
            <span className={styles.mobileClientCardName}>
              {user.firstName} {user.lastName}
            </span>
            <span className={styles.balancePositive}>
              ${user.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className={styles.mobileClientCardBody}>
            <span><b>CID:</b> {user.id || idx + 1}</span>
            <span><b>Location:</b> {user.address?.city}, {user.address?.state} • {user.address?.address}</span>
            <span><b>Phone:</b> {user.phone || "+81 965-431-3024"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}