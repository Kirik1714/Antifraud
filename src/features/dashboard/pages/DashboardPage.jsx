import React from "react";
// Импортируем строго те имена, которые задекларированы в твоем файле утилит
import { ArrowLeftRight, Percent, Hourglass, XIcon, LoaderIcon } from "../../../components/ui/Icons";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import DashboardCard from "../components/DashboardCard";
import StatCard from "../components/StatCard";
import styles from "./DashboardPage.module.scss";
import { useDashboardData } from "../../../hooks/useDashboardData";

const PIE_COLORS = ['#1a73e8', '#7bb1f5', '#cbdff9'];

export default function DashboardPage() {
  const data = useDashboardData();

  // Loading state boundary view while HTTP responses are pending
  if (data.isLoading) {
    return (
      <main className={`${styles.dashboardContainer} ${styles.containerCentered}`}>
        <LoaderIcon size={64} className={`${styles.iconOrange} ${styles.spinnerRotate}`} />
        <p className={styles.loadingText}>Syncing financial transaction ledgers...</p>
      </main>
    );
  }

  return (
    <main className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>FRAUD MANAGEMENT DASHBOARD</h1>

      <div className={styles.dashboardGrid}>
        
        {/* COMPONENT A: Total financial volume breakdown pie chart overview */}
        <DashboardCard className={styles.mainPieCard} styles={styles}>
          <p className={styles.cardTitle}>Processed Transactions</p>
          <div className={styles.pieChartWrapper}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0} 
                  outerRadius={100} 
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.pieCounterSection}>
            <h2 className={styles.mainTotalValue}>
              {data.totalCount.toLocaleString("en-US")}
            </h2>
            <div className={styles.legendList}>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotDeposits}`}></span>
                <span>Deposits</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotLoans}`}></span>
                <span>Loans</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dotWithdrawals}`}></span>
                <span>Withdrawals</span>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* COMPONENT B: High-level quantitative status summary cards metrics */}
        <StatCard 
          icon={ArrowLeftRight} 
          iconClass="iconBlue" 
          value={data.totalCount.toLocaleString("en-US")} 
          title="All transactions" 
          styles={styles} 
        />
        <StatCard 
          icon={Percent} 
          iconClass="iconGreen" 
          value={`${data.approvalRatePercent}%`} 
          title="Approval Rate" 
          styles={styles} 
        />
        <StatCard 
          icon={Hourglass} 
          iconClass="iconLightBlue" 
          value={data.pendingCount.toLocaleString("en-US")} 
          title="Pending Approval" 
          styles={styles} 
        />

        <DashboardCard styles={styles}>
          <div className={styles.progressCircleWrapper}>
            <div className={styles.progressCircleSizeHost}> 
              <CircularProgressbar
                value={data.safePercentage} 
                text={data.approvedCount.toLocaleString("en-US")} 
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
          <div className={`${styles.iconWrapper} ${styles.iconRed}`}><XIcon size={40} /></div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardValue}>{data.rejectedCount.toLocaleString("en-US")}</h2>
            <p className={styles.cardSub}>Rejected Transactions</p>
          </div>
          <button className={styles.analyzeBtn}>Analyze</button>
        </DashboardCard>

        <DashboardCard isActionCard styles={styles}>

          <div className={`${styles.iconWrapper} ${styles.iconOrange} ${styles.spinnerRotate}`}><LoaderIcon size={40} /></div>
          <div className={styles.cardContent}>
            <h2 className={styles.cardValue}>{data.postponedCount.toLocaleString("en-US")}</h2>
            <p className={styles.cardSub}>Postponed Approval</p>
          </div>
          <button className={styles.analyzeBtn}>Analyze</button>
        </DashboardCard>

      </div>
    </main>
  );
}