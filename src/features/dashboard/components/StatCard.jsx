import React from 'react';
import DashboardCard from './DashboardCard';
import styles from '../pages/DashboardPage.module.scss';


export default function StatCard({ icon: Icon, iconClass, value, title }) {
  return (
    <DashboardCard>
      <div className={`${styles.iconWrapper} ${styles[iconClass]}`}>
        <Icon size={40} />
      </div>
      
      <div className={styles.cardContent}>
        <h2 className={styles.cardValue}>{value}</h2>
        <p className={styles.cardSub}>{title}</p>
      </div>
    </DashboardCard>
  );
}