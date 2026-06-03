import React from 'react';
import styles from '../pages/DashboardPage.module.scss';

export default function DashboardCard({ children, className = '', isActionCard = false }) {
  const cardClasses = [
    styles.card,
    isActionCard ? styles.cardWithAction : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}