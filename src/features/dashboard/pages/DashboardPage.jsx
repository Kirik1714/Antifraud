import React, { useMemo, useEffect } from "react";
import { useSelector } from "react-redux"; 
import { ArrowLeftRight, Percent, Hourglass, X, Loader } from "lucide-react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";
import styles from "./DashboardPage.module.scss";

import { 
  useGetWithdrawTransactionsQuery, 
  useGetDepositTransactionsQuery, 
  useGetLoanTransactionsQuery 
} from "../../clients/clientsSlice"; 

const PIE_COLORS = ['#1a73e8', '#7bb1f5', '#cbdff9'];

export default function DashboardPage() {
  const { isLoading: loadingWithdraws } = useGetWithdrawTransactionsQuery();
  const { isLoading: loadingDeposits } = useGetDepositTransactionsQuery();
  const { isLoading: loadingLoans } = useGetLoanTransactionsQuery();

  const withdraws = useSelector((state) => state.transactions.withdraws) || [];
  const deposits = useSelector((state) => state.transactions.deposits) || [];
  const loans = useSelector((state) => state.transactions.loans) || [];

  if (loadingWithdraws || loadingDeposits || loadingLoans) {
    return (
      <div className={styles.dashboardContainer} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Loader size={64} className={styles.iconOrange} style={{ animation: 'spin 2s linear infinite' }} />
        <p style={{ marginTop: 16, color: '#1a73e8', fontWeight: 500 }}>Загрузка финансовых транзакций...</p>
      </div>
    );
  }

  const allTransactions = [...withdraws, ...deposits, ...loans];
  const totalCount = allTransactions.length;
  
  const approvedCount = allTransactions.filter(tx => tx.status === "Approved").length;
  const postponedCount = allTransactions.filter(tx => tx.status === "High Risk").length;
  const rejectedCount = allTransactions.filter(tx => tx.status === "Fraud").length;
  const pendingCount = totalCount - approvedCount - postponedCount - rejectedCount;

  const approvalRatePercent = totalCount > 0 
    ? ((approvedCount / totalCount) * 100).toFixed(1) 
    : "0.0";

  const safePercentage = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const totalDepositsAmount = deposits.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalLoansAmount = loans.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalWithdrawsAmount = withdraws.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  const pieData = [
    { name: 'Deposits', value: totalDepositsAmount },    
    { name: 'Loans', value: totalLoansAmount },       
    { name: 'Withdrawals', value: totalWithdrawsAmount },  
  ];

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>FRAUD MANAGEMENT DASHBOARD</h1>

      <div className={styles.dashboardGrid}>
        
        <DashboardCard className={styles.mainPieCard} styles={styles}>
          <p className={styles.cardTitle}>Processed Transactions</p>
          <div className={styles.pieChartWrapper}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0} 
                  outerRadius={100} 
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.pieCounterSection}>
            <h2 className={styles.mainTotalValue}>
              {totalCount.toLocaleString("fr-FR")}
            </h2>
            <div className={styles.legendList}>
              <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotDeposits}`}></span><span>Deposits</span></div>
              <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotLoans}`}></span><span>Loans</span></div>
              <div className={styles.legendItem}><span className={`${styles.dot} ${styles.dotWithdrawals}`}></span><span>Withdrawals</span></div>
            </div>
          </div>
        </DashboardCard>

        <StatCard 
          icon={ArrowLeftRight} 
          iconClass="iconBlue" 
          value={totalCount.toLocaleString("fr-FR")} 
          title="All transactions" 
          styles={styles} 
        />
        <StatCard 
          icon={Percent} 
          iconClass="iconGreen" 
          value={`${approvalRatePercent}%`} 
          title="Approval Rate" 
          styles={styles} 
        />
        <StatCard 
          icon={Hourglass} 
          iconClass="iconLightBlue" 
          value={pendingCount} 
          title="Pending Approval" 
          styles={styles} 
        />

        <DashboardCard styles={styles}>
          <div className={styles.progressCircleWrapper}>
            <div style={{ width: 140, height: 140, position: 'relative' }}> 
              <CircularProgressbar
                value={safePercentage} 
                text={approvedCount.toLocaleString("fr-FR")} 
                styles={buildStyles({
                  pathColor: '#45D700',   
                  trailColor: '#ff5c5c',  
                  textColor: '#1a202c',   
                  textSize: '18px',      
                  strokeLinecap: 'butt',  
                })}
              />
            </div>
          </div>
          <p className={styles.cardSubCenter}>Approved Transactions</p>
        </DashboardCard>

        <DashboardCard isActionCard styles={styles}>
          <div className={`${styles.iconWrapper} ${styles.iconRed}`}><X size={40} /></div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardValue}>{rejectedCount}</h2>
            <p className={styles.cardSub}>Rejected Transactions</p>
          </div>
          <button className={styles.analyzeBtn}>Analyze</button>
        </DashboardCard>

        <DashboardCard isActionCard styles={styles}>
          <div className={`${styles.iconWrapper} ${styles.iconOrange}`}><Loader size={40} /></div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardValue}>{postponedCount}</h2>
            <p className={styles.cardSub}>Postponed Approval</p>
          </div>
          <button className={styles.analyzeBtn}>Analyze</button>
        </DashboardCard>

      </div>
    </div>
  );
}