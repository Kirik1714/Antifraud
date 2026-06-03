import React from 'react';
import styles from './TopNavigation.module.scss';

export default function TopNavigation({ activeTab, setActiveTab }) {
  const tabs = ['Clients', 'Deposit', 'Withdraw', 'Loans', 'Transaction History'];

  return (
   <div className={styles.tabsContainer}>
      {tabs.map((tab, idx) => (
        <button 
          key={idx} 
          className={`${styles.tab} ${tab === activeTab ? styles.active : ''}`}
       
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}